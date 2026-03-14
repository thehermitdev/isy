export abstract class BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  touch(): void {
    this.updatedAt = new Date();
  }

  equals(other: BaseEntity): boolean {
    return this.id === other.id;
  }
}
