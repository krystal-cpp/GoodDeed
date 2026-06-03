import { Controller, Get, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
        return this.usersService.findById(req.user.id);
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }

    @Get('username/:username')
    findByUsername(@Param('username') username: string) {
        return this.usersService.findByUsername(username);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req, @Body() dto: UpdateUserDTO) {
        return this.usersService.update(req.user.id, dto);
    }

    @Delete('profile')
    @UseGuards(JwtAuthGuard)
    removeProfile(@Req() req) {
        return this.usersService.remove(req.user.id);
    }
}
