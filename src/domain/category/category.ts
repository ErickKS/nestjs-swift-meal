import { Entity } from '@/shared/kernel/entities/entity'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'
import { CategoryName } from './value-objects/category-name'

export interface CategoryProps {
  name: CategoryName
  createdAt: Date
  updatedAt: Date
}

interface CreateCategoryProps {
  name: string
  createdAt?: Date
  updatedAt?: Date
}

interface RestoreCategoryProps {
  name: string
  createdAt: Date
  updatedAt: Date
}

export class Category extends Entity<CategoryProps> {
  get name(): string {
    return this.props.name.value
  }

  set name(name: string) {
    this.props.name = CategoryName.create(name)
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
        name: CategoryName.create(props.name),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      UniqueEntityID.create(id)
    )
  }

  static restore(props: RestoreCategoryProps, id: string): Category {
    return new Category(
      {
        name: CategoryName.restore(props.name),
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
      UniqueEntityID.restore(id)
    )
  }
}
