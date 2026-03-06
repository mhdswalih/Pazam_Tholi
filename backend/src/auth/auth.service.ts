import { PrismaService } from "prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { OtpService } from "./otp/otp.service";
import { VerifyOtpDto } from "./dto/verifyOtp.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private otpService: OtpService, private jwtService: JwtService) { }

    async register(dto: RegisterDto) {
        const existUser = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })
          
            
        if (existUser) {
            throw new BadRequestException("Email alredy exists")
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        await this.otpService.storeUserData(dto.email, {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: hashedPassword
        })
        const otp = await this.otpService.sendOtp(dto.email)
            console.log(otp);
            
        return {
            message: 'OTP send successfully',
            email: dto.email,
            otp

        }

    }
    async verifyOtp(dto: VerifyOtpDto) {

        const storedOtp = await this.otpService.storedOtp(dto.email);


        // check OTP first
        if (!storedOtp) {
            throw new BadRequestException("OTP expired");
        }

        if (storedOtp !== dto.otp) {
            throw new BadRequestException("Invalid OTP");
        }

        // now OTP is correct → get user data
        const userData = await this.otpService.getUserData(dto.email);

        if (!userData) {
            throw new BadRequestException("User data expired");
        }

        // create user AFTER OTP verification
        const user = await this.prisma.user.create({
            data: userData
        });

        // cleanup Redis
        await this.otpService.deleteOtp(dto.email);
        await this.otpService.deleteUserData(dto.email);

        const token = await this.generateToken(user);


        return {
            message: "User registered successfully",
            user: user,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,

        };

    }
    async refreshToken(refreshToken: string) {
        const payLoad = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRES_SECRET || "refreshSECRET"
        })

        const user = await this.prisma.user.findUnique({
            where: { id: payLoad.sub }
        })
        if (!user) {
            throw new UnauthorizedException("User not found")
        }

        const token = await this.generateToken(user)
        return token
    }
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })

        if (!user) {
            throw new UnauthorizedException("invalid email or Password")
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password
        )
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password or email")
        }
        const token = await this.generateToken(user)

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        };
    }

    async generateToken(user: any) {
        const payload = {
            sub: user.id,
            email: user.email
        };
        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET || 'accesstokensecret', expiresIn: '15m' });
        const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRES_SECRET || 'refreshsecret', expiresIn: '7d' })
        return { accessToken, refreshToken }
    }

}
