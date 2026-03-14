import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import { SupabaseUserRepository } from '../../infrastructure/repositories/SupabaseUserRepository.js';
import type { User } from '../../domain/entities/User.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

export const userService = new UserService(new SupabaseUserRepository());
