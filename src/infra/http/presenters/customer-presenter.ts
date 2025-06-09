import { Customer } from '@/domain/customer/customer'

export class CustomerPresenter {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id,
      name: customer.name,
      document: customer.document,
      email: customer.email,
      createdAt: customer.createdAt,
    }
  }
}
