import { BadGatewayException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";


@Injectable()
export class CreatePostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new BadGatewayException("User not found");
    }

    const newPost = await this.prisma.post.create({
      data: {
        caption: dto.caption,
        imageUrl: dto.imageUrl,
        location: dto.location,
        userId: userId
      }
    });

    return newPost;
  }
}
