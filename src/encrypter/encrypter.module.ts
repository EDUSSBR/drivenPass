import { Global, Module } from '@nestjs/common';
import { EncrypterService } from './encrypter.service';

@Global()
@Module({
  providers: [EncrypterService],
  exports: [EncrypterService],
})
export class EncrypterModule {}
