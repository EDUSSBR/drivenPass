import { CardType } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString()
  @Length(16)
  number: string;
  @IsNotEmpty()
  @IsString()
  @Length(3)
  ccv: string;
  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  isVirtual: boolean;
  @IsNotEmpty()
  type: CardType;
}
