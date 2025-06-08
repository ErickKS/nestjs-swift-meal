import { Item } from './item'

const makeValidProps = () => ({
  code: 'ITEM-001',
  name: 'Test Item',
  description: 'A test item for unit testing',
  price: 10,
  categoryId: 'category-id',
})

describe('Item Entity', () => {
  it('should create an item with valid properties', () => {
    const props = makeValidProps()
    const item = Item.create(props)
    expect(item.code).toBe(props.code)
    expect(item.name).toBe(props.name)
    expect(item.description).toBe(props.description)
    expect(item.price).toBe(props.price)
    expect(item.priceInCents).toBe(1000)
    expect(item.categoryId).toBe(props.categoryId)
    expect(item.active).toBe(true)
    expect(item.isDeleted()).toBe(false)
    expect(item.isAvailable()).toBe(true)
  })

  it('should deactivate an active item', async () => {
    const item = Item.create(makeValidProps())
    item.deactivate()
    expect(item.active).toBe(false)
    expect(item.isAvailable()).toBe(false)
  })

  it('should not deactivate an already inactive item', () => {
    const item = Item.create({ ...makeValidProps(), active: false })
    expect(() => item.deactivate()).toThrowError('Item is already inactive')
  })

  it('should reactivate an inactive item', () => {
    const item = Item.create({ ...makeValidProps(), active: false })
    item.reactivate()
    expect(item.active).toBe(true)
    expect(item.isAvailable()).toBe(true)
  })

  it('should not reactivate an already active item', () => {
    const item = Item.create(makeValidProps())
    expect(() => item.reactivate()).toThrowError('Item is already active')
  })

  it('should soft delete a valid item', () => {
    const item = Item.create(makeValidProps())
    item.softDelete()
    expect(item.deletedAt).not.toBeNull()
    expect(item.isDeleted()).toBe(true)
    expect(item.isAvailable()).toBe(false)
  })

  it('should not soft delete an already deleted item', () => {
    const item = Item.create(makeValidProps())
    item.softDelete()
    expect(() => item.softDelete()).toThrowError('Item already deleted')
  })

  it('should restore a soft-deleted item', () => {
    const item = Item.create(makeValidProps())
    item.softDelete()
    item.restoreDeletion()
    expect(item.deletedAt).toBeNull()
    expect(item.isDeleted()).toBe(false)
  })

  it('should not restore a non-deleted item', () => {
    const item = Item.create(makeValidProps())
    expect(() => item.restoreDeletion()).toThrowError('Item is not deleted')
  })

  it('should not allow reactivation of a deleted item', () => {
    const item = Item.create({ ...makeValidProps(), active: false })
    item.softDelete()
    expect(() => item.reactivate()).toThrowError('Cannot reactivate a deleted item')
  })

  it('should not allow deactivation of a deleted item', () => {
    const item = Item.create(makeValidProps())
    item.softDelete()
    expect(() => item.deactivate()).toThrowError('Item is deleted')
  })

  it('should update name, description, price and categoryId', () => {
    const item = Item.create(makeValidProps())
    item.update({
      name: 'Updated Name',
      description: 'Updated Description',
      price: 25.5,
      categoryId: 'new-category-id',
    })
    expect(item.name).toBe('Updated Name')
    expect(item.description).toBe('Updated Description')
    expect(item.price).toBe(25.5)
    expect(item.priceInCents).toBe(2550)
    expect(item.categoryId).toBe('new-category-id')
  })

  it('should not allow update if item is deleted', () => {
    const item = Item.create(makeValidProps())
    item.softDelete()
    expect(() => item.update({ name: 'Updated Name' })).toThrowError('Cannot update a deleted item')
  })
})
