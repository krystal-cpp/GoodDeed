import { Controller, Get, Post, Delete, Put, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { DeedsService } from './deeds.service';
import { CreateDeedDTO } from './dto/create-deeds.dto';
import { UpdateDeedDTO } from './dto/update-deeds.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('deeds')
@UseGuards(JwtAuthGuard)
export class DeedsController {
    constructor(private deedsService: DeedsService) {}

    @Post()
    create(@Req() req, @Body() dto: CreateDeedDTO) {
        return this.deedsService.create(req.user.id, dto);
    }

    @Get()
    findMyDeeds(@Req() req) {
        return this.deedsService.findAllByUser(req.user.id);
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.deedsService.findById(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Req() req,
        @Body() dto: UpdateDeedDTO,
    ) {
        return this.deedsService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        return this.deedsService.remove(id, req.user.id);
    }
}
