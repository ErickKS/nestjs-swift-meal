export enum ItemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export type FetchItemsSearchParams = {
  code?: string
  name?: string
  categoryId?: string
  status?: ItemStatus.ACTIVE | ItemStatus.INACTIVE | ItemStatus.DELETED
  page?: number
  perPage?: number
  sortOrder?: 'asc' | 'desc'
}
