import { BadGatewayException, Body, Controller, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CreatePostService } from "./create-post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { CloudinaryService } from "src/upload/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('post')
export class CreatePostController {
    constructor(private createPostService: CreatePostService, private cloidinaryService: CloudinaryService) { }

    @Post('create-post/:id')
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @Body() dto: CreatePostDto,
        @Param('id') userId: string,
        @UploadedFile() file: Express.Multer.File
    ) {

        let imageUrl = dto.imageUrl;

        if (file) {
            const uploadResult = await this.cloidinaryService.uploadImage(file);
            imageUrl = uploadResult.secure_url;
        }

        return this.createPostService.createPost(userId, {
            ...dto,
            imageUrl
        });
    }
} 