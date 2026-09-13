import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { SignalingGateway } from './signaling/signaling.gateway';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const HTTP_PORT = parseInt(process.env.PORT || '3000', 10);
  const HTTPS_PORT = parseInt(process.env.HTTPS_PORT || '3443', 10);

  // Listen on HTTP for all network interfaces (0.0.0.0)
  await app.listen(HTTP_PORT, '0.0.0.0');

  // Check for SSL certificate to attach HTTPS server for mobile devices
  const sslDir = path.join(__dirname, '..', 'ssl');
  const keyPath = path.join(sslDir, 'key.pem');
  const certPath = path.join(sslDir, 'cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    try {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      const expressApp = app.getHttpAdapter().getInstance();
      const httpsServer = https.createServer(httpsOptions, expressApp);

      const signalingGateway = app.get(SignalingGateway);
      if (signalingGateway && signalingGateway.server) {
        signalingGateway.server.attach(httpsServer);
      }

      httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
        logger.log(`🔒 HTTPS Server running on: https://192.168.43.72:${HTTPS_PORT}`);
      });
    } catch (sslErr) {
      logger.warn('Could not start HTTPS server', sslErr);
    }
  }

  logger.log(`=======================================================`);
  logger.log(`📱 LAN IPv4 Address:     192.168.43.72`);
  logger.log(`🌐 HTTP Access (Laptop): http://192.168.43.72:${HTTP_PORT}`);
  logger.log(`🔒 HTTPS Access (Mobile): https://192.168.43.72:${HTTPS_PORT}`);
  logger.log(`💻 Localhost:             http://localhost:${HTTP_PORT}`);
  logger.log(`🗄️  PostgreSQL:           localhost:5432 (DB: ${process.env.DB_NAME || 'calling_platform'})`);
  logger.log(`🌐 Adminer DB GUI:        http://192.168.43.72:8080`);
  logger.log(`=======================================================`);
}
bootstrap();
