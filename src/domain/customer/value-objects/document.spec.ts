import { Document } from './document'

describe('Document Value Object', () => {
  it('should create a valid document', () => {
    const validCPF = '529.982.247-25'
    const document = Document.create(validCPF)
    expect(document.value).toBe(validCPF)
  })

  it('should create a valid document with only digits', () => {
    const validCPF = '52998224725'
    const document = Document.create(validCPF)
    expect(document.value).toBe(validCPF)
  })

  it('should throw on empty value', () => {
    expect(() => Document.create('')).toThrow('Document must not be empty')
  })

  it('should throw if CPF has all same digits', () => {
    expect(() => Document.create('111.111.111-11')).toThrow('Invalid CPF format')
  })

  it('should throw if CPF has invalid check digits', () => {
    expect(() => Document.create('529.982.247-24')).toThrow('Invalid CPF check digits')
  })

  it('should restore without validation', () => {
    const restored = Document.restore('52998224725')
    expect(restored.value).toBe('52998224725')
  })
})
