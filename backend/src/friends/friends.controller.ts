import { Controller, Get, Post, Delete, Param, ParseIntPipe, UseGuards, Req, Body } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Post('add')
    addFriend(@Req() req, @Body('username') username: string) {
        return this.friendsService.addFriend(req.user.id, username);
    }

    @Delete(':friendId')
    removeFriend(@Req() req, @Param('friendId', ParseIntPipe) friendId: number) {
        return this.friendsService.removeFriend(req.user.id, friendId);
    }

    @Get()
    getFriends(@Req() req) {
        return this.friendsService.getFriends(req.user.id);
    }

    @Get(':friendId/deeds')
    getFriendDeeds(@Req() req, @Param('friendId', ParseIntPipe) friendId: number) {
        return this.friendsService.getFriendDeeds(req.user.id, friendId);
    }
}
