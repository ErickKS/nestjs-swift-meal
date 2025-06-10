import { FetchCustomersSearchParams } from '@/application/customer/@types/fetch-custormers-search-filters'
import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { Customer } from '@/domain/customer/customer'

export class InMemoryCustomerRepository implements CustomerRepository {
  customers: Customer[] = []

  private applyFilters(params: FetchCustomersSearchParams): Customer[] {
    const { name, document, email } = params
    const normalize = (text: string) => text.toLowerCase().trim()
    let filtered = [...this.customers]
    if (name) filtered = filtered.filter(item => normalize(item.name).includes(normalize(name)))
    if (document) filtered = filtered.filter(item => item.document === document)
    if (email) filtered = filtered.filter(item => item.email === email)
    return filtered
  }

  async existsByDocument(document: string): Promise<boolean> {
    return this.customers.some(customer => customer.document === document)
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.customers.some(customer => customer.email === email)
  }

  async findMany(params: FetchCustomersSearchParams): Promise<Customer[]> {
    const filtered = this.applyFilters(params)
    const { page = 1, perPage = 10, sortOrder = 'asc' } = params
    const start = (page - 1) * perPage
    const end = start + perPage
    const sorted = filtered.sort((a, b) => (sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    return sorted.slice(start, end)
  }

  async findByDocument(document: string): Promise<Customer | null> {
    return this.customers.find(customer => customer.document === document) || null
  }

  async save(customer: Customer): Promise<void> {
    this.customers.push(customer)
  }

  async update(customer: Customer): Promise<void> {
    const index = this.customers.findIndex(i => i.id === customer.id)
    if (index !== -1) this.customers[index] = customer
  }

  async count(params: FetchCustomersSearchParams): Promise<number> {
    return this.applyFilters(params).length
  }
}
