import { PaginationType } from 'types';

export function extractTotalPages<T>(
  object: (T & PaginationType)[],
  page?: number,
  size?: number,
): {
  result: T[];
  pages: PaginationType;
} {
  const result = object.map((o) => {
    const { totalPages, page, ...rest } = o;
    return rest as T;
  });
  const pages: PaginationType = {
    page: Number(page),
    totalPages: size
      ? Math.trunc((object[0]?.totalPages ?? 0) / (size ?? 1))
      : undefined,
  };
  return { result, pages };
}
