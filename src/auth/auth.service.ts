import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import {
  RegisterDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Helper to generate a secure random 6-digit numeric OTP code
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 1. Register Account (generates OTP and sends verification email)
   */
  async register(registerDto: RegisterDto) {
    const existingByUsername = await this.usersService.findByUsername(registerDto.username.toLowerCase());
    if (existingByUsername && existingByUsername.isEmailVerified) {
      throw new ConflictException('Username is already taken');
    }

    const existingByEmail = await this.usersService.findByEmail(registerDto.email.toLowerCase());
    if (existingByEmail && existingByEmail.isEmailVerified) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const otp = this.generateOtp();

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    let user = existingByEmail || existingByUsername;
    if (user && !user.isEmailVerified) {
      // Re-use unverified user record
      user.username = registerDto.username.toLowerCase();
      user.email = registerDto.email.toLowerCase();
      user.displayName = registerDto.displayName;
      user.password = hashedPassword;
      user.avatar = registerDto.avatar || user.avatar || randomAvatar;
      user.statusMessage = registerDto.statusMessage || user.statusMessage || 'Available for calls 💬';
      await this.usersService.create(user);
    } else {
      user = await this.usersService.create({
        username: registerDto.username.toLowerCase(),
        email: registerDto.email.toLowerCase(),
        displayName: registerDto.displayName,
        password: hashedPassword,
        avatar: registerDto.avatar || randomAvatar,
        statusMessage: registerDto.statusMessage || 'Available for calls 💬',
        isEmailVerified: false,
      });
    }

    await this.usersService.saveOtp(user.id, otp, 'verification');
    await this.emailService.sendVerificationOtp(user.email, otp, user.displayName);

    return {
      message: 'Account created. Please verify the 6-digit OTP code sent to your email.',
      email: user.email,
      requiresOtp: true,
    };
  }

  /**
   * 2. Verify Registration OTP and automatically log in
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.usersService.verifyOtp(
      verifyOtpDto.email.toLowerCase(),
      verifyOtpDto.otp,
      'verification',
    );

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Email verified successfully! Welcome to Calling Platform.',
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        statusMessage: user.statusMessage,
        isEmailVerified: user.isEmailVerified,
        theme: user.theme || 'dark',
      },
    };
  }

  /**
   * 3. Resend OTP
   */
  async resendOtp(resendDto: ResendOtpDto) {
    const user = await this.usersService.findByEmail(resendDto.email.toLowerCase());
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    const purpose = resendDto.purpose === 'password_reset' ? 'password_reset' : 'verification';
    const otp = this.generateOtp();

    await this.usersService.saveOtp(user.id, otp, purpose);

    if (purpose === 'password_reset') {
      await this.emailService.sendPasswordResetOtp(user.email, otp, user.displayName);
    } else {
      await this.emailService.sendVerificationOtp(user.email, otp, user.displayName);
    }

    return {
      message: 'A new 6-digit verification code has been sent to your email.',
      email: user.email,
    };
  }

  /**
   * 4. Forgot Password - Request Reset Code
   */
  async forgotPassword(forgotDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotDto.email.toLowerCase());
    if (!user) {
      throw new NotFoundException('No registered user found with this email address');
    }

    const otp = this.generateOtp();
    await this.usersService.saveOtp(user.id, otp, 'password_reset');
    await this.emailService.sendPasswordResetOtp(user.email, otp, user.displayName);

    return {
      message: 'Password reset code has been sent to your email.',
      email: user.email,
    };
  }

  /**
   * 5. Reset Password with OTP
   */
  async resetPassword(resetDto: ResetPasswordDto) {
    const user = await this.usersService.verifyOtp(
      resetDto.email.toLowerCase(),
      resetDto.otp,
      'password_reset',
    );

    const hashed = await bcrypt.hash(resetDto.newPassword, 10);
    await this.usersService.updatePassword(user.id, hashed);

    return {
      message: 'Password reset successful! You can now log in with your new password.',
    };
  }

  /**
   * 6. Login
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsernameOrEmail(loginDto.username.toLowerCase(), true);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // If user registered with email but has not verified yet:
    if (user.email && !user.isEmailVerified) {
      const otp = this.generateOtp();
      await this.usersService.saveOtp(user.id, otp, 'verification');
      await this.emailService.sendVerificationOtp(user.email, otp, user.displayName);

      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Your email has not been verified yet. A new OTP has been sent to your email.',
        requiresOtp: true,
        email: user.email,
      });
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        statusMessage: user.statusMessage,
        isEmailVerified: user.isEmailVerified,
        theme: user.theme || 'dark',
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return await this.usersService.findById(payload.sub);
    } catch {
      return null;
    }
  }
}
