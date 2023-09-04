import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @ApiProperty({
    example: 'Facebook password',
    description: 'Name/Title for this credential',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    example: 'hehe@gmail.com',
    description: 'Your username/email or whatever you can use to log in',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    example: 'www.facebook.com',
    description: 'Url where you should use this password',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({})
  url: string;
  @ApiProperty({
    example: 'mysecretpassword',
    description: 'Your password to make login',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
