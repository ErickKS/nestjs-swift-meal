import { randomUUID } from 'node:crypto'

export interface CategoryProps {
  name: string
  createdAt: Date
  updatedAt: Date
}

interface CreateCategoryProps {
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export class Category {
  private readonly _id: string
  private readonly props: CategoryProps

  get id(): string {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  touch(): void {
    this.props.updatedAt = new Date()
  }

  private constructor(props: CategoryProps, id: string) {
    this._id = id
    this.props = props
  }

  static create(props: CreateCategoryProps, id?: string): Category {
    return new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id ?? randomUUID()
    )
  }

  static restore(props: CategoryProps, id: string): Category {
    return new Category({ ...props }, id)
  }
}
