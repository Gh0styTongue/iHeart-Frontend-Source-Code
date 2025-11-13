export const liveStationKeys = {
  all: ['live-stations'] as const,
  followed: ['live-stations', 'followed'] as const,
  recs: ['live-stations', 'recs'] as const,
  one: (id: number | string) => [...liveStationKeys.all, String(id)] as const,
  isFollowing: (id: number | string) =>
    [...liveStationKeys.one(String(id)), 'isFollowing'] as const,
};
