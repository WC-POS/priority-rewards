import { Query } from "mongoose";

export interface PaginateOptions {
  page?: number;
  size?: number;
}

export interface PaginateResults<T> {
  count: number;
  page: number;
  maxPage: number;
  results: T[];
}

export interface PaginateFn<T> {
  (queryset: Query<T[], T>, pageOptions: PaginateOptions): Promise<
    PaginateResults<T>
  >;
}

export async function paginate<T>(
  queryset: Query<T[], T>,
  pageOptions: PaginateOptions = {}
): Promise<PaginateResults<T>> {
  const page = pageOptions.page ? pageOptions.page : 1;
  const size = pageOptions.size
    ? pageOptions.size
    : parseInt(process.env.PAGE_SIZE);
  const count = await queryset.model.find(queryset.getFilter()).count().exec();
  const results = await queryset
    .skip(size * (page - 1))
    .limit(size)
    .exec();
  const maxPage = Math.ceil(count / size);
  return {
    count,
    page,
    maxPage,
    results,
  };
}
