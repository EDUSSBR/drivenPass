import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import Cryptr from 'cryptr';

@Injectable()
export class EncrypterService {
  private readonly saltRounds: number = 10;
  private readonly secret: string = process.env.ENCRYPT_SECRET;
  hash(str: string) {
    return bcrypt.hashSync(str, this.saltRounds);
  }
  compare(pass, str) {
    return bcrypt.compareSync(pass, str);
  }
  encrypt(str: string) {
    const encripter = new Cryptr(this.secret);
    return encripter.encrypt(str);
  }
  decrypt(str: string) {
    const encripter = new Cryptr(this.secret);
    return encripter.decrypt(str);
  }
}
