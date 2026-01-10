import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user: CurrentUserPayload;
      params: Record<string, string>;
    }>();

    const user = request.user;
    const resourceUserId = request.params.userId;

    if (!user || !resourceUserId) {
      throw new ForbiddenException('Unable to verify resource ownership');
    }

    if (user.userId !== resourceUserId) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
