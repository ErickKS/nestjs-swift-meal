export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ALL = 'ALL',
}

export type FetchCategoriesSearchParams = {
  status?: CategoryStatus.ACTIVE | CategoryStatus.INACTIVE | CategoryStatus.ALL
  sortOrder?: 'asc' | 'desc'
}
