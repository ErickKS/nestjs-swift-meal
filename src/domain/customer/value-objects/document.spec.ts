import { Document } from './document'

describe('Document Value Object', () => {
  it('should create a valid document', () => {
    const document = Document.create('529.982.247-25')
    expect(document.value).toBe('52998224725')
  })

  it('should create a valid document with only digits', () => {
    const document = Document.create('52998224725')
    expect(document.value).toBe('52998224725')
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

  it('should restore and clean the value', () => {
    const restored = Document.restore('529.982.247-25')
    expect(restored.value).toBe('52998224725')
  })

  it('should validate CPF that triggers rest === 10 (returns 0)', () => {
    const trickyCPF = '16899535009'
    const document = Document.create(trickyCPF)
    expect(document.value).toBe(trickyCPF)
  })
})
