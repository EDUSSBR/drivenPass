import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EncrypterModule } from './encrypter/encrypter.module';
import { TokensRepositoryModule } from './tokens/tokens.module';
import { CredentialsModule } from './credentials/credentials.module';
@Module({
  imports: [
    HealthModule,
    PrismaModule,
    UsersModule,
    EncrypterModule,
    TokensRepositoryModule,
    CredentialsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
