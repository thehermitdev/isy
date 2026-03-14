import type { UseCase } from '../UseCase.js';
import type { AccountRepository } from '../../../domain/repositories/AccountRepository.js';
import type { Account } from '../../../domain/entities/Account.js';
import { z } from 'zod';

export const CreateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  industry: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  billingAddress: z.string().optional().nullable(),
  shippingAddress: z.string().optional().nullable(),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;

export class CreateAccount implements UseCase<CreateAccountInput, Account> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: CreateAccountInput): Promise<Account> {
    const validated = CreateAccountSchema.parse(input);
    return this.accountRepository.create({
      name: validated.name,
      industry: validated.industry ?? null,
      website: validated.website ?? null,
      phone: validated.phone ?? null,
      billingAddress: validated.billingAddress ?? null,
      shippingAddress: validated.shippingAddress ?? null,
    } as Parameters<typeof this.accountRepository.create>[0]);
  }
}

export class GetAccounts implements UseCase<void, Account[]> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }
}

export class GetAccount implements UseCase<string, Account | null> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(id: string): Promise<Account | null> {
    return this.accountRepository.findById(id);
  }
}

export class UpdateAccount implements UseCase<{ id: string; data: Partial<CreateAccountInput> }, Account> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: { id: string; data: Partial<CreateAccountInput> }): Promise<Account> {
    return this.accountRepository.update(input.id, input.data as Partial<Account>);
  }
}

export class DeleteAccount implements UseCase<string, void> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(id: string): Promise<void> {
    return this.accountRepository.delete(id);
  }
}
