import { UniqueEntityID } from './unique-entity-id'

describe('UniqueEntityID Value Object', () => {
  it('should create a new UniqueEntityID with a generated value', () => {
    const id = UniqueEntityID.create()
    expect(id.value).toBeDefined()
    expect(typeof id.value).toBe('string')
  })

  it('should create a UniqueEntityID with a specific value', () => {
    const customId = 'custom-id-123'
    const id = UniqueEntityID.create(customId)
    expect(id.value).toBe(customId)
  })

  it('should restore a UniqueEntityID from an existing value', () => {
    const existingId = 'existing-id-456'
    const id = UniqueEntityID.restore(existingId)
    expect(id.value).toBe(existingId)
  })
})
