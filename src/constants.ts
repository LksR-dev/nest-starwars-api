import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

export const jwtConstants = {
  secret: 'yourSecretKey',
};
