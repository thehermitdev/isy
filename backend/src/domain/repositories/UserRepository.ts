import { User } from '../entities/User';
import { Repository } from './Repository';

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
}
