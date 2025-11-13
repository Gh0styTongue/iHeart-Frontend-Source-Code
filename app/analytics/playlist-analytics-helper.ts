import type { Analytics } from '@iheartradio/web.analytics';

import { PlaylistTypes } from '~app/routes/_app/playlist.$playlistSlug/constants';

type PlaylistAnalyticsOptions = {
  isCurated: boolean;
  profileId: string | undefined;
  playlistUserId: string;
  playlistId: string;
  playlistName: string;
  playlistType: string;
  userType: string | undefined;
  isAnonymous: boolean;
};

export function playlistAnalyticsData({
  isCurated,
  profileId,
  playlistUserId,
  playlistId,
  playlistName,
  playlistType,
  userType,
  isAnonymous,
}: PlaylistAnalyticsOptions): {
  asset: Analytics.PlaylistAsset;
  pageName: Analytics.PageView['pageName'];
} {
  if (isCurated) {
    return isAnonymous || userType === 'NONE' ?
        {
          asset: {
            type: 'playlist',
            id: `playlist_radio|${playlistUserId}::${playlistId}`,
            name: playlistName,
            subtype: 'curated',
          },
          pageName: 'playlist_profile',
        }
      : {
          asset: {
            type: 'playlist',
            id: `curated_playlist|${playlistUserId}::${playlistId}`,
            name: playlistName,
            subtype: 'curated',
          },
          pageName: 'curated_playlist_profile',
        };
  }
  if (playlistType === PlaylistTypes.New4U) {
    return {
      asset: {
        type: 'playlist',
        id: `new_for_you_playlist|${profileId}`,
        name: playlistName,
        subtype: 'new_for_you',
      },
      pageName: 'new_for_you_playlist_profile',
    };
  }
  if (profileId === playlistUserId && playlistType !== PlaylistTypes.Default) {
    return {
      asset: {
        type: 'playlist',
        id: `user_playlist|${playlistUserId}::${playlistId}`,
        name: playlistName,
        subtype: 'user',
      },
      pageName: 'user_playlist_profile',
    };
  }

  if (profileId !== playlistUserId) {
    return {
      asset: {
        type: 'playlist',
        id: `shared_user_playlist|${playlistUserId}::${playlistId}`,
        name: playlistName,
        subtype: 'shared_user',
      },
      pageName: 'shared_playlist_profile',
    };
  }

  return {
    asset: {
      type: 'playlist',
      id: `my_playlist|${playlistUserId}::${playlistId}`,
      name: 'my_playlist',
      subtype: 'my',
    },
    pageName: 'my_playlist_profile',
  };
}
