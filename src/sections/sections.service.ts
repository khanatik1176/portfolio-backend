import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RevalidateService } from '../revalidate/revalidate.service.js';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto.js';
import {
  CreateSectionItemDto,
  UpdateSectionItemDto,
} from './dto/section-item.dto.js';

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revalidate: RevalidateService,
  ) {}

  /** Visible sections with visible items, for the public site. */
  findPublic() {
    return this.prisma.section.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
      include: {
        items: { where: { isVisible: true }, orderBy: { order: 'asc' } },
      },
    });
  }

  findAll() {
    return this.prisma.section.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { items: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.section.findUniqueOrThrow({
      where: { id },
      include: { items: { orderBy: { order: 'asc' } } },
    });
  }

  async create(dto: CreateSectionDto) {
    const order = dto.order ?? (await this.prisma.section.count());
    return this.mutate(
      this.prisma.section.create({
        data: { ...dto, content: dto.content as Prisma.InputJsonObject, order },
      }),
    );
  }

  update(id: string, dto: UpdateSectionDto) {
    return this.mutate(
      this.prisma.section.update({
        where: { id },
        data: { ...dto, content: dto.content as Prisma.InputJsonObject },
      }),
    );
  }

  remove(id: string) {
    return this.mutate(this.prisma.section.delete({ where: { id } }));
  }

  reorder(ids: string[]) {
    return this.mutate(
      this.prisma.$transaction(
        ids.map((id, order) =>
          this.prisma.section.update({ where: { id }, data: { order } }),
        ),
      ),
    );
  }

  async createItem(sectionId: string, dto: CreateSectionItemDto) {
    const order =
      dto.order ?? (await this.prisma.sectionItem.count({ where: { sectionId } }));
    return this.mutate(
      this.prisma.sectionItem.create({
        data: {
          ...dto,
          data: dto.data as Prisma.InputJsonObject,
          order,
          sectionId,
        },
      }),
    );
  }

  updateItem(id: string, dto: UpdateSectionItemDto) {
    return this.mutate(
      this.prisma.sectionItem.update({
        where: { id },
        data: { ...dto, data: dto.data as Prisma.InputJsonObject },
      }),
    );
  }

  removeItem(id: string) {
    return this.mutate(this.prisma.sectionItem.delete({ where: { id } }));
  }

  reorderItems(ids: string[]) {
    return this.mutate(
      this.prisma.$transaction(
        ids.map((id, order) =>
          this.prisma.sectionItem.update({ where: { id }, data: { order } }),
        ),
      ),
    );
  }

  private async mutate<T>(op: Promise<T>) {
    const result = await op;
    await this.revalidate.portfolio();
    return result;
  }
}
