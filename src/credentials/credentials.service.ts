import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { EncrypterService } from 'src/encrypter/encrypter.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly encrypter: EncrypterService,
  ) {}
  create(createCredentialDto: CreateCredentialDto, userId: number) {
    const { password } = createCredentialDto;
    return this.credentialsRepository.create(
      {
        ...createCredentialDto,
        password: this.encrypter.encrypt(password),
      },
      userId,
    );
  }

  async findAll(userId) {
    let credentials = await this.credentialsRepository.findAll(userId);
    if (credentials && credentials.length > 0) {
      credentials = credentials.map((credential) => ({
        ...credential,
        password: this.encrypter.decrypt(credential.password),
      }));
    }
    return credentials;
  }

  async findOne(id: number, userId) {
    const credential = await this.credentialsRepository.findOne(id);
    if (!credential) {
      throw new NotFoundException('Cannot found credential');
    }
    if (credential.userId !== userId) {
      throw new ForbiddenException('Cannot found credential');
    }
    return {
      ...credential,
      password: this.encrypter.decrypt(credential.password),
    };
  }

  async update(
    id: number,
    updateCredentialDto: UpdateCredentialDto,
    userId: number,
  ) {
    const credential = await this.findOne(id, userId);
    const passwordToBeEncrypted = updateCredentialDto.password
      ? updateCredentialDto.password
      : credential.password;
    const encryptedPassword = this.encrypter.encrypt(passwordToBeEncrypted);
    const {
      id: credentialID,
      title,
      username,
      url,
      password: newPassword,
    } = await this.credentialsRepository.update(
      id,
      {
        ...credential,
        ...updateCredentialDto,
        password: encryptedPassword,
      },
      userId,
    );
    return {
      id: credentialID,
      title,
      username,
      url,
      password: this.encrypter.decrypt(newPassword),
    };
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.credentialsRepository.remove(id, userId);
  }
}
