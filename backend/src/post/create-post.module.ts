import { Module } from "@nestjs/common";
import { CreatePostController } from "./create-post.controller";
import { CreatePostService } from "./create-post.service";
import { PrismaService } from "prisma/prisma.service";
import { CloudinaryModule } from "src/upload/cloudinary.module";
import { MulterModule } from "@nestjs/platform-express";


@Module({
    imports : [CloudinaryModule,MulterModule.register()],
    controllers : [CreatePostController],
    providers : [CreatePostService,PrismaService]
})

export class CreatePostModule {}