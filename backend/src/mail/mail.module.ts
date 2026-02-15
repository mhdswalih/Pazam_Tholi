import { Module } from "@nestjs/common";
import { Mailservice } from "./mail.service";

@Module({
    providers : [Mailservice],
    exports : [Mailservice]
})

export class MailModule {}