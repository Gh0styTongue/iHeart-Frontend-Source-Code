import { gql } from 'graphql-request';

import type { LiveProfileQuery } from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import type { WithEmits } from '../../types.js';

const liveProfileQuery = gql`
  # Write your query or mutation here
  query LiveProfile($streamId: String!, $timeZone: String) {
    sites {
      find(type: STREAM, value: $streamId) {
        onAirSchedule(timeZone: $timeZone) {
          current {
            ...scheduleFields
          }
          upcoming(take: 2) {
            ...scheduleFields
          }
        }
        canonicalHostname
        liveConfig {
          common {
            social {
              facebook: facebookName
              twitter: twitterName
              instagram: instagramName
              youtube: youtubeName
              snapchat: snapchatName
              pinterest: pinterestName
            }
            design {
              heroColor
              heroImage {
                asset {
                  href
                }
              }
            }
            contact {
              sms
              phone: requestPhone
            }
            partners {
              showIniHeartSwitch
            }
            content {
              podcasts {
                id
              }
              playlists {
                id
              }
            }
          }
          timeline: feed(
            params: { id: "USAGE:feed-usecases/Default Content", size: 10 }
          ) {
            results {
              type
              ... on SitesFeedPubsubResult {
                __typename
                record {
                  type
                  payload
                  slug
                  summary {
                    image
                    title
                  }
                }
              }
              ... on SitesFeedLeadsResult {
                ...leadFields
              }
            }
            resume {
              id
              from
              size
              context
              scopes
            }
          }
          leads: feed(
            params: { id: "USAGE:feed-usecases/Default Promotions", size: 10 }
          ) {
            results {
              ... on SitesFeedLeadsResult {
                ...leadFields
              }
            }
            resume {
              id
              from
              size
              context
              scopes
            }
          }
        }
      }
    }
  }

  fragment leadFields on SitesFeedLeadsResult {
    __typename
    record {
      title
      subtitle
      img_uri
      link {
        urls
      }
    }
  }

  fragment scheduleFields on SitesOnAirExtended {
    name
    coreShowId
    start: startTime12
    startMs
    stop: stopTime12
    stopMs
    destination {
      host
      thumbnail
      href
    }
  }
`;

export const liveProfile = (data: {
  streamId: string;
  timeZone: string;
}): GraphQLOperation<
  { streamId: string; timeZone: string },
  WithEmits<LiveProfileQuery>
> => {
  const { streamId, timeZone } = data;
  return {
    document: liveProfileQuery,
    variables: { streamId, timeZone },
  };
};
