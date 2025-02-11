import { Request } from 'express';

export const jwtConstants = {
  secret: 'yourSecretKey',
};

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}
