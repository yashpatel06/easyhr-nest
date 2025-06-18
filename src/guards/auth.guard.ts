import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { ResponseUtilities } from 'src/utils/response.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        ResponseUtilities.responseWrapper(
          false,
          COMMON_MESSAGE.TokenMissing,
          401,
          null,
        ),
      );
    }

    try {
      const decoded = this.authService.verifyToken(token);
      request.user = decoded;
      request.authToken = token;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          ResponseUtilities.responseWrapper(
            false,
            COMMON_MESSAGE.TokenExpired,
            401,
            null,
          ),
        );
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          ResponseUtilities.responseWrapper(
            false,
            COMMON_MESSAGE.InvalidToken,
            401,
            null,
          ),
        );
      } else {
        throw new UnauthorizedException(
          ResponseUtilities.responseWrapper(
            false,
            COMMON_MESSAGE.AccessDenied,
            401,
            null,
          ),
        );
      }
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }
}
