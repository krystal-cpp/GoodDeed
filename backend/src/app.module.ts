import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DeedsModule } from './deeds/deeds.module';
import { FriendsModule } from './friends/friends.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, DeedsModule, FriendsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
