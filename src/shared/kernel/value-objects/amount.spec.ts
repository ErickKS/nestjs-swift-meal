import { describe, expect, it } from 'vitest'
import { Amount } from './amount'

describe('Amount Value Object', () => {
  it('should create price from decimal and return correct cents', () => {
    const price = Amount.createFromDecimal(19.9)
    expect(price.cents).toBe(1990)
    expect(price.decimal).toBeCloseTo(19.9)
  })

  it('should round decimals correctly when creating from decimal', () => {
    const price = Amount.createFromDecimal(19.999)
    expect(price.cents).toBe(2000)
  })

  it('should create price from cents and return correct decimal', () => {
    const price = Amount.createFromCents(1234)
    expect(price.decimal).toBeCloseTo(12.34)
    expect(price.cents).toBe(1234)
  })

  it('should return zero if created with negative decimal', () => {
    const price = Amount.createFromDecimal(-10)
    expect(price.cents).toBe(0)
    expect(price.decimal).toBe(0)
  })

  it('should return zero if created with negative cents', () => {
    const price = Amount.createFromCents(-100)
    expect(price.cents).toBe(0)
    expect(price.decimal).toBe(0)
  })

  it('should return exact cents and decimal for 0', () => {
    const price = Amount.createFromDecimal(0)
    expect(price.cents).toBe(0)
    expect(price.decimal).toBe(0)
  })

  it('should multiply amount correctly', () => {
    const price = Amount.createFromDecimal(19.9)
    const result = price.multiply(2)
    expect(result.cents).toBe(3980)
    expect(result.decimal).toBeCloseTo(39.8)
  })

  it('should add two amounts correctly', () => {
    const a = Amount.createFromDecimal(10.5)
    const b = Amount.createFromDecimal(4.25)
    const result = a.add(b)
    expect(result.cents).toBe(1475)
    expect(result.decimal).toBeCloseTo(14.75)
  })

  it('should subtract two amounts correctly', () => {
    const a = Amount.createFromDecimal(20)
    const b = Amount.createFromDecimal(5.5)
    const result = a.subtract(b)
    expect(result.cents).toBe(1450)
    expect(result.decimal).toBeCloseTo(14.5)
  })

  it('should compare two equal amounts correctly', () => {
    const a = Amount.createFromDecimal(12.34)
    const b = Amount.createFromCents(1234)
    expect(a.equals(b)).toBe(true)
  })

  it('should compare two different amounts correctly', () => {
    const a = Amount.createFromDecimal(10)
    const b = Amount.createFromDecimal(15)
    expect(a.equals(b)).toBe(false)
  })
})
