import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { EncrypterService } from 'src/encrypter/encrypter.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encrypter: EncrypterService,
  ) {}
  async createAccount(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.usersRepository.findUserByEmail(email);
    if (user !== null) {
      throw new ConflictException();
    }
    const hashedPassword = this.encrypter.hash(password);
    await this.usersRepository.createUser({ email, password: hashedPassword });
    return 'CREATED';
  }

  verifyAccount(createUserDto: CreateUserDto) {
    return `To be done`;
  }
}
