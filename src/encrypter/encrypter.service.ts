import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class EncrypterService {
  saltRounds: number = 10;
  hash(str: string) {
    return bcrypt.hashSync(str, this.saltRounds);
  }
}
