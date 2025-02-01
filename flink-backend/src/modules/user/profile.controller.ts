import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly userService: UserService) { }

    @Patch('update')
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        const userId = req.user?.id;

        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('Invalid or missing user ID');
        }

        return this.userService.update(userId, updateProfileDto);
    }


    @Patch('follow/:username')
    async followUser(@Req() req, @Param('username') followUsername: string) {
        const user = await this.userService.findOneById(req.user.id);
        const userToFollow = await this.userService.findByField('username', followUsername);

        if (!userToFollow) {
            throw new Error('User not found');
        }

        const currentFollowings = await this.userService.getFollowings(user.id) || [];
        
        user.following = [...currentFollowings, userToFollow];
        await this.userService.update(user.id, { following: user.following });
        return { message: 'Successfully followed user' };
    }

    @Patch('unfollow/:username')
    async unfollowUser(@Req() req, @Param('username') unfollowUsername: string) {
        const user = await this.userService.findOneById(req.user.id);
        const currentFollowings = await this.userService.getFollowings(user.id) || [];

        user.following = currentFollowings.filter(u => u.username !== unfollowUsername);

        await this.userService.update(user.id, { following: user.following });
        return { message: 'Successfully unfollowed user' };
    }

    @Get(':id')
    async getProfile(@Param('id') userId: string) {
        return this.userService.findByField('id', userId);
    }

    @Patch('change-password')
    async changePassword(@Req() req, @Body('newPassword') newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.userService.updatePassword(req.user.id, hashedPassword);
    }

    @Patch('update-profile-pic')
    async updateProfilePic(@Req() req, @Body('profilePic') profilePic: string) {
        return this.userService.update(req.user.id, { profilePic });
    }

    
    @Get('followers')
    async getFollowers(@Req() req) {
        const user = await this.userService.findByField('id', req.user.id);
        return user.followers;
    }

    @Get('following')
    async getFollowing(@Req() req) {
        const user = await this.userService.findByField('id', req.user.id);
        return user.following;
    }

    @Get('achievements')
    async getAchievements(@Req() req) {
        const user = await this.userService.findByField('id', req.user.id);
        return user.achievements;
    }

    @Patch('update-location')
    async updateLocation(@Req() req, @Body('location') location: any) {
        return this.userService.update(req.user.id, { location });
    }

    @Delete('deactivate')
    async deactivateAccount(@Req() req) {
        return this.userService.softRemove(req.user.id);
    }

    @Delete('delete')
    async deleteAccount(@Req() req) {
        return this.userService.remove(req.user.id);
    }
}
