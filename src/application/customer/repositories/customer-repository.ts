import { Customer } from '@/domain/customer/customer'
import { FetchCustomersSearchParams } from '../@types/fetch-custormers-search-filters'

export abstract class CustomerRepository {
  abstract existsByDocument(document: string): Promise<boolean>
  abstract existsByEmail(email: string): Promise<boolean>
  abstract findMany(params: FetchCustomersSearchParams): Promise<Customer[]>
  abstract count(params: FetchCustomersSearchParams): Promise<number>
  abstract findById(id: string): Promise<Customer | null>
  abstract findByDocument(id: string): Promise<Customer | null>
  abstract save(customer: Customer): Promise<void>
}
