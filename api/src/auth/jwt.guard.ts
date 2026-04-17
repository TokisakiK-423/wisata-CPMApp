import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) return false;

    try {
      const token = auth.split(' ')[1];

      const secret = process.env.JWT_SECRET;
      if (!secret) return false;

      const decoded = jwt.verify(token, secret);
      req.user = decoded;

      return true;
    } catch {
      return false;
    }
  }
}
