import type { BaseEntity } from '../entities/BaseEntity.js';

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type Data<T> = Pick<T, NonFunctionPropertyNames<T>>;

export interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(filters?: Record<string, unknown>): Promise<T[]>;
  create(entity: Omit<Data<T>, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<Omit<Data<T>, 'id' | 'createdAt'>>): Promise<T>;
  delete(id: string): Promise<void>;
}
