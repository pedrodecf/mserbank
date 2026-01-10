import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  private readonly logger = new Logger(OwnershipGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user: CurrentUserPayload;
      params: Record<string, string>;
      url: string;
      method: string;
    }>();

    const user = request.user;
    const resourceUserId = request.params.userId;

    if (!user || !resourceUserId) {
      this.logger.warn(
        { url: request.url, method: request.method },
        'Ownership validation failed: missing user or resource userId',
      );
      throw new ForbiddenException('Unable to verify resource ownership');
    }

    if (user.userId !== resourceUserId) {
      this.logger.warn(
        { userId: user.userId, resourceUserId, url: request.url, method: request.method },
        'Access denied: ownership validation failed',
      );
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
