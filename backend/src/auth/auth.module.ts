import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "prisma/prisma.module";
import { OtpModule } from "./otp/otp.module";


@Module({
    imports : [PrismaModule,OtpModule],
    controllers : [AuthController],
    providers : [AuthService]
})

export class AuthModule {}