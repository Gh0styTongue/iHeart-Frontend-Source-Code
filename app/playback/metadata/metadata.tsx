import { PlayerArtwork } from '@iheartradio/web.accomplice/components/player';
import { MediaServerURL } from '@iheartradio/web.assets';
import { StationType } from '@iheartradio/web.playback';
import { memo } from 'react';
import { isNullish } from 'remeda';

import { playback } from '../playback';
import { AdsMetadata } from './ads-metadata';
import { AlbumMetadata } from './album-metadata';
import { ArtistMetadata } from './artist-metadata';
import { FavoritesMetadata } from './favorites-metadata';
import { LiveMetadata } from './live-metadata';
import { PlaylistMetadata } from './playlist-metadata';
import { PodcastMetadata } from './podcast-metadata';
import { ScanMetadata } from './scan-metadata';
import { TopSongsMetadata } from './top-songs-metadata';

type ContentMetadataProps = {
  kind: StationType | 'Ad';
};

export const ContentMetadata = memo(function ContentMetadata({
  kind,
}: ContentMetadataProps) {
  switch (kind) {
    case StationType.Album: {
      return <AlbumMetadata />;
    }
    case StationType.Artist: {
      return <ArtistMetadata />;
    }
    case StationType.Favorites: {
      return <FavoritesMetadata />;
    }
    case StationType.Live: {
      return <LiveMetadata />;
    }
    case StationType.Playlist: {
      return <PlaylistMetadata />;
    }
    case StationType.PlaylistRadio: {
      return <PlaylistMetadata />;
    }
    case StationType.Podcast: {
      return <PodcastMetadata />;
    }
    case StationType.Scan: {
      return <ScanMetadata />;
    }
    case StationType.TopSongs: {
      return <TopSongsMetadata />;
    }
    case 'Ad': {
      return <AdsMetadata />;
    }
    default: {
      console.error(`Station kind "${kind} not recognized"`);
      return null;
    }
  }
});

export function Metadata({ onClick }: { onClick?: () => void }) {
  const metadata = playback.useMetadata();
  const state = playback.useState();
  const { adBreak } = playback.useAds();

  if (isNullish(state.station)) {
    return null;
  }

  return (
    <>
      <PlayerArtwork
        alt={metadata?.data.description ?? 'media artwork'}
        // lazy={adBreak ? false : true}
        onClick={onClick}
        src={
          metadata?.data.image ?
            MediaServerURL.fromURL(metadata.data.image)
              /**
               * The height/width of the artwork at its largest size is 88px. There are devices that
               * have higher pixel densities though, so I am doubling it to account for the entire
               * spectrum of devices.
               */
              .fit(176, 176)
              .ratio(1, 1)
              .toString()
          : undefined
        }
      />
      <ContentMetadata kind={adBreak ? 'Ad' : state.station.type} />
    </>
  );
}
