import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dto/create-card.dto';
import { EncrypterService } from 'src/encrypter/encrypter.service';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly encrypter: EncrypterService,
  ) {}
  create(createCardDto: CreateCardDto, userId: number) {
    const { ccv, password } = createCardDto;
    return this.cardsRepository.create(
      {
        ...createCardDto,
        password: this.encrypter.encrypt(password),
        ccv: this.encrypter.encrypt(ccv),
      },
      userId,
    );
  }

  async findAll(userId) {
    let cards = await this.cardsRepository.findAll(userId);
    if (cards && cards.length > 0) {
      cards = cards.map((card) => ({
        ...card,
        password: this.encrypter.decrypt(card.password),
        ccv: this.encrypter.decrypt(card.ccv),
      }));
    }
    return cards;
  }

  async findOne(id: number, userId) {
    const card = await this.cardsRepository.findOne(id);
    if (!card) {
      throw new NotFoundException('Cannot found card');
    }
    if (card.userId !== userId) {
      throw new ForbiddenException('Cannot found card');
    }
    return {
      ...card,
      password: this.encrypter.decrypt(card.password),
      ccv: this.encrypter.decrypt(card.password),
    };
  }

  async update(id: number, updateCardDto: UpdateCardDto, userId: number) {
    const card = await this.findOne(id, userId);
    const [passwordToBeEncrypted, ccvToBeEncrypted] = [
      updateCardDto.password ? updateCardDto.password : card.password,
      updateCardDto.ccv ? updateCardDto.ccv : card.ccv,
    ];
    const encryptedPassword = this.encrypter.encrypt(passwordToBeEncrypted);
    const encryptedCcv = this.encrypter.encrypt(ccvToBeEncrypted);
    const {
      id: cardID,
      title,
      name,
      number,
      expirationDate,
      isVirtual,
      type,
      ccv: newCcv,
      password: newPassword,
    } = await this.cardsRepository.update(
      id,
      {
        ...card,
        ...updateCardDto,
        password: encryptedPassword,
        ccv: encryptedCcv,
      },
      userId,
    );
    return {
      id: cardID,
      title,
      name,
      number,
      expirationDate,
      isVirtual,
      type,
      ccv: this.encrypter.decrypt(newCcv),
      password: this.encrypter.decrypt(newPassword),
    };
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.cardsRepository.remove(id, userId);
  }
}
