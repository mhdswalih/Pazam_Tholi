import { BadGatewayException, Body, Controller, Param, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { EditProfileDto } from "./dto/editProfile.dto";
import { ProfileService } from "./profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/upload/cloudinary.service";

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService, private cloudinaryService: CloudinaryService) { }

    @Patch('edit-profile/:userId')
    @UseInterceptors(FileInterceptor("file"))
    async editProfile(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: EditProfileDto,
    ) {

        let profilePicUrl = dto.profilePic;

        if (file) {
            try {

                const uploadResult =
                    await this.cloudinaryService.uploadImage(file);

                profilePicUrl = uploadResult.secure_url;

            } catch (error) {

                throw new BadGatewayException("Failed to upload image");

            }
        }

        return this.profileService.updateProfile(userId, {
            ...dto,
            profilePic: profilePicUrl
        });

    }
}
