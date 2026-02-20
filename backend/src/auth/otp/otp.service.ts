import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { Mailservice } from "src/mail/mail.service";

@Injectable()
export class OtpService {

    constructor(private mailService: Mailservice, @Inject("REDIS_CLIENT") private redis:Redis) { }

    async sendOtp(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        await this.redis.set(`otp:${email}`,otp,'EX',60)
        await this.mailService.sendEmail(
            email,
            "OTP Verification",
            `Your OTP is ${otp}`,
            `<h2>Your OTP is ${otp}</h2>`
        );

        return otp
    }

    async storedOtp(email:string) {
        return  await this.redis.get(`otp:${email}`);
    }
    async deleteOtp(email : string) {
        return this.redis.del(`otp:${email}`);
    }
    async storeUserData(email :string,userData:any){
        await this.redis.set(`user:${email}`,JSON.stringify(userData),'EX',300)
    }
    async getUserData(email :string) {
        const data = await this.redis.get(`user:${email}`);
        return data ? JSON.parse(data) : null
    } 
    async deleteUserData(email:string) {
        return this.redis.del(`user:${email}`)
    }

}