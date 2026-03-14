import { BaseEntity } from './BaseEntity.js';

export class User extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string = 'user',
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }
}
