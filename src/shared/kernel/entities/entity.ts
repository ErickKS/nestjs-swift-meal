import { UniqueEntityID } from '../value-objects/unique-entity-id'

export class Entity<Props> {
  private readonly _id: UniqueEntityID
  protected readonly props: Props

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? UniqueEntityID.create()
    this.props = props
  }

  get id(): string {
    return this._id.value
  }
}
