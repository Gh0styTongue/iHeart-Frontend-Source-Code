export const artistKeys = {
  all: ['artists'] as const,
  followed: ['artists', 'followed'] as const,
  recs: ['artists', 'recs'] as const,
  isFollowing: (id: number | string) =>
    [...artistKeys.one(String(id)), 'isFollowing'] as const,
  recsForGenre: (genreId: number) => [...artistKeys.recs, genreId] as const,
  one: (id: number | string) => [...artistKeys.all, String(id)] as const,
  station: (id: number | string) =>
    [...artistKeys.one(String(id)), 'station'] as const,
};
