import { BaseEntity } from './BaseEntity.js';

export class Contact extends BaseEntity {
  accountId: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;

  constructor(props: {
    id: string;
    accountId?: string | null;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    jobTitle?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.accountId = props.accountId ?? null;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email ?? null;
    this.phone = props.phone ?? null;
    this.jobTitle = props.jobTitle ?? null;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
