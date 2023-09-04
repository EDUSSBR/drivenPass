import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'users email for registration',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'Mysecretpassword%###!789',
    description: 'users password for registration',
  })
  @IsStrongPassword({
    minLength: 10,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
