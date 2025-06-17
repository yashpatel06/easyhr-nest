import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: object): string {
    return this.jwtService.sign(payload);
  }

  async hashPassword(plainPassword: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(plainPassword, salt);
      return hashPassword;
    } catch (error) {
      return plainPassword;
    }
  }

  async comparePassword(plainPassword: string, hashPassword: string) {
    try {
      const match = await bcrypt.compare(plainPassword, hashPassword);
      return match;
    } catch (error) {
      return false;
    }
  }
}
