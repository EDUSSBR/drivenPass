import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createCardDto: CreateCardDto, userId: number) {
    const {
      title,
      name,
      number,
      ccv,
      expirationDate,
      password,
      isVirtual,
      type,
    } = createCardDto;
    return this.prisma.cards.create({
      data: {
        title,
        name,
        number,
        ccv,
        expirationDate,
        password,
        isVirtual,
        type,
        userId,
      },
    });
  }

  findAll(userId) {
    return this.prisma.cards.findMany({ where: { userId } });
  }

  findOne(id) {
    return this.prisma.cards.findFirst({ where: { id } });
  }

  update(id: number, updateCardDto: UpdateCardDto, userId: number) {
    const {
      title,
      name,
      number,
      ccv,
      expirationDate,
      password,
      isVirtual,
      type,
    } = updateCardDto;
    return this.prisma.cards.update({
      where: { userId, id },
      data: {
        title,
        name,
        number,
        ccv,
        expirationDate,
        password,
        isVirtual,
        type,
      },
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.cards.delete({ where: { userId, id } });
  }
}
