import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ReorderDto } from '../common/reorder.dto.js';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto.js';
import {
  CreateSectionItemDto,
  UpdateSectionItemDto,
} from './dto/section-item.dto.js';
import { SectionsService } from './sections.service.js';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sections: SectionsService) {}

  @Get()
  findPublic() {
    return this.sections.findPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAll() {
    return this.sections.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.sections.reorder(dto.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/reorder')
  reorderItems(@Body() dto: ReorderDto) {
    return this.sections.reorderItems(dto.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:itemId')
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateSectionItemDto,
  ) {
    return this.sections.updateItem(itemId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.sections.removeItem(itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sections.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSectionDto) {
    return this.sections.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.sections.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sections.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/items')
  createItem(@Param('id') id: string, @Body() dto: CreateSectionItemDto) {
    return this.sections.createItem(id, dto);
  }
}
