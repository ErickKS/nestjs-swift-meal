import { Entity } from '@/shared/kernel/entities/entity'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'

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

export class Category extends Entity<CategoryProps> {
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

  static create(props: CreateCategoryProps, id?: string): Category {
    return new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      UniqueEntityID.create(id)
    )
  }

  static restore(props: CategoryProps, id: string): Category {
    return new Category({ ...props }, UniqueEntityID.create(id))
  }
}
