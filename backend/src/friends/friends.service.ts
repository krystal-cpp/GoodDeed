import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
    constructor(private prisma: PrismaService) {}

    async addFriend(userId: number, friendUsername: string) {
        const friend = await this.prisma.user.findUnique({
            where: { username: friendUsername },
        });

        if(!friend) throw new NotFoundException('User not found');

        if(friend.id === userId) throw new BadRequestException('You cannot add yourself as a friend');

        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId: friend.id },
                    { userId: friend.id, friendId: userId },
                ],
            },
        });

        if(existingFriendship) throw new ConflictException('You are already friends');

        await this.prisma.friendship.create({
            data: {
                userId,
                friendId: friend.id,
            },
        });

        return { message: `You are now friends with ${friendUsername}` };
    }

    async removeFriend(userId: number, friendId: number) {
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });

        if(!friendship) throw new NotFoundException('Friendship not found');

        await this.prisma.friendship.delete({
            where: { id: friendship.id },
        });

        return { message: 'Friend removed successfully' };
    }

    async getFriends(userId: number) {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { userId },
                    { friendId: userId },
                ],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        email: true,
                    },
                },
                friend: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return friendships.map((f) => {
            const friend = f.userId === userId ? f.friend : f.user;
            return friend;
        });
    }

    async getFriendDeeds(userId: number, friendId: number) {
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });

        if(!friendship) throw new BadRequestException('You are not friends with this user');

        const deeds = await this.prisma.goodDeed.findMany({
            where: { ownerId: friendId },
            orderBy: { createdAt: 'desc' },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
            },
        });

        return deeds;
    }
}
