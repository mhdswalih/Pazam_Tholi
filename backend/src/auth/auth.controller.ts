import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verifyOtp.dto";
import type { Response, Request } from 'express';
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }
    @Post('verify-otp')
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
        @Res({ passthrough: true }) res: Response
    ) {

        const result = await this.authService.verifyOtp(dto);

        // store refresh token in cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            user: result.user,
            accessToken: result.accessToken,

        };
    }

    @Post('refresh-token')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        const result = await this.authService.refreshToken(refreshToken);

        // store new refresh token in cookie (optional, for rotation)
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken: result.accessToken,
        };
    }
    @Post('login')
    async login(@Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(dto)

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return {
            user: result.user,
            accessToken: result.accessToken,
        }
    }
}