import { User } from './user';

export interface Session {
  access_token: string;
  token_type: string;
  user: User;
}
