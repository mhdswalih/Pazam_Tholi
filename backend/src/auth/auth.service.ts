import { PrismaService } from "prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Mailservice } from "src/mail/mail.service";
import { OtpService } from "./otp/otp.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private otpService:OtpService) { }

    async register(dto: RegisterDto) {
        const existUser = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })

        if (existUser) {
            throw new BadRequestException("Email alredy exists")
        }
        
        
        const otp = await this.otpService.sendOtp(dto.email)
      
        return {
            message: 'OTP send successfully',
            email : dto.email,
            otp
           
        }
    }
}