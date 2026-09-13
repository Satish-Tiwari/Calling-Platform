import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Call } from './call.entity';
import { Message } from './message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  displayName: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, select: false })
  otpCode: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  otpExpiresAt: Date;

  @Column({ nullable: true, select: false })
  otpPurpose: string;

  @Column({ default: 'Available for calls 💬' })
  statusMessage: string;

  @Column({ default: 'dark' })
  theme: string;

  @OneToMany(() => Call, (call) => call.caller)
  outgoingCalls: Call[];

  @OneToMany(() => Call, (call) => call.callee)
  incomingCalls: Call[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
