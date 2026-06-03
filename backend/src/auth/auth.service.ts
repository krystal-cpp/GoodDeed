import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDTO) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: dto.username },
                    { email: dto.email },
                ],
            },
        });

        if (existingUser) throw new ConflictException('Username or email already exists');

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                name: dto.name,
                passwordHash
            },
        });

        const token = this.generateToken(user.id, user.username);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    async login(dto: LoginDTO) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        const token = this.generateToken(user.id, user.username);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    private generateToken(userId: number, username: string): string {
        const payload = { sub: userId, username };
        return this.jwtService.sign(payload);
    }
}
