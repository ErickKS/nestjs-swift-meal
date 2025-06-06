import { UniqueEntityID } from '../value-objects/unique-entity-id'
import { Entity } from './entity'

interface DummyProps {
  name: string
  age: number
}

class DummyEntity extends Entity<DummyProps> {
  static create(props: DummyProps, id?: UniqueEntityID): DummyEntity {
    return new DummyEntity(props, id)
  }

  get name(): string {
    return this.props.name
  }
}

describe('Entity', () => {
  it('should create an entity with a generated id if none is provided', () => {
    const entity = DummyEntity.create({ name: 'John', age: 30 })
    expect(entity.id).toBeDefined()
    expect(typeof entity.id).toBe('string')
  })

  it('should create an entity with the provided UniqueEntityID', () => {
    const customId = UniqueEntityID.create()
    const entity = DummyEntity.create({ name: 'Alice', age: 25 }, customId)
    expect(entity.id).toBe(customId.value)
  })

  it('should retain the provided props', () => {
    const props = { name: 'Bob', age: 40 }
    const entity = DummyEntity.create(props)
    expect(entity.name).toBe('Bob')
  })

  it('should generate different ids for different instances by default', () => {
    const entity1 = DummyEntity.create({ name: 'Test1', age: 1 })
    const entity2 = DummyEntity.create({ name: 'Test2', age: 2 })
    expect(entity1.id).not.toBe(entity2.id)
  })

  it('should accept the same id for multiple entities if explicitly passed', () => {
    const id = UniqueEntityID.create()
    const entity1 = DummyEntity.create({ name: 'Same', age: 1 }, id)
    const entity2 = DummyEntity.create({ name: 'Same', age: 1 }, id)
    expect(entity1.id).toBe(entity2.id)
  })
})
