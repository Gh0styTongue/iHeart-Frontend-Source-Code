import { lightDark } from '@iheartradio/web.accomplice';
import { Microphone } from '@iheartradio/web.accomplice/icons/microphone';
import { Playlist } from '@iheartradio/web.accomplice/icons/playlist';
import { Radio } from '@iheartradio/web.accomplice/icons/radio';
import { Search } from '@iheartradio/web.accomplice/icons/search';
import { StationEnum } from '@iheartradio/web.api/amp';
import { slugify } from '@iheartradio/web.utilities/string/slugify';
import type { JSX } from 'react';

import type { CardCarouselKind } from '../card-carousel/card-carousel';

export type RecentlyPlayedPages =
  | 'playlists_directory'
  | 'radio_directory'
  | 'podcasts_directory'
  | 'home';

export type RecentlyPlayedMappingData = RecentlyPlayedCommonData &
  RecentlyPlayedStateData;

export type RecentlyPlayedStateData = {
  description: string;
  logo: JSX.Element | null;
  editable?: boolean;
};

export type RecentlyPlayedCommonData = {
  title: string;
  titleSlug: CardCarouselKind;
  stationTypes: StationEnum[];
  editable?: boolean;
};

export type RecentlyPlayedMappingType = {
  [K in RecentlyPlayedPages]: {
    editable: boolean;
    common: RecentlyPlayedCommonData;
    states: {
      anon: RecentlyPlayedStateData;
      auth: RecentlyPlayedStateData;
    };
  };
};

export const RecentlyPlayedMapping: RecentlyPlayedMappingType = {
  playlists_directory: {
    editable: false,
    common: {
      title: 'Recently Played Playlists',
      titleSlug: slugify('Recently Played Playlists') as CardCarouselKind,
      stationTypes: [StationEnum.COLLECTION],
    },
    states: {
      anon: {
        description: 'Log in for free to save your listening history and more.',
        logo: null,
      },
      auth: {
        description: "Listen to a playlist and you'll find your history here.",
        logo: <Playlist color={lightDark('$red550', '$red300')} size={32} />,
      },
    },
  },
  radio_directory: {
    editable: false,
    common: {
      title: 'Recently Played Stations',
      titleSlug: slugify('Recently Played Stations') as CardCarouselKind,
      stationTypes: [StationEnum.RADIO, StationEnum.LIVE],
    },
    states: {
      anon: {
        description: 'Log in for free to save your listening history and more.',
        logo: null,
      },
      auth: {
        description: "Listen to radio and you'll find your history here.",
        logo: <Radio color={lightDark('$red550', '$red300')} size={32} />,
      },
    },
  },
  podcasts_directory: {
    editable: false,
    common: {
      title: 'Recently Played Podcasts',
      titleSlug: slugify('Recently Played Podcasts') as CardCarouselKind,
      stationTypes: [StationEnum.PODCAST],
    },
    states: {
      anon: {
        description: 'Log in for free to save your listening history and more.',
        logo: null,
      },
      auth: {
        description: "Listen to podcasts and you'll find your history here.",
        logo: <Microphone color={lightDark('$red550', '$red300')} size={32} />,
      },
    },
  },
  home: {
    editable: true,
    common: {
      title: 'Recently Played',
      titleSlug: slugify('Recently Played') as CardCarouselKind,
      stationTypes: [
        StationEnum.ARTIST,
        StationEnum.COLLECTION,
        StationEnum.FAVORITES,
        StationEnum.LIVE,
        StationEnum.PODCAST,
        StationEnum.RADIO,
      ],
    },
    states: {
      anon: {
        description: 'Log in for free to save your listening history and more.',
        logo: null,
      },
      auth: {
        description:
          'Listen to live radio, artists, podcasts and playlists to see your listening history.',
        logo: <Search color={lightDark('$red550', '$red300')} size={32} />,
      },
    },
  },
};
