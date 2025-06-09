import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { Customer } from '@/domain/customer/customer'

export class InMemoryCustomerRepository implements CustomerRepository {
  customers: Customer[] = []

  async existsByDocument(document: string): Promise<boolean> {
    return this.customers.some(customer => customer.document === document)
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.customers.some(customer => customer.email === email)
  }

  async findById(id: string): Promise<Customer | null> {
    return this.customers.find(customer => customer.id === id) || null
  }

  async save(customer: Customer): Promise<void> {
    this.customers.push(customer)
  }

  async update(customer: Customer): Promise<void> {
    const index = this.customers.findIndex(i => i.id === customer.id)
    if (index !== -1) this.customers[index] = customer
  }
}
