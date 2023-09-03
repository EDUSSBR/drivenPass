import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { CredentialsRepository } from './credentials.repository';

@Module({
  controllers: [CredentialsController],
  providers: [
    CredentialsService,
    UsersService,
    UsersRepository,
    JwtService,
    CredentialsRepository,
  ],
})
export class CredentialsModule {}
