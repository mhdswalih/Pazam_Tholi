import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "prisma/prisma.module";
import { OtpModule } from "./otp/otp.module";
import { JwtAuthModule } from "./jwt/jwt.module";
import { JwtStrategy } from "./jwt/jwt.strategy";


@Module({
    imports : [PrismaModule,OtpModule, JwtAuthModule],
    controllers : [AuthController],
    providers : [AuthService,JwtStrategy]
})

export class AuthModule {}