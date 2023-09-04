import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { EncrypterService } from 'src/encrypter/encrypter.service';
import { JwtService } from '@nestjs/jwt';
import { TokensRepository } from 'src/tokens/tokens.repository';
import { RemoveUserDto } from './dto/remove-user.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encrypter: EncrypterService,
    private readonly jwtService: JwtService,
    private readonly tokensRepository: TokensRepository,
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

  async verifyAccount(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.usersRepository.findUserByEmail(email);
    const isValid = this.encrypter.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const token = this.jwtService.sign({}, { subject: String(user.id) });
    await this.tokensRepository.saveToken(token, user.id);
    return token;
  }
  async removeAccount(
    id: number,
    userId: number,
    removeUserDto: RemoveUserDto,
  ) {
    const { password } = removeUserDto;
    const user = await this.usersRepository.findUserById(id);
    const isValid = this.encrypter.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    if (!user) {
      throw new NotFoundException('Cannot found user.');
    }
    if (user.id !== userId) {
      throw new ForbiddenException();
    }
    await this.usersRepository.removeUser(userId);
  }
}
