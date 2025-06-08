export interface PaginationOuput<T> {
  total: number
  page: number
  perPage: number
  totalPages: number
  data: T[]
}
