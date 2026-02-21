import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './auth/otp/otp.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    MailModule,
    OtpModule,
    RedisModule,
    AuthModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
