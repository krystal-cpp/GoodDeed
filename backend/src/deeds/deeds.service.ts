import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeedDTO } from './dto/create-deeds.dto'; 
import { UpdateDeedDTO } from './dto/update-deeds.dto';

@Injectable()
export class DeedsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateDeedDTO) {
        return this.prisma.goodDeed.create({
            data: {
                title: dto.title,
                description: dto.description,
                ownerId: userId,
            },
        });
    }

    async findAllByUser(userId: number) {
        return this.prisma.goodDeed.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: number) {
        const goodDeed = await this.prisma.goodDeed.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    }
                }
            }   
        });

        if(!goodDeed) throw new NotFoundException('Good deed not found');

        return goodDeed;
    }

    async update(id: number, userId: number, dto: UpdateDeedDTO) {
        const goodDeed = await this.findById(id);

        if(goodDeed.ownerId !== userId) throw new ForbiddenException('You can only update your own good deeds');

        const data: any = { ...dto };

        if(dto.status === true && !goodDeed.completedAt) data.completedAt = new Date();

        if(dto.status === false) data.completedAt = null;

        return this.prisma.goodDeed.update({
            where: { id },
            data,
        });
    }

    async remove(id: number, userId: number) {
        const goodDeed = await this.findById(id);

        if(goodDeed.ownerId !== userId) throw new ForbiddenException('You can only delete your own good deeds');

        await this.prisma.goodDeed.delete({
            where: { id },
        });

        return { message: 'Good deed deleted successfully' };
    }
}
