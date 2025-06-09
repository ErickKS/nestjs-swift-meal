import { Customer } from '@/domain/customer/customer'

export abstract class CustomerRepository {
  abstract existsByDocument(document: string): Promise<boolean>
  abstract existsByEmail(email: string): Promise<boolean>
  abstract findById(id: string): Promise<Customer | null>
  abstract save(customer: Customer): Promise<void>
}
