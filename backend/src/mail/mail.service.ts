import { Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";
@Injectable()
export class Mailservice {

    private transporter = createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
    })

    async sendEmail(to:string,subject:string,text:string,html?:string) : Promise<void>{
        await this.transporter.sendMail({
            from : process.env.EMAIl_USER,
            to,
            subject,
            text,
            html
        })
    }

}