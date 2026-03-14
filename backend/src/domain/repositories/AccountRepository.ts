import type { Account } from '../entities/Account.js';
import type { Repository } from './Repository.js';

export interface AccountRepository extends Repository<Account> {
  findByName(name: string): Promise<Account[]>;
}
