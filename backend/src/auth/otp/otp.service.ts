import { Injectable } from "@nestjs/common";
import { Mailservice } from "src/mail/mail.service";

@Injectable()
export class OtpService {

    constructor(private mailService: Mailservice) { }

    async sendOtp(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await this.mailService.sendEmail(
            email,
            "OTP Verification",
            `Your OTP is ${otp}`,
            `<h2>Your OTP is ${otp}</h2>`
        );

        return otp
    }

}