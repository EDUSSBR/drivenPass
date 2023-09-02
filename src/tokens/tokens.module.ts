import { Global, Module } from '@nestjs/common';
import { TokensRepository } from './tokens.repository';

@Global()
@Module({
  exports: [TokensRepository],
  providers: [TokensRepository],
})
export class TokensRepositoryModule {}
