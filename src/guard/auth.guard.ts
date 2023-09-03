import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { TokensRepository } from 'src/tokens/tokens.repository';
import { JwtService } from '@nestjs/jwt';

@Global()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokensRepository: TokensRepository,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      const token = authorization.replace('Bearer ', '');
      console.log(token);
      const [isSigned, userInfo] = await Promise.all([
        this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET }),
        this.tokensRepository.verifyToken(token),
      ]);
      console.log('isSigned, userInfo');
      if (!(isSigned && userInfo)) {
        throw new UnauthorizedException();
      }
      request.user = userInfo;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
