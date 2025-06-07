import { Entity } from '@/shared/kernel/entities/entity'
import { Price } from '@/shared/kernel/value-objects/price'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'
import { ItemCategoryId } from './value-objects/item-category-id'
import { ItemCode } from './value-objects/item-code'
import { ItemDescription } from './value-objects/item-description'
import { ItemName } from './value-objects/item-name'

export interface ItemProps {
  code: ItemCode
  name: ItemName
  description: ItemDescription
  price: Price
  active: boolean
  categoryId: ItemCategoryId
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateItemProps {
  code: string
  name: string
  description: string
  price: number
  active?: boolean
  categoryId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface RestoreItemProps {
  code: string
  name: string
  description: string
  price: number
  active: boolean
  categoryId: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class Item extends Entity<ItemProps> {
  get code(): string {
    return this.props.code.value
  }

  get name(): string {
    return this.props.name.value
  }

  get description(): string {
    return this.props.description.value
  }

  get price(): number {
    return this.props.price.decimal
  }

  get priceInCents(): number {
    return this.props.price.cents
  }

  get categoryId(): string {
    return this.props.categoryId.value
  }

  get active(): boolean {
    return !this.isDeleted() && this.props.active
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt
  }

  touch(): void {
    this.props.updatedAt = new Date()
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== null
  }

  isAvailable(): boolean {
    return !this.isDeleted() && this.props.active
  }

  deactivate(): void {
    if (this.isDeleted()) throw new Error('Item is deleted')
    if (!this.props.active) throw new Error('Item is already inactive')
    this.props.active = false
    this.touch()
  }

  reactivate(): void {
    if (this.isDeleted()) throw new Error('Cannot reactivate a deleted item')
    if (this.props.active) throw new Error('Item is already active')
    this.props.active = true
    this.touch()
  }

  softDelete(): void {
    if (this.isDeleted()) throw new Error('Item already deleted')
    this.props.deletedAt = new Date()
    this.touch()
  }

  restoreDeletion(): void {
    if (!this.isDeleted()) throw new Error('Item is not deleted')
    this.props.deletedAt = null
    this.touch()
  }

  static create(props: CreateItemProps, id?: string): Item {
    return new Item(
      {
        code: ItemCode.create(props.code),
        name: ItemName.create(props.name),
        description: ItemDescription.create(props.description),
        price: Price.createFromDecimal(props.price),
        active: props.active ?? true,
        categoryId: ItemCategoryId.create(props.categoryId),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      UniqueEntityID.create(id)
    )
  }

  static restore(props: RestoreItemProps, id: string): Item {
    return new Item(
      {
        code: ItemCode.restore(props.code),
        name: ItemName.restore(props.name),
        description: ItemDescription.restore(props.description),
        price: Price.createFromCents(props.price),
        active: props.active,
        categoryId: ItemCategoryId.restore(props.categoryId),
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
        deletedAt: props.deletedAt ?? null,
      },
      UniqueEntityID.restore(id)
    )
  }
}
