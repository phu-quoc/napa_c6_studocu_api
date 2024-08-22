export interface Pagination<T> {
  current: number;
  pageSize: number;
  total: number;
  data: T[];
}
