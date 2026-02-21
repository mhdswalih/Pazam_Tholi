import { BadGatewayException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EditProfileDto } from "./dto/editProfile.dto";

@Injectable()
export class ProfileService {
    constructor(private prisma : PrismaService) {}

async updateProfile(dto:EditProfileDto) {
    const existUser = await this.prisma.user.findUnique({
        where : {email : dto.email}
    })
    
    
    if(!existUser){
        throw new BadGatewayException("Invalid User")
    }

    const updaredUser = this.prisma.user.update({
        where : {email : dto.email},
        data : {
           ...dto 
        }
    })
    return updaredUser
}
}