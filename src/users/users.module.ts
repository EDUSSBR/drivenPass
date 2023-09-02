import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { TokensRepository } from 'src/tokens/tokens.repository';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, TokensRepository],
})
export class UsersModule {}
