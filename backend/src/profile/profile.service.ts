import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EditProfileDto } from "./dto/editProfile.dto";

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) {}

   async updateProfile(userId: string, dto: EditProfileDto) {

    const updateData: any = {};

    if (dto.firstName !== undefined)
        updateData.firstName = dto.firstName;

    if (dto.lastName !== undefined)
        updateData.lastName = dto.lastName;

    if (dto.profilePic !== undefined)
        updateData.profilePic = dto.profilePic;

    console.log(updateData, "UPDATE DATA");

    return this.prisma.user.update({
        where: { id: userId }, // use userId, NOT email
        data: updateData,
    });
}
}