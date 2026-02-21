import { Body, Controller, Patch } from "@nestjs/common";
import { EditProfileDto } from "./dto/editProfile.dto";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
    constructor(private profileService : ProfileService) { }

    @Patch('edit-profile')
    editProfile(@Body() dto: EditProfileDto) {  
        return this.profileService.updateProfile(dto)
    }
}
