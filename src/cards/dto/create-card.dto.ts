import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Master Do BB',
    description: 'A name/title for all card info',
  })
  title: string;
  @ApiProperty({
    example: 'Eduardo S Santos',
    description: 'The name written in the card',
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: '4010110022003900',
    description: 'Cards number',
  })
  @IsNotEmpty()
  @IsString()
  @Length(16)
  number: string;
  @ApiProperty({
    example: '074',
    description: 'CCV - number behind the card',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3)
  ccv: string;
  @ApiProperty({
    example: '12-34',
    description: 'Date when your card expires',
  })
  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;
  @ApiProperty({
    example: '123456',
    description: 'Your card Password should be here!',
  })
  @IsNotEmpty()
  password: string;
  @ApiProperty({
    example: true,
    description: "Says if it's a virtual card or not (true/false)",
  })
  @IsNotEmpty()
  isVirtual: boolean;
  @ApiProperty({
    example: 'DEBIT',
    description: 'Says how should be used the card (DEBIT/CREDIT/BOTH)',
  })
  @IsNotEmpty()
  type: CardType;
}
