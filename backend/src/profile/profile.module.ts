import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { PrismaService } from "prisma/prisma.service";
import { ProfileController } from "./profile.controller";
import { CloudinaryModule } from "src/upload/cloudinary.module";
import { MulterModule } from "@nestjs/platform-express";


@Module({
     imports :[CloudinaryModule,MulterModule.register()],
     controllers :[ProfileController],
     providers : [ProfileService,PrismaService],
})

export class ProfileModule {}