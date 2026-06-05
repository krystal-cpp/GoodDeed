import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async findByUsername(username: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                createdAt: true,
            }
        });

        if (!user) throw new NotFoundException('User not found');
    }

    async update(id: number, dto: UpdateUserDTO) {
        await this.findById(id);

        if (dto.username) {
            const existingUsername = await this.prisma.user.findFirst({
                where: {
                    username: dto.username,
                    id: { not: id }
                },
            });
            if (existingUsername) {
                throw new ConflictException('Username already exists');
            }
        }

        if (dto.email) {
            const existingEmail = await this.prisma.user.findFirst({
                where: {
                    email: dto.email,
                    id: { not: id }
                },
            });
            if (existingEmail) {
                throw new ConflictException('Email already exists');
            }
        }

        const data: any = { ...dto };
        if (dto.password) {
            data.passwordHash = await bcrypt.hash(dto.password, 10);
            delete data.password;
        }

        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                updatedAt: true,
            },
        });
    }

    async remove(id: number) {
        await this.findById(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'User deleted successfully' };
    }
}
