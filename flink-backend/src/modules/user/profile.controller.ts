import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LocationDto } from 'src/common/dto/location-dto';

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

        return await this.userService.update(userId, updateProfileDto);
    }


    @Patch('follow/:username')
    async followUser(@Req() req, @Param('username') followUsername: string) {
        const user = await this.userService.findOneById(req.user['id']);
        const userToFollow = await this.userService.findByField(followUsername);

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
        const user = await this.userService.findOneById(req.user['id']);
        const currentFollowings = await this.userService.getFollowings(user.id) || [];

        user.following = currentFollowings.filter(u => u.username !== unfollowUsername);

        await this.userService.update(user.id, { following: user.following });
        return { message: 'Successfully unfollowed user' };
    }

    @Get(':identifier')
    async getProfile(@Param('identifier') identifier: string) {
        return await this.userService.getProfile(identifier);
    }

    @Patch('change-password')
    async changePassword(@Req() req, @Body('newPassword') newPassword: string) {
        return await this.userService.updatePassword(req.user['id'], newPassword);
    }

    @Patch('update-profile-pic')
    async updateProfilePic(@Req() req, @Body('profilePic') profilePic: string) {
        return await this.userService.update(req.user['id'], { profilePic });
    }


    @Get('followers')
    async getFollowers(@Req() req): Promise<User[]> {
        return await this.userService.getFollowers(req.user['id']) || [];

    }

    @Get('following')
    async getFollowing(@Req() req): Promise<User[]> {
        return await this.userService.getFollowings(req.user['id']) || [];

    }

    @Get('achievements')
    async getAchievements(@Req() req) {
        return await this.userService.getAchievements(req.user['id']) || [];

    }

    @Patch('update-location')
    async updateLocation(@Req() req, @Body('location') location: LocationDto) {
        return this.userService.updateLocation(req.user['id'], location);
    }

    @Delete('deactivate')
    async deactivateAccount(@Req() req) {
        return await this.userService.softRemove(req.user['id']);
    }

    @Delete('delete')
    async deleteAccount(@Req() req) {
        return await this.userService.remove(req.user['id']);
    }

}
