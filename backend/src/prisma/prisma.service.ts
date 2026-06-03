import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
    constructor() {
        const adapter = new PrismaPg(
            new Pool({ connectionString: process.env.DATABASE_URL as string })
        );
        super({ adapter });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
