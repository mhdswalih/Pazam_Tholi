import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { PrismaService } from "prisma/prisma.service";
import { ProfileController } from "./profile.controller";


@Module({
     controllers :[ProfileController],
     providers : [ProfileService,PrismaService],
})

export class ProfileModule {}