import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('❌ Tidak ada Authorization header');
      return false;
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Format token salah:', authHeader);
      return false;
    }

    try {
      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      );

      req.user = decoded;
      return true;
    } catch (err) {
      console.log('❌ Token error:', err.message);
      return false;
    }
  }
}
