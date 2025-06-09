import { Entity } from '@/shared/kernel/entities/entity'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'
import { Document } from './value-objects/document'
import { Email } from './value-objects/email'
import { Name } from './value-objects/name'

export interface CustomerProps {
  name: Name
  email: Email
  document: Document
  createdAt: Date
}

export interface CreateCustomerProps {
  name: string
  email: string
  document: string
  createdAt?: Date
}

interface RestoreCustomerProps {
  name: string
  email: string
  document: string
  createdAt: Date
}

export class Customer extends Entity<CustomerProps> {
  get name(): string {
    return this.props.name.value
  }

  get email(): string {
    return this.props.email.value
  }

  get document(): string {
    return this.props.document.value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(props: CreateCustomerProps, id?: string): Customer {
    return new Customer(
      {
        name: Name.create(props.name),
        email: Email.create(props.email),
        document: Document.create(props.document),
        createdAt: props.createdAt ?? new Date(),
      },
      UniqueEntityID.create(id)
    )
  }

  static restore(props: RestoreCustomerProps, id: string): Customer {
    return new Customer(
      {
        name: Name.restore(props.name),
        email: Email.restore(props.email),
        document: Document.restore(props.document),
        createdAt: props.createdAt,
      },
      UniqueEntityID.restore(id)
    )
  }
}
