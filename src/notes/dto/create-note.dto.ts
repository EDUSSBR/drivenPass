import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    example: 'Secrete from..',
    description:
      'Here you should write your secret title for know what secret is inside of it',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    example: 'My secret note about...',
    description: 'Here you should write your secret for keeping it safe',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
