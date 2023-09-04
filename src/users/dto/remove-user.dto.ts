import { IsNotEmpty } from 'class-validator';

export class RemoveUserDto {
  @IsNotEmpty()
  password: string;
}
