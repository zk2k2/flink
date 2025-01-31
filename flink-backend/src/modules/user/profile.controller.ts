import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly userService: UserService) { }

    // Update profile details
    @Patch('update')
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        const userId = req.user?.id;

        if (!userId || typeof userId !== 'string') {
            throw new BadRequestException('Invalid or missing user ID');
        }

        return this.userService.update(userId, updateProfileDto);
    }



    // Follow another user
    @Patch('follow/:username')
    async followUser(@Req() req, @Param('username') followUsername: string) {
        const user = await this.userService.findOneById(req.user.id);
        const userToFollow = await this.userService.findByField('username', followUsername);

        if (!userToFollow) {
            throw new Error('User not found');
        }

        // Fetch the current list of followings
        const currentFollowings = await this.userService.getFollowings(user.id) || [];

        // Check if the user is already following the userToFollow
        const isAlreadyFollowing = currentFollowings.some(followedUser => followedUser.id === userToFollow.id);

        if (isAlreadyFollowing) {
            return { message: 'You are already following this user' };
        }

        // Add the new user to the following list
        user.following = [...currentFollowings, userToFollow];
        await this.userService.update(user.id, { following: user.following });
        return { message: 'Successfully followed user' };
    }

    // Unfollow a user
    @Patch('unfollow/:id')
    async unfollowUser(@Req() req, @Param('id') unfollowId: string) {
        const user = await this.userService.findByField('id', req.user.id);
        user.following = user.following.filter(u => u.id !== unfollowId);

        await this.userService.update(user.id, { following: user.following });
        return { message: 'Successfully unfollowed user' };
    }

    // View profile details
    @Get(':id')
    async getProfile(@Param('id') userId: string) {
        return this.userService.findByField('id', userId);
    }

    // Change password
    @Patch('change-password')
    async changePassword(@Req() req, @Body('newPassword') newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.userService.updatePassword(req.user.id, hashedPassword);
    }

    // Update profile picture
    @Patch('update-profile-pic')
    async updateProfilePic(@Req() req, @Body('profilePic') profilePic: string) {
        return this.userService.update(req.user.id, { profilePic });
    }

    // View followers list
    @Get('followers')
    async getFollowers(@Req() req) {
        const user = await this.userService.findByField('id', req.user.id);
        return user.followers;
    }

    // View following list
    @Get('following')
    async getFollowing(@Req() req) {
        const user = await this.userService.findByField('id', req.user.id);
        return user.following;
    }

    // View user achievements
    @Get('achievements')
    async getAchievements(@Req() req) {
        const user = await this.userService.findByField('id', req.user.id);
        return user.achievements;
    }

    // Update location
    @Patch('update-location')
    async updateLocation(@Req() req, @Body('location') location: any) {
        return this.userService.update(req.user.id, { location });
    }

    // Deactivate account (soft delete)
    @Delete('deactivate')
    async deactivateAccount(@Req() req) {
        return this.userService.softRemove(req.user.id);
    }

    // Permanently delete account
    @Delete('delete')
    async deleteAccount(@Req() req) {
        return this.userService.remove(req.user.id);
    }
}
