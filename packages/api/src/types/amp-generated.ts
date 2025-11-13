/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AccountType */
export enum AccountType {
  IHR = 'IHR',
  FACEBOOK = 'FACEBOOK',
  IHR_FACEBOOK = 'IHR_FACEBOOK',
  GOOGLE_PLUS = 'GOOGLE_PLUS',
  AMAZON = 'AMAZON',
  TWITTER = 'TWITTER',
  ANONYMOUS = 'ANONYMOUS',
  MICROSOFT = 'MICROSOFT',
  GOOGLE = 'GOOGLE',
  GIGYA = 'GIGYA',
  APPLE = 'APPLE',
}

/** AdRequest */
export interface AdRequest {
  host?: string;
  includeStreamTargeting: boolean;
  /** @format int32 */
  playedFrom?: number;
  stationId?: string;
  stationType?: StationEnum;
}

/** AdRestValue */
export interface AdRestValue {
  adType?: string;
  playBefore?: boolean;
  preroll?: boolean;
  /** @format int32 */
  reportingId?: number;
  /** @format int64 */
  startDate?: number;
  url?: string;
}

/**
 * HTTP response code
 * @format binary
 */
export type AddGenresData = File;

export type AddLiveRadioStationData = ResultRestValue;

export interface AddLiveRadioStationPayload {
  /**
   * if true, will also be added to user favorites.
   * @default "false"
   */
  addToUserFavorites?: boolean;
  /**
   * #required#
   * @format int32
   */
  liveRadioStationId?: number;
  /** #required# */
  liveRadioStationName?: string;
  /**
   * #required#
   * @format int64
   */
  profileId?: number;
  /** #required# */
  sessionId?: string;
}

/** a JSON array of this user's radio stations. */
export type AddRadioStationData = RadioStationRestValueList;

export interface AddRadioStationPayload {
  /**
   * also add the station to the list of user favorites.
   * @default "false"
   */
  addToUserFavorites?: boolean;
  /**
   * When adding a artist or track station, this will allow the user to listen to a track on the specified album ID.
   * @format int32
   */
  albumToPlay?: number;
  /**
   * a single artist id #required#
   * @format int32
   */
  artistId?: number;
  /** Override the default radio station name. #required# */
  name?: string;
  /**
   * (Required) the requestor's profile id
   * @format int64
   */
  profileId: number;
  /**
   * true or false whether you want this API to return a stub to
   * get the radio station later by ID, or to return a fully
   * realized radio station object with tracks, ready to play. All
   * tracks returned will be stream-able by default.
   * @default "true"
   */
  returnFullStation?: boolean;
  /** (Required) the session id */
  sessionId?: string;
  /**
   * a single track id #required#
   * @format int32
   */
  trackId?: number;
}

/** an object representing the results of the operation */
export type AddShowToStationData = ImmutableResultRestValue;

export interface AddShowToStationPayload {
  /** #required# */
  sessionId?: string;
}

export type AddStationData = PlaylistStationResponse;

export interface AddStationPayload {
  /** whether or not to add it to the user favorites */
  addToFavorites: boolean;
  /** fields to be returned. not yet implemented. */
  fields?: string;
  /** Name of the station to be added */
  name?: string;
}

/** HTTP response code */
export type AddSuppressedStationsData = TasteProfileResponseRV;

/** a JSON array of this user's talk stations. */
export type AddThemeStationData = TalkStationRestValueList;

export interface AddThemeStationPayload {
  /**
   * true to add show to user favorites.
   * @default "false"
   */
  addShowToUserFavorites?: boolean;
  /** - Override the default talk station name. */
  name?: string;
  /**
   * - true or false whether you want this API to return a stub to get the talk station later by ID, or to
   * return a fully realized talk station object with episodes, ready to play. All episodes returned will
   * be stream-able by default.
   * @default "true"
   */
  returnEpisodes?: boolean;
  /** #required# */
  sessionId?: string;
  /**
   * - a single show id
   * @format int32
   */
  showId?: number;
  /**
   * - a single theme id
   * @format int32
   */
  themeId?: number;
}

/**
 * Success or failure of operation and optionally fully populated station.
 * @format binary
 */
export type AddUserFavoriteData = File;

export interface AddUserFavoritePayload {
  /**
   * return the fully populated station object back to the client. default = false
   * @default "false"
   */
  returnEntity?: boolean;
}

/** AllDeviceTokensResponse */
export interface AllDeviceTokensResponse {
  dynamoTokens?: DeviceToken[];
}

/** AmwOAuthBean */
export interface AmwOAuthBean {
  accessToken?: string;
  type?: AccountType;
  uuid?: string;
}

/** AmwProfileBean */
export interface AmwProfileBean {
  /** @format int64 */
  accountUpgradeDate?: number;
  /** @format int32 */
  channelId: number;
  emailAccountType: boolean;
  /** @format int64 */
  id: number;
  oauthCredentials?: Record<string, AmwOAuthBean>;
  password?: string;
  /** @format int64 */
  registratedDate?: number;
  /** @format int32 */
  terminalId?: number;
  userName?: string;
}

/** ArtistResponse */
export type ArtistResponse = BaseResponse & {
  artistBio?: string;
  formats?: Record<string, number>;
  info?: string;
  link?: string;
  roviImages?: string[];
  /** @format int32 */
  variety?: number;
};

/** ArtistRestValue */
export interface ArtistRestValue {
  artistBio?: string;
  /** @format int32 */
  artistId: number;
  artistName?: string;
  format?: string;
  formats?: Record<string, number>;
  info?: string;
  link?: string;
  /** @format int32 */
  rank?: number;
  roviImages?: string[];
  /** @format float */
  score: number;
  /** @format int64 */
  totalBundles?: number;
  /** @format int64 */
  totalTracks?: number;
  trackBundles?: TrackBundleRestValue[];
  tracks?: TrackRestValue[];
  /** @format int32 */
  variety?: number;
}

/** BaseResponse */
export type BaseResponse = ResponseObjectV2 & {
  /** @format int32 */
  id?: number;
  imagePath?: string;
  name?: string;
  /** @format int32 */
  rank?: number;
  responseType?: ResponseEnum;
  score?: number;
  spellingSuggestions?: string[];
  /** The JSON object type. */
  type?: string;
};

/** BaseTrackResponse */
export type BaseTrackResponse = BaseResponse & {
  /** @format int32 */
  albumId?: number;
  artist?: string;
  /** @format int32 */
  artistId?: number;
  copyright?: string;
  explicitLyrics: boolean;
  searchScore?: number;
  streamReady: boolean;
  version?: string;
};

/** BestMatch */
export interface BestMatch {
  /** the confidenceVal */
  confidenceVal?: number;
  /**
   * the id
   * @format int32
   */
  id?: number;
  /** the objType */
  objType?: OBJTYPE;
}

export type ChangeEmailData = SuccessResponse;

export interface ChangeEmailPayload {
  /** the new email for the user */
  newEmail?: string;
  /** the users password */
  password?: string;
  /**
   * the profile id
   * @format int64
   */
  profileId: number;
  /** the session id */
  sessionId?: string;
}

/**
 * success or failure of operation.
 * @format binary
 */
export type ClearUserFavoritesData = File;

/** ClientConfigData */
export interface ClientConfigData {
  key?: string;
  value?: string;
}

/** ClientConfigResponse */
export type ClientConfigResponse = ResponseObject & {
  clientConfigData?: ClientConfigData[];
};

/** ContentMetadata */
export interface ContentMetadata {
  /** @format int32 */
  albumId?: number;
  albumName?: string;
  /** @format int32 */
  artistId?: number;
  artistName?: string;
  description?: string;
  /** @format int32 */
  duration?: number;
  /** @format int32 */
  id: number;
  imagePath?: string;
  /** @format int32 */
  lyricsId?: number;
  playbackRights?: PlaybackRights;
  /** @format int32 */
  podcastId?: number;
  /** @format int32 */
  secondsPlayed?: number;
  /** @format int64 */
  startDate?: number;
  title?: string;
  version?: string;
}

/** ContentType */
export enum ContentType {
  TRACK = 'TRACK',
  EPISODE = 'EPISODE',
}

/** Everything is OK. */
export type CreateUserData = CreateUserResponse;

export interface CreateUserPayload {
  accessToken?: string;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  appInstallTime?: string;
  /** @format int32 */
  birthYear?: number;
  deviceId?: string;
  deviceName?: string;
  /** @format int32 */
  emailOptOut?: number;
  gender?: string;
  /** @default "false" */
  generatePassword?: boolean;
  generateToken?: boolean;
  host: string;
  oauthUuid?: string;
  /** @default "false" */
  oauthoverride?: string;
  password: string;
  /** @default "true" */
  sendWelcomeEmail?: string;
  /**
   * @format int32
   * @default "0"
   */
  subscriptionId?: number;
  /** @format int64 */
  termsAcceptanceDate?: number;
  userName: string;
  zipCode?: string;
}

/** CreateUserResponse */
export type CreateUserResponse = ResponseObject & {
  accountType?: AccountType;
  countryCode?: string;
  loginToken?: string;
  newUser: boolean;
  oauths?: OauthRestValue[];
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  success: boolean;
};

/** CustArtistStationRestValue */
export interface CustArtistStationRestValue {
  /**
   * the rank
   * @format int32
   */
  rank: number;
  seedArtists?: number[];
  /**
   * the stationId
   * @format int32
   */
  stationId: number;
  /** the stationName */
  stationName?: string;
}

/** DLContentPayload */
export interface DLContentPayload {
  contentLink?: string;
  imageURL?: string;
  playlistId?: string;
  /** @format int64 */
  profileId: number;
  reportingKey?: string;
  sublabel?: string;
}

/** DLType */
export enum DLType {
  STATION = 'STATION',
  ARTIST = 'ARTIST',
  USER = 'USER',
  TRACK = 'TRACK',
  CURATED = 'CURATED',
  FAVORITES = 'FAVORITES',
  N4U = 'N4U',
}

/** ResetDeviceTokenRestValue User's Device Token Configuration */
export type DeleteDeviceProfileData = ResetDeviceTokenRestValue;

export interface DeleteDeviceProfilePayload {
  /**
   * device Id (1,2 etc) Either deviceId or deviceType is required
   * @format int32
   */
  deviceId?: number;
  /** device type (xbox, Mobile Device) Either deviceId or deviceType is required */
  deviceType?: string;
  /**
   * Logged in users's profile id. #required#
   * @format int64
   */
  profileId: number;
  /** Logged in users session id. #required# */
  sessionId?: string;
  /** device uuid. Either Authorization header or uuid is required */
  uuid?: string;
}

export type DeleteLiveRadioStationData = ResultRestValue;

export interface DeleteLiveRadioStationPayload {
  /**
   * #required#
   * @format int64
   */
  profileId?: number;
  /** #required# */
  sessionId?: string;
}

/** an object representing the results of the operation */
export type DeleteRadioStation2Data = ImmutableResultRestValue;

export interface DeleteRadioStation2Payload {
  /**
   * #required#
   * @format int64
   */
  profileId: number;
  /** #required# */
  sessionId?: string;
}

export type DeleteRadioStationData = ResultRestValue;

export interface DeleteRadioStationPayload {
  /** @format int64 */
  profileId: number;
  sessionId?: string;
}

/** @format binary */
export type DeleteStationData = File;

export type DeleteUserData = ResetPwResponse;

/**
 * Success or failure of operation.
 * @format binary
 */
export type DeleteUserFavoriteData = File;

export interface DeleteUserPayload {
  email?: string;
}

/** DeviceToken */
export interface DeviceToken {
  /** @format int32 */
  deviceType: number;
  /** @format int64 */
  profileId: number;
  uuid?: string;
}

/** DeviceTokenRestValue */
export type DeviceTokenRestValue = ResponseObject & {
  /** @format int32 */
  deviceType: number;
  /** @format int64 */
  profileId: number;
  uuid?: string;
};

/** DeviceTokenRestValueList */
export type DeviceTokenRestValueList = ResponseObject & {
  deviceTokens?: DeviceTokenRestValue[];
};

/** DocumentFieldMap */
export interface DocumentFieldMap {
  document?: DocumentFieldMapEntry[];
}

/** DocumentFieldMapEntry */
export interface DocumentFieldMapEntry {
  name?: string;
  value?: string;
}

/** EnrichmentTrackQueryResponse */
export type EnrichmentTrackQueryResponse = ResponseObject & {
  artists?: DocumentFieldMap[];
  parameters?: RequestParam[];
  /** @format int64 */
  totalArtists?: number;
  /** @format int64 */
  totalTracks?: number;
  tracks?: DocumentFieldMap[];
};

export type EnterCodeData = EnterCodeResponse;

export interface EnterCodePayload {
  code?: string;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
}

/** EnterCodeResponse */
export type EnterCodeResponse = ResponseObject & {
  success: boolean;
};

/** EpisodeResponse */
export type EpisodeResponse = BaseResponse & {
  accessString?: string;
  description?: string;
  /** @format int64 */
  endDate?: number;
  /** @format int32 */
  episodeDuration?: number;
  /** @format int64 */
  expirationDate?: number;
  externalUrl?: string;
  hosts?: string[];
  isExplicit?: boolean;
  /** @format int64 */
  originalAirDate?: number;
  /** @format int32 */
  showId?: number;
  showName?: string;
  showSlug?: string;
  /** @format int64 */
  startDate?: number;
  subTitle?: string;
  title?: string;
};

/** EpisodeRestValue */
export interface EpisodeRestValue {
  defaultEpisodeRestValue?: EpisodeRestValue;
  description?: string;
  /** @format int32 */
  duration?: number;
  /** @format int64 */
  endDate?: number;
  /** @format int32 */
  episodeId?: number;
  /** @format int64 */
  expirationDate?: number;
  externalUrl?: string;
  hosts?: string[];
  image?: string;
  isExplicit?: boolean;
  /** @format int64 */
  originalAirDate?: number;
  /** @format int32 */
  showId?: number;
  showName?: string;
  showSlug?: string;
  /** @format int64 */
  startDate?: number;
  subTitle?: string;
  title?: string;
}

/** ErrorEntry */
export interface ErrorEntry {
  /** @format int32 */
  code: number;
  debugInfo?: string;
  description?: string;
  /** @format int32 */
  httpCode: number;
}

/** EventParentRestValue */
export interface EventParentRestValue {
  /** @format int64 */
  date?: number;
  dateString?: string;
  events?: EventRestValue[];
  id?: string;
  radioType?: RadioType;
  /** @format int64 */
  seedId?: number;
  title?: string;
}

/** EventRestValue */
export interface EventRestValue {
  album?: string;
  /** @format int32 */
  albumId?: number;
  /** @format int32 */
  artistId?: number;
  artistName?: string;
  /** @format int64 */
  date?: number;
  dateString?: string;
  /** @format int32 */
  duration?: number;
  /** @format int32 */
  id?: number;
  imagePath?: string;
  /** @format int32 */
  lyricsId?: number;
  /** @format int32 */
  showId?: number;
  showName?: string;
  title?: string;
  version?: string;
}

/** the token response */
export type ExchangeSessionForTokenData = TokenResponse;

/** FacebookFriendsRestValue */
export interface FacebookFriendsRestValue {
  facebookId?: string;
  location?: string;
  name?: string;
  /** @format int64 */
  profileId: number;
  recentPlay?: TrackHistoryParentRestValue[];
  recentTalk?: EventParentRestValue;
}

/** FavoriteStationRestValue */
export interface FavoriteStationRestValue {
  artists?: StationArtist[];
  description?: string;
  deviceLink?: string;
  imagePath?: string;
  link?: string;
  name?: string;
  slug?: string;
}

/** Artist Albums */
export type FindAlbumsByArtistIdSearchData = FindArtistByIdResponse;

export interface FindAlbumsByArtistIdSearchParams {
  /**
   * artist identifier
   * @format int32
   */
  artistId: number;
  clientRequestId?: string;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /**
   * max number of records to return (default MAX_ROWS)
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * start index (zero based)
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** artist details */
export type FindArtistByIdData = FindArtistByIdResponse;

export interface FindArtistByIdParams {
  /**
   * artist identifier #required#
   * @format int32
   */
  artistId: number;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  /**
   * If the bio for each artist should be included
   * @default "true"
   */
  includeBio?: boolean;
}

/**
 * FindArtistByIdResponse
 * Response from findArtistById method of Catalog service.
 */
export type FindArtistByIdResponse = ResponseObject & {
  artist?: ArtistRestValue;
};

/** track details */
export type FindTrackByIdData = FindTrackByIdResponse;

export interface FindTrackByIdParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  /**
   * #required#
   * @format int32
   */
  trackId: number;
}

/**
 * FindTrackByIdResponse
 * Response from searching track by identifier.
 */
export type FindTrackByIdResponse = ResponseObject & {
  track?: TrackRestValue;
};

/**
 * FindTrackByIdResponseWithStreamUrl
 * Response from searching track by identifier.
 */
export type FindTrackByIdResponseWithStreamUrl = FindTrackByIdResponse & {
  streamUrl?: string;
};

/** track details */
export type FindTrackByIdWithStreamUrlData = FindTrackByIdResponseWithStreamUrl;

export interface FindTrackByIdWithStreamUrlParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  /**
   * #required#
   * @format int32
   */
  trackId: number;
}

/** artist's tracks */
export type FindTracksByArtistIdSearchData = FindArtistByIdResponse;

export interface FindTracksByArtistIdSearchParams {
  /**
   * artist identifier
   * @format int32
   */
  artistId: number;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /**
   * max number of records to return (default MAX_ROWS)
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * start index (zero based)
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** FormatRestValue */
export interface FormatRestValue {
  name?: string;
  quality?: QualityRestValue[];
}

/** Success message */
export type GenerateResetPasswordEmailData = ResetPwResponse;

/** genres */
export type GenreData = GenreResponse;

/**
 * GenreInfo
 * Full information about content.
 */
export interface GenreInfo {
  /** @format int32 */
  artistCategoryId?: number;
  id?: string;
  name?: string;
  /** @format int32 */
  sort?: number;
  /** @format int32 */
  trackBundleCategoryId?: number;
  /** @format int32 */
  trackCategoryId?: number;
}

export interface GenreParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
}

/**
 * GenreResponse
 * Response from searching content by identifier.
 */
export type GenreResponse = ResponseObject & {
  genre?: GenreInfo[];
};

/** GenreRestValueInput */
export interface GenreRestValueInput {
  /** the genreIds */
  genreIds?: number[];
}

/** @format binary */
export type GetAdsData = File;

/** one PRN show with details */
export type GetAllShowsData = GetPRNShowsResponse;

/** category artists */
export type GetArtistsFromCategoriesData = SearchResponse;

export interface GetArtistsFromCategoriesParams {
  /** ?categoryId=1&categoryId=2&...#required# */
  categoryId?: number[];
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  /**
   * If the bio for each artist should be included
   * @default "true"
   */
  includeBio?: boolean;
  /**
   * max number of records to return (default MAX_ROWS)
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * start index (zero based)
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** an object representing the results of the operation */
export type GetCategoriesData = GetTalkCategoriesResponse;

export interface GetCategoriesParams {
  /**
   * - Deprecated: Defaults to false.
   * @default "false"
   */
  includeShows?: boolean;
  /**
   * - sort shows by NAME or POPULARITY. Defaults to NAME.
   * @default "NAME"
   */
  showSortKey?: 'NAME' | 'POPULARITY';
}

/** an object representing the results of the operation */
export type GetCategoryData = GetTalkCategoriesResponse;

export interface GetCategoryParams {
  /** - List of category ids #required# */
  categoryId?: number[];
  /**
   * - Include shows in response? Defaults to true if not passed by clients.
   * @default "true"
   */
  includeShows?: boolean;
  /**
   * - sort shows by NAME or POPULARITY. Defaults to NAME.
   * @default "NAME"
   */
  showSortKey?: 'NAME' | 'POPULARITY';
}

/** @format binary */
export type GetCitiesData = File;

export interface GetCitiesParams {
  /** If this is passed, it will return all cities within that country. */
  countryCode?: string;
}

export type GetClientConfigData = ClientConfigResponse;

export interface GetClientConfigParams {
  /** #required# */
  clientVersion?: string;
  /** #required# */
  deviceName?: string;
}

export type GetCodeData = GetCodeResponse;

export type GetCodeForXboxData = GetCodeResponse;

export interface GetCodeParams {
  /** key associated with that sepecific device */
  deviceType?: string;
  /** User id from 3rd party system */
  externalUuid?: string;
}

/** GetCodeResponse */
export type GetCodeResponse = ResponseObject & {
  code?: string;
};

/** @format binary */
export type GetContentData = File;

export interface GetContentPayload {
  /** use sweepers to have sweepers be returned if a user qualifies for a sweeper. */
  campaignId?: string;
  /** limit what comes back in the response. */
  fields?: string;
  /** @format double */
  lat: number;
  /**
   * @format int32
   * @default "3"
   */
  limit?: number;
  /** @format double */
  lng: number;
  /**
   * id of a piece of content that you want to play. If this is used, only 1 piece of content will come back regardless of what is in limit.
   * @format int32
   */
  onDemand?: number;
  /**
   * where the station was played from
   * @format int32
   */
  playedFrom?: number;
}

/** @format binary */
export type GetCountriesData = File;

export type GetCustStationRecsByArtists2Data = SuccessResponseV2;

export interface GetCustStationRecsByArtists2Params {
  /**
   * Milliseconds to sleep for
   * @format int32
   * @default "100"
   */
  delayMillis?: number;
  /**
   * Status code to return
   * @format int32
   * @default "200"
   */
  statusCode?: number;
}

/** List of custom stations recommended for input artists. */
export type GetCustStationRecsByArtistsData = RecCustArtistStationsRestValue;

export interface GetCustStationRecsByArtistsParams {
  /**
   * Maximum number of live stations to return.  Optional.
   * @format int32
   * @default "10"
   */
  amount?: number;
  /** #list#  One or more artist IDs used to determine suitable live stations.  Required */
  artistId?: number[];
  /**
   * offset from start of list.  Default: 0
   * @format int32
   * @default "0"
   */
  offset?: number;
}

/** custom stations suitable for given user. */
export type GetCustStationRecsByProfileData = RecCustArtistStationsRestValue;

export interface GetCustStationRecsByProfileParams {
  /**
   * (optional) maximum number of custom stations to return.
   * @format int32
   * @default "10"
   */
  amount?: number;
  /**
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * profile ID of owner
   * @format int64
   */
  ownerProfileId: number;
  /**
   * profile ID of user
   * @format int64
   */
  profileId: number;
  /** session Id */
  sessionId?: string;
}

/** User's Device Token Configuration */
export type GetDeviceTokenConfigData = DeviceTokenRestValueList;

export interface GetDeviceTokenConfigParams {
  /**
   * - Logged in users's profile id. #required#
   * @format int64
   */
  profileId: number;
  /** - Logged in users session id. #required# */
  sessionId?: string;
}

export type GetDeviceTokensData = AllDeviceTokensResponse;

export interface GetDeviceTokensParams {
  /** @format int64 */
  ownerProfileId: number;
}

/** a list of PRN episode details */
export type GetEpisodeByGroupData = GetPRNEpisodesResponse;

export interface GetEpisodeByGroupParams {
  /**
   * Required default 12
   * @format int32
   * @default "12"
   */
  amount?: number;
  /** mm/dd/yyyy Optional */
  endDate?: string;
  /**
   * Boolean. Return the number of episode views as part of the
   * results. Defaults to false. Optional
   * @default "False"
   */
  getViewCounts?: boolean;
  /**
   * Required
   * @format int32
   */
  groupid?: number;
  /**
   * Required default 0
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** mm/dd/yyyy Optional */
  startDate?: string;
}

/** a PRN Episode */
export type GetEpisodeByIdData = GetPRNEpisodeResponse;

export interface GetEpisodeByIdParams {
  /**
   * Required
   * @format int32
   */
  episodeId: number;
  /**
   * Boolean. Return the number of episode views as part of the
   * results. Defaults to false. Optional
   * @default "False"
   */
  getViewCounts?: boolean;
}

/** number of episodes in the given group. */
export type GetEpisodeCountByGroupData = PRNEpisodeGroupCountResponse;

/** episode details */
export type GetEpisodeData = GetEpisodeResponse;

export interface GetEpisodeParams {
  /**
   * ?episodeId=1... #required#
   * @format int32
   */
  episodeId?: number;
}

/** a PRN Episode */
export type GetEpisodePlayCountData = GetPRNEpisodePlayCountResponse;

/** GetEpisodeResponse */
export type GetEpisodeResponse = ResponseObject & {
  defaultSingletonInstance?: GetEpisodeResponse;
  episodeRest?: EpisodeRestValue;
  notFoundSingletonInstance?: GetEpisodeResponse;
};

/** GetEpisodeResponseWithStreamUrl */
export type GetEpisodeResponseWithStreamUrl = ResponseObject & {
  defaultSingletonInstance?: GetEpisodeResponseWithStreamUrl;
  episodeRest?: EpisodeRestValue;
  notFoundSingletonInstance?: GetEpisodeResponseWithStreamUrl;
  streamUrl?: string;
};

/** Returns episode details with stream url */
export type GetEpisodeWithStreamUrlData = GetEpisodeResponseWithStreamUrl;

export interface GetEpisodeWithStreamUrlParams {
  /**
   * Id of the episode to retrieve #required#
   * @format int32
   */
  episodeId?: number;
}

export type GetFavoritesStationByIdData =
  GetStationsResponseOfFavoriteStationRestValue;

export interface GetFavoritesStationByIdParams {
  /** @format int64 */
  id: number;
}

/**
 * genre data or 404 if doesn't exist.
 * @format binary
 */
export type GetGenreData = File;

export interface GetGenreParams {
  /** Optional list of fields to return.  Legal elements: 'name', 'logo' */
  fields?: string;
  /** @format int32 */
  id: number;
}

/**
 * genres
 * @format binary
 */
export type GetGenresData = File;

export interface GetGenresParams {
  /** Optional list of fields to return.  Legal elements: 'name', 'logo' */
  fields?: string;
  /**
   * returns all genres if unspecified.
   * @format int32
   */
  limit?: number;
  /**
   * 0 if unspecified.
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * show invisible genres.  Default is false.
   * @default "false"
   */
  showHidden?: boolean;
  /**
   * Optional, can be 'sort' or 'name'.  Default is 'sort'.
   * @default "sort"
   */
  sortBy?: string;
}

export type GetHistoryEventsData = GetHistoryEventsResponse;

export interface GetHistoryEventsParams {
  campaignId?: string;
  /**
   * @format int32
   * @default "10"
   */
  numResults?: number;
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  /**
   * @format int64
   * @default "0"
   */
  startTime?: number;
  types?: string[];
}

/** GetHistoryEventsResponse */
export type GetHistoryEventsResponse = ResponseObject & {
  events?: EventParentRestValue[];
  /** @format int64 */
  firstEventTime: number;
  /** @format int64 */
  lastEventTime: number;
};

export type GetHistoryWithLiveEventsData = GetHistoryEventsResponse;

export interface GetHistoryWithLiveEventsParams {
  /**
   * @format int32
   * @default "10"
   */
  numResults?: number;
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  /**
   * @format int64
   * @default "0"
   */
  startTime?: number;
  types?: string[];
}

export type GetLiveRadioAdConfigData = LiveRadioAdConfigResponse;

export interface GetLiveRadioAdConfigParams {
  hostName?: string;
}

export type GetLiveRadioStationsData = LiveRadioStationRestValueList;

export interface GetLiveRadioStationsParams {
  /**
   * @format int64
   * @default "0"
   */
  lastModifiedDate?: number;
  /**
   * default is 200
   * @format int32
   */
  limit?: number;
  /**
   * default is 0
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** - NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE */
  orderBy?: 'LAST_PLAYED' | 'NAME' | 'PLAYCOUNT' | 'REGISTERED_DATE';
  /**
   * #required#
   * @format int64
   */
  ownerProfileId: number;
  /**
   * #required#
   * @format int64
   */
  profileId?: number;
  sessionId?: string;
}

export type GetLiveStationByIdData = ResponseObjectContainerOfLiveResponse;

export interface GetLiveStationByIdParams {
  /**
   * If false, it will only return the primary market. If true, it will return all the markets with the live station.
   * @default "false"
   */
  allMarkets?: boolean;
  /** To search across multiple ids, please use a comma separate list. IE: 1,2,3,4 */
  id: string;
}

/** @format binary */
export type GetLiveStationGenresData = File;

export interface GetLiveStationGenresParams {
  /** Name of the city to search for */
  city?: string;
  /**
   * City ID is the same as Market ID
   * @format int32
   */
  cityId: number;
  /** Country Code to search for. US, AU, etc */
  countryCode?: string;
  /**
   * Country ID to search for
   * @format int32
   */
  countryId: number;
  /**
   * Lat/Lng will search for a market with the specific radius
   * @format double
   */
  lat?: number;
  /**
   * Lat/Lng will search for a market with the specific radius
   * @format double
   */
  lng?: number;
  /** State abbreviation to search for. FL, AL, MT, etc */
  stateAbbr?: string;
  /**
   * State ID to search for
   * @format int32
   */
  stateId: number;
  /** Will find your Lat/Lng based on this IP and get the market within a specific radius */
  useIP: boolean;
  /** Zipcode to search for */
  zipCode?: string;
}

/** List of live stations recommended for input artists. */
export type GetLiveStationRecsByArtistsData = RecLiveArtistStationsRestValue;

export interface GetLiveStationRecsByArtistsParams {
  /**
   * Maximum number of live stations to return.  Optional, defaults to 10.
   * @format int32
   * @default "10"
   */
  amount?: number;
  /**
   * #list#
   * One or more artist IDs used to determine suitable live stations.  Required
   */
  artistId?: number[];
  /**
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * sort algorithm (AVERAGE | HARMONIC | GEOMETRIC)
   * Optional, defaults to AVERAGE
   * @default "AVERAGE"
   */
  sort?: 'AVERAGE' | 'GEOMETRIC' | 'HARMONIC';
  /**
   * source metric to sort by (CUME | PLAY_COUNT | SCORE_COMBINED), defaults to PLAY_COUNT
   * @default "PLAY_COUNT"
   */
  source?: 'CUME' | 'PLAY_COUNT' | 'SCORE_COMBINED';
}

/** live stations suitable for given user. */
export type GetLiveStationRecsByProfileData = RecLiveArtistStationsRestValue;

export interface GetLiveStationRecsByProfileParams {
  /**
   * (optional) maximum number of live stations to return.
   * @format int32
   * @default "10"
   */
  amount?: number;
  /**
   * offset from start of list.  Default: 0
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * profile ID of owner
   * @format int64
   */
  ownerProfileId: number;
  /**
   * profile ID of user
   * @format int64
   */
  profileId: number;
  /** session Id */
  sessionId?: string;
  /**
   * (optional) algorithm that determines best station.  May be (AVERAGE | HARMONIC | GEOMETRIC)
   * @default "AVERAGE"
   */
  sort?: 'AVERAGE' | 'GEOMETRIC' | 'HARMONIC';
}

export type GetLiveStationRecsData = RecLiveStationRestValue;

export interface GetLiveStationRecsParams {
  /**
   * #required#
   * @format int32
   */
  liveRadioStationId?: number;
}

export type GetLiveStationsData = ResponseObjectContainerOfLiveResponse;

export interface GetLiveStationsParams {
  /**
   * If false, it will only return the primary market. If true, it will return all the markets with the live station.
   * @default "false"
   */
  allMarkets?: boolean;
  /** market to apply boost */
  boostMarketId?: string;
  /** The Live Stations call letters */
  callLetters?: string;
  changedSince?: string;
  /** City of the markets for the station */
  city?: string;
  /** The countryCode of the station */
  countryCode?: string;
  /**
   * Country ID for the markets for the station
   * @format int32
   * @default "0"
   */
  countryId?: number;
  fccFacilityId?: string;
  /** List of fields to be returned. */
  fields?: string;
  /** @default "false" */
  forceNewImpl?: boolean;
  /**
   * Genre Id of the live stations to search on.
   * @format int32
   * @default "0"
   */
  genreId?: number;
  /** To search across multiple ids, please use a comma separate list. IE: 1,2,3,4 */
  id?: string;
  /**
   * lat of the markets associated with the station.
   * @format double
   */
  lat?: number;
  /**
   * limit of results to come back from each type requests.
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * lng of the markets associated with the station.
   * @format double
   */
  lng?: number;
  /** id of the market */
  marketId?: string;
  /**
   * offset value
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** the primary market */
  primaryMarket?: string;
  /**
   * Query to search on
   * @default ""
   */
  q?: string;
  rdsPiCode?: string;
  returnNonActive?: string;
  /** Which value to sort on. use the prefix + on the field to change order of the sort. */
  sort?: string;
  /** State of the markets for the station */
  stateAbbr?: string;
  /**
   * State ID for the markets for the station
   * @format int32
   * @default "0"
   */
  stateId?: number;
  /** comma separated list of stream types */
  streamType?: string;
  /** @default "false" */
  useIP?: boolean;
  /** zipCode of the markets for the station */
  zipCode?: string;
}

/** @format binary */
export type GetMarketsByIdData = File;

/** @format binary */
export type GetMarketsData = File;

export interface GetMarketsParams {
  city?: string;
  /** @format int32 */
  cityId: number;
  countryCode?: string;
  /** @format int32 */
  countryId: number;
  /** @format double */
  lat?: number;
  /**
   * @format int32
   * @default "10"
   */
  limit?: number;
  /** @format double */
  lng?: number;
  /**
   * @format int32
   * @default "0"
   */
  offset?: number;
  sortBy?: string;
  stateAbbr?: string;
  /** @format int32 */
  stateId: number;
  /** @default "false" */
  useIP?: boolean;
  zipCode?: string;
}

export type GetMerchedTalkShowsData = GetShowsResponse;

export interface GetMerchedTalkShowsParams {
  /**
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * @format int32
   * @default "0"
   */
  offset?: number;
}

/**
 * Two lists (before, after) of PRN Episodes near (in time) to the
 * source episode.
 */
export type GetNearEpisodesData = GetPRNNearEpisodesResponse;

export interface GetNearEpisodesParams {
  /**
   * Total number of rows to return before and after. Total number
   * is maximum of amount * 2. #optional* default 1
   * @format int32
   * @default "1"
   */
  amount?: number;
  /** @format int32 */
  episodeId: number;
  /**
   * Boolean. Return the number of episode views as part of the
   * results. Defaults to false. Optional
   * @default "False"
   */
  getViewCounts?: boolean;
}

/** a JSON array of this user's talk stations. */
export type GetNextEpisodesData = TalkStationRestValueList;

export interface GetNextEpisodesParams {
  /**
   * @format int32
   * @default "3"
   */
  episodesRequested?: number;
  /**
   * #required#
   * @format int64
   */
  ownerProfileId: number;
  /**
   * -Select if we should return an epiosde by the seed id first.
   * @default "false"
   */
  seedFirst?: boolean;
  /** #required# */
  sessionId?: string;
  /** -Select an episode to play first. */
  startEpisodeId?: string;
  /** - Override the default talk station name. */
  talkStationId: string;
}

export type GetOauthDetailsByUuidData = ValidateOauthResponse;

export interface GetOauthDetailsByUuidPayload {
  accessTokenType?: string;
  userName?: string;
}

/** GetPRNEpisodePlayCountResponse */
export type GetPRNEpisodePlayCountResponse = ResponseObject & {
  /** @format int32 */
  playCount: number;
};

/** GetPRNEpisodeResponse */
export type GetPRNEpisodeResponse = ResponseObject & {
  episode?: PRNEpisodeRestValue;
};

/** GetPRNEpisodesResponse */
export type GetPRNEpisodesResponse = ResponseObject & {
  /** @format int64 */
  episodeCount: number;
  episodes?: PRNEpisodeRestValue[];
};

/** GetPRNNearEpisodesResponse */
export type GetPRNNearEpisodesResponse = ResponseObject & {
  afterEpisodes?: PRNEpisodeRestValue[];
  beforeEpisodes?: PRNEpisodeRestValue[];
};

/** GetPRNShowResponse */
export type GetPRNShowResponse = ResponseObject & {
  prnshowRestValue?: PRNShowRestValue;
};

/** GetPRNShowsResponse */
export type GetPRNShowsResponse = ResponseObject & {
  shows?: PRNShowRestValue[];
};

/**
 * HTTP response code
 * @format binary
 */
export type GetPrivacyDeleteData = File;

/**
 * HTTP response code
 * @format binary
 */
export type GetPrivacyRequestData = File;

/** User's Profile */
export type GetPublicProfileData = UserProfileRestValue;

export interface GetPublicProfileParams {
  /**
   * - Logged in users's profileId.
   * @format int64
   */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  /** - Logged in users sessionId. */
  sessionId?: string;
  /** @default "true" */
  usePeriodDelimiterInPrefKeys?: boolean;
}

/** @format binary */
export type GetRadioSessionData = File;

export interface GetRadioSessionParams {
  /**
   * @format int32
   * @default "1"
   */
  numTracks?: number;
  /** @format int64 */
  profileId?: number;
  radioStationId?: string;
}

export type GetRadioStationsData = RadioStationRestValueList;

export interface GetRadioStationsParams {
  /**
   * default is 200
   * @format int32
   */
  limit?: number;
  /**
   * default is 0
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** - NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE */
  orderBy?:
    | 'LAST_MODIFIED_DATE'
    | 'LAST_PLAYED'
    | 'NAME'
    | 'PLAYCOUNT'
    | 'REGISTERED_DATE'
    | 'TYPE';
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
}

export type GetRecommendationsForGenresData = UnifiedRecommendationsRestValue;

export interface GetRecommendationsForGenresParams {
  fields?: string;
  /** genre ids */
  genreId?: string[];
  /**
   * the latitude of the client
   * @format double
   */
  lat?: number;
  /**
   * total number to return. (Required)
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * the longitude of the client
   * @format double
   */
  lng?: number;
  /**
   * offset from start of list (0 is first)
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * LRRM - Live Radio in Recommended Market
   * CR - Artist Station
   * DL - content
   */
  template?: string;
  /** the zipcode of the client */
  zipCode?: string;
}

/**
 * show details including episodes. Episodes are grouped into 'all', 'full', and 'clips'. Each group is
 * sorted by start date, latest first.
 */
export type GetShow2Data = GetShowResponse;

export interface GetShow2Params {
  /**
   * max number of episodes to return (default MAX_ROWS) #optional#
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * ?showId=1 #required#
   * @format int32
   */
  showId?: number;
  /**
   * start index (zero based) of associated episodes (default 0) #optional#
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** show details */
export type GetShowBySlugData = GetShowResponse;

export interface GetShowBySlugParams {
  /**
   * max number of episodes to return (default MAX_ROWS) #optional#
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /** ?slug=1... #required# */
  slug?: string;
  /**
   * start index (zero based) of associated episodes (default 0) #optional#
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** one PRN show with details */
export type GetShowData = GetPRNShowResponse;

export interface GetShowParams {
  /**
   * Required
   * @format int32
   */
  showId?: number;
  /**
   * Optional - Defaults to false. If enabled, the latest episode
   * from each episode group is populated in the epiosodeGroups
   * node.
   * @default "false"
   */
  withVoD?: boolean;
}

/** GetShowResponse */
export type GetShowResponse = ResponseObject & {
  notFoundSingletonInstance?: GetShowResponse;
  singletonInstance?: GetShowResponse;
};

/** GetShowsResponse */
export type GetShowsResponse = ResponseObject & {
  defaultSingletonInstance?: GetShowsResponse;
  shows?: ShowRestValue[];
};

export type GetSimilarArtistsByFormatData = GetSimilarArtistsByFormatResponse;

export interface GetSimilarArtistsByFormatParams {
  /**
   * Number of artists to return.  Optional.
   * @format int32
   * @default "10"
   */
  amount?: number;
  /** #list# List of artist IDs of which to return similar artists by format. Required. */
  artistIds?: number[];
}

/** GetSimilarArtistsByFormatResponse */
export type GetSimilarArtistsByFormatResponse = ResponseObject & {
  artists?: number[];
};

export type GetSimilarArtistsData = RelatedArtistsResponse;

export interface GetSimilarArtistsParams {
  /** @format int32 */
  artistId: number;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
}

export type GetSkipsRemainingData = ReportStreamDoneResponse;

export interface GetSkipsRemainingParams {
  /** @format int64 */
  profileId: number;
  /** @default "" */
  radioStationId?: string;
  sessionId?: string;
}

/** track details */
export type GetSliderData = GetSliderResponse;

export interface GetSliderParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
}

/** GetSliderResponse */
export type GetSliderResponse = ResponseObject & {
  sliderItems?: SliderItemTO[];
};

/** @format binary */
export type GetStatesData = File;

export interface GetStatesParams {
  /** If this is passed, it will return all cities within that country. */
  countryCode?: string;
}

/** GetStationByIdResponse */
export type GetStationByIdResponse = ResponseObject & {
  defaultSingletonInstance?: GetStationByIdResponse;
  notFoundSingletonInstance?: GetStationByIdResponse;
};

/** @format binary */
export type GetStationBySeedIdData = File;

export type GetStationsByIdData =
  ResponseObjectContainerOfPlaylistStationResponse;

export interface GetStationsByIdParams {
  /** use this to limit the response fields */
  fields?: string;
  /**
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** @format int64 */
  profileId: number;
  /**
   * NAME
   * @default "NAME"
   */
  sortBy?:
    | 'LAST_MODIFIED_DATE'
    | 'LAST_PLAYED'
    | 'NAME'
    | 'PLAYCOUNT'
    | 'REGISTERED_DATE'
    | 'TYPE';
  /** id of the station */
  stationId: string;
  /**
   * stationTypes options: TRACK,ARTIST,FEATUREDSTATION,TALKSHOW,TALKTHEME,LIVE,RADIO,TALK,FAVORITES
   * @default ""
   */
  type: string;
}

export type GetStationsData = ResponseObjectContainerOfPlaylistStationResponse;

export interface GetStationsParams {
  /** @default "" */
  campaignId?: string;
  /** fields you want returned. not yet implemented. */
  fields?: string;
  /** @default "false" */
  includePersonalized?: boolean;
  /**
   * limit
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * offset
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** @format int64 */
  profileId: number;
  /**
   * NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE, LAST_MODIFIED_DATE,TYPE
   * @default "NAME"
   */
  sortBy?:
    | 'LAST_MODIFIED_DATE'
    | 'LAST_PLAYED'
    | 'NAME'
    | 'PLAYCOUNT'
    | 'REGISTERED_DATE'
    | 'TYPE';
  /**
   * options: TRACK,ARTIST,FEATUREDSTATION,COLLECTION,TALKSHOW,TALKTHEME,LIVE,RADIO,TALK,FAVORITES.<br><br>
   * RADIO is a parent of TRACK,ARTIST,FEATUREDSTATION,FAVORITES<br><br>
   * TALK is a parent of TALKSHOW and TALKTHEME<br><br>
   * There is never a need to request RADIO and TRACK. Doing so will only return TRACKS since you are asking for a subset of radio.<br>
   * Same for TALK and TALKSHOW. <br><br>
   * @default ""
   */
  stationTypes?: string;
}

/** GetStationsResponseOfFavoriteStationRestValue */
export type GetStationsResponseOfFavoriteStationRestValue = ResponseObject & {
  stations?: FavoriteStationRestValue[];
};

export type GetStatusData = GetStatusResponse;

export type GetStatusForXboxData = GetStatusResponse;

export interface GetStatusForXboxPayload {
  code?: string;
}

export interface GetStatusParams {
  code?: string;
  externalUuid?: string;
}

/** GetStatusResponse */
export type GetStatusResponse = ResponseObject & {
  /** @format int64 */
  profileId: number;
  status?: boolean;
};

export type GetStreamUrl2Data = StreamUrlResponse;

export interface GetStreamUrl2Params {
  'X-Session-Id'?: string;
  /** @format int64 */
  'X-User-Id': number;
  playerKey?: string;
}

/** A response containing the URL for the content stream and the next player key */
export type GetStreamUrlData = StreamUrlResponse;

export interface GetStreamUrlPayload {
  /**
   * [optional] - this is legacy. defaults to false.
   * @default "false"
   */
  cached?: boolean;
  /** - contentId can be trackId for custom radio or it can be episodeId for talk radio. #required# */
  contentId?: string;
  /** content type code #required# */
  contentType?: string;
  /** host name #required# */
  host?: string;
  /**
   * The latitude of the user
   * @format double
   */
  lat: number;
  /**
   * The longitude of the user
   * @format double
   */
  lon: number;
  /**
   * - this is the ID of the context it was played in, either a Live Station, Custom Station, etc
   * @default ""
   */
  parentId?: string;
  /**
   * - playedFrom decides what the parent station type is. <br/>
   * Following are the valid playedFrom ranges: <li>100 to 199 = Custom Radio</li> <li>400 to 499 = Custom
   * Radio Anonymous</li> <li>500 to 599 = Talk Radio</li>
   *
   * #required#
   * @format int32
   */
  playedFrom?: number;
  playerKey?: string;
  /**
   * Logged in users profile Id. #required#
   * @format int64
   */
  profileId: number;
  /**
   * #required#
   * @default "true"
   */
  returnUserInfo?: boolean;
  /** session id #required# */
  sessionId?: string;
  /** @default "true" */
  userClicked?: boolean;
}

export type GetStreamsData = StreamsResponse;

export type GetStreamsPayload = string;

/** @format binary */
export type GetSuppressedArtistsData = File;

/** @format binary */
export type GetSuppressedStationsData = File;

/** GetTalkCategoriesResponse */
export type GetTalkCategoriesResponse = ResponseObject & {
  categories?: TalkCategoryRestValue[];
};

/** an object representing the results of the operation */
export type GetTalkStationByIdData = GetStationByIdResponse;

export interface GetTalkStationByIdParams {
  /**
   * - Include shows in response? Defaults to false if not passed by clients.
   * @default "false"
   */
  includeShows?: boolean;
  /**
   * Required.
   * @format int64
   */
  ownerProfileId: number;
  /**
   * Required.
   * @format int64
   */
  profileId: number;
  /** Required. */
  sessionId?: string;
  /** Required. */
  talkStationId?: string;
}

/** an object representing the results of the operation */
export type GetTalkStationsData = TalkStationRestValueList;

export interface GetTalkStationsParams {
  /**
   * - Include shows in response? Defaults to false if not passed by clients. - True, False; This will
   * include all added and removed complete shows in response
   * @default "false"
   */
  includeShows?: boolean;
  /**
   * default is 200
   * @format int32
   */
  limit?: number;
  /**
   * default is 0
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** - NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE required */
  orderBy?: 'LAST_PLAYED' | 'NAME' | 'PLAYCOUNT' | 'REGISTERED_DATE';
  /**
   * required
   * @format int64
   */
  ownerProfileId: number;
  /**
   * required
   * @format int64
   */
  profileId: number;
  /** required */
  sessionId?: string;
}

/** an object representing the results of the operation */
export type GetTalkThemeBySlugData = GetTalkThemesResponse;

export interface GetTalkThemeBySlugParams {
  /** @default "true" */
  includeShows?: boolean;
  /** #required# */
  slug?: string;
}

/** GetTalkThemesResponse */
export type GetTalkThemesResponse = ResponseObject & {
  defaultSingletonInstance?: GetTalkThemesResponse;
  notFoundSingletonInstance?: GetTalkThemesResponse;
  themes?: TalkThemeRestValue[];
};

/**
 * users taste profile
 * @format binary
 */
export type GetTasteProfileData = File;

export interface GetTasteProfileParams {
  /**
   * list of fields to retrieve, no value interpreted as all fields requested.  Possible values:
   * profileId
   * fbLiveStationLikes
   * fbArtistLikes
   * suppressedArtists
   * stationThumbs
   * genreIds
   * @default ""
   */
  fields?: string;
  /**
   * profile of account data to be retrieved from
   * @format int64
   */
  ownerProfileId: number;
}

/** an object representing the results of the operation */
export type GetThemeData = GetTalkThemesResponse;

export interface GetThemeParams {
  /**
   * - Include shows in response? Defaults to true if not passed by clients.
   * @default "true"
   */
  includeShows?: boolean;
  /** - List of Theme ids #required# */
  themeId?: number[];
}

/** an object representing the results of the operation */
export type GetThemesData = GetTalkThemesResponse;

export interface GetThemesParams {
  /**
   * - Deprecated: Defaults to false.
   * @default "false"
   */
  includeShows?: boolean;
}

/**
 * List of ThumbResponse
 * @format binary
 */
export type GetThumbsByTypeAndStationData = File;

export interface GetThumbsByTypeAndStationParams {
  /** what fields to return */
  fields?: string;
  /**
   * how many to return
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * the offset of the list
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * id of the profile to search on
   * @format int64
   */
  profileId: number;
  /** RADIOSTATION,STATION_TYPE,LAST_MODIFIED_DATE */
  sortBy?: 'ID' | 'LAST_MODIFIED_DATE' | 'RADIOSTATION' | 'STATION_TYPE';
  /** id of the station to get the thumbs for */
  stationId: string;
  /** RADIO, TALK or LIVE */
  type:
    | 'ARTIST'
    | 'CLIP'
    | 'COLLECTION'
    | 'FAVORITES'
    | 'LIVE'
    | 'N4U'
    | 'PODCAST'
    | 'RADIO'
    | 'TALK'
    | 'TALKSHOW'
    | 'TALKTHEME'
    | 'TRACK';
}

/** @format binary */
export type GetThumbsByTypeData = File;

export interface GetThumbsByTypeParams {
  /** what fields to return */
  fields?: string;
  /**
   * how many to return
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * the offset of the list
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** @format int64 */
  profileId: number;
  /** RADIOSTATION,STATION_TYPE,LAST_MODIFIED_DATE */
  sortBy?: 'ID' | 'LAST_MODIFIED_DATE' | 'RADIOSTATION' | 'STATION_TYPE';
  /** RADIO, TALK or LIVE */
  type:
    | 'ARTIST'
    | 'CLIP'
    | 'COLLECTION'
    | 'FAVORITES'
    | 'LIVE'
    | 'N4U'
    | 'PODCAST'
    | 'RADIO'
    | 'TALK'
    | 'TALKSHOW'
    | 'TALKTHEME'
    | 'TRACK';
}

/** @format binary */
export type GetThumbsData = File;

export type GetThumbsDown2Data = RadioStationRestValueList;

export interface GetThumbsDown2Params {
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
}

export type GetThumbsDown3Data = TalkStationRestValueList;

export interface GetThumbsDown3Params {
  /**
   * #required#
   * @format int64
   */
  ownerProfileId: number;
  /** #required# */
  sessionId?: string;
  /**
   * #required#
   * @format int64
   */
  userProfileId: number;
}

export type GetThumbsDownData = LiveRadioStationRestValueList;

export interface GetThumbsDownParams {
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
}

export interface GetThumbsParams {
  /** what fields to return */
  fields?: string;
  /**
   * how many to return
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * the offset of the list
   * @format int32
   * @default "0"
   */
  offset?: number;
  /** @format int64 */
  profileId: number;
  /** RADIOSTATION,STATION_TYPE,LAST_MODIFIED_DATE */
  sortBy?: 'ID' | 'LAST_MODIFIED_DATE' | 'RADIOSTATION' | 'STATION_TYPE';
}

export type GetThumbsUp2Data = RadioStationRestValueList;

export interface GetThumbsUp2Params {
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
}

export type GetThumbsUp3Data = TalkStationRestValueList;

export interface GetThumbsUp3Params {
  /**
   * #required#
   * @format int64
   */
  ownerProfileId: number;
  /** #required# */
  sessionId?: string;
  /**
   * #required#
   * @format int64
   */
  userProfileId: number;
}

export type GetThumbsUpData = LiveRadioStationRestValueList;

export interface GetThumbsUpParams {
  /** @format int64 */
  ownerProfileId: number;
  /**
   * #required#
   * @format int64
   */
  profileId: number;
  /** #required# */
  sessionId?: string;
}

/** GetTopArtistResponse */
export type GetTopArtistResponse = ResponseObject & {
  artists?: RecArtistRestValue[];
};

export type GetTopArtistsData = GetTopArtistResponse;

export interface GetTopArtistsParams {
  /**
   * The number of artists to return per format.
   * Optional, default is 10
   * @format int32
   * @default "10"
   */
  formatSize?: number;
  /**
   * the worst rank to return.
   * Optional, default is 1
   * @format int32
   * @default "1"
   */
  rankEnd?: number;
  /**
   * the best ranked to return.  1 is the best top rank.
   * Optional, default is 1
   * @format int32
   * @default "1"
   */
  rankStart?: number;
}

/** trackbundle details */
export type GetTrackBundlesData = SearchResponse;

/** category trackbundles */
export type GetTrackBundlesFromCategoriesData = SearchResponse;

export interface GetTrackBundlesFromCategoriesParams {
  /** ?categoryId=1&categoryId=2&... #required# */
  categoryId?: number[];
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /**
   * max number of records to return (default MAX_ROWS)
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * start index (zero based)
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

export interface GetTrackBundlesParams {
  /** ?categoryId=1&categoryId=2&... #required# */
  albumId?: number[];
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /**
   * max number of records to return (default MAX_ROWS)
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

export type GetTrackHistoryEventsData = TrackHistoryRestValue;

export interface GetTrackHistoryEventsParams {
  campaignId?: string;
  /**
   * @format int32
   * @default "10"
   */
  numResults?: number;
  /** @format int64 */
  ownerProfileId: number;
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  /**
   * @format int64
   * @default "0"
   */
  startTime?: number;
}

export type GetTracksData = RadioStationRestValueList;

/** category tracks */
export type GetTracksFromCategoriesData = SearchResponse;

export interface GetTracksFromCategoriesParams {
  /** ?categoryId=1&categoryId=2&... #required# */
  categoryId?: number[];
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /**
   * max number of records to return (default MAX_ROWS)
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * start index (zero based)
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

export interface GetTracksParams {
  /**
   * This will allow the user to listen to a track on the specified album ID if the station is on its first play
   * @format int32
   */
  albumToPlay?: number;
  /**
   * #required#
   * @format int64
   */
  ownerProfileId: number;
  /**
   * - playedFrom decides what the parent station type is. <br/>
   * Following are the valid playedFrom ranges: <li>100 to 199 = Custom Radio</li> <li>400 to 499 = Custom
   * Radio Anonymous</li> <li>500 to 599 = Talk Radio</li>
   * @format int32
   */
  playedFrom?: number;
  /**
   * #required#
   * @format int64
   */
  profileId: number;
  /** #required# */
  radioStationId: string;
  /**
   * - # of tracks you want per request to this API. Optional,
   * defaults to 5 and capped at 10. #required#
   * @format int32
   * @default "5"
   */
  reqTracks?: number;
  /** #required# */
  sessionId?: string;
  /**
   * #required#
   * @format int32
   */
  variety?: number;
}

/**
 * the ordered list of favorites for the given user.
 * @format binary
 */
export type GetUserFavoritesData = File;

export interface GetUserFavoritesParams {
  campaignId?: string;
  /**
   * if greater than 0, endpoint will attempt to fill any missing favorites from recommendations.
   * @format int32
   * @default "0"
   */
  hardFill?: number;
  /**
   * number of items to return
   * @format int32
   */
  limit: number;
  /**
   * offset of favorites to return from beginning (0 based)
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * id of profile owner
   * @format int64
   */
  profileId: number;
}

export type GetUserProfileByIdData = UserProfileResponse;

export interface GetUserProfileByIdParams {
  /** @format int64 */
  ownerProfileId: number;
}

/** User's Profile */
export type GetUserProfileData = UserProfileRestValue;

export interface GetUserProfileParams {
  /**
   * if true will return any favorites, false returns none.
   * @default "false"
   */
  includeFavorites?: boolean;
  /** @default "false" */
  includeFriends?: boolean;
  /** @default "false" */
  includeFriendsPlays?: boolean;
  /** @default "false" */
  includePreferences?: boolean;
  /** @default "false" */
  includeSubscriptions?: boolean;
  /** @format int64 */
  ownerProfileId: number;
  /**
   * - Logged in users's profileId. #required#
   * @format int64
   */
  profileId: number;
  /** - Logged in users sessionId. #required# */
  sessionId?: string;
  /** @default "true" */
  usePeriodDelimiterInPrefKeys?: boolean;
}

/** @format binary */
export type GetUserRecommendationsData = File;

/** @format binary */
export type GetUserRecommendationsForNewViewData = File;

export interface GetUserRecommendationsForNewViewParams {
  fields?: string;
  /**
   * the latitude of the client
   * @format double
   */
  lat?: number;
  /**
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * the longitude of the client
   * @format double
   */
  lng?: number;
  /**
   * profile id for user associated with recs
   * @format int64
   */
  ownerProfileId: number;
  /** the container to show the ordering and offset of the next request. Leave empty on first call */
  pageKey?: string;
  /** the zipcode of the client */
  zipCode?: string;
}

export interface GetUserRecommendationsParams {
  /** Use the campaignId to enable additional features. 'foryou_favorites' enables favorites radio and 'foryou_collections' enables both favorites radio and collections to be returned */
  campaignId?: string;
  fields?: string;
  /**
   * the latitude of the client
   * @format double
   */
  lat?: number;
  /**
   * total number to return. (Required)
   * @format int32
   * @default "10"
   */
  limit?: number;
  /**
   * the longitude of the client
   * @format double
   */
  lng?: number;
  /**
   * offset from start of list (0 is first)
   * @format int32
   * @default "0"
   */
  offset?: number;
  /**
   * profile id for user associated with recs
   * @format int64
   */
  ownerProfileId: number;
  /**
   * Comma separated list of structure of returned recs. (Optional)
   * LR - Most Popular Live Radio
   * CR - Recent Live Radio
   * LN - Live stations nearby
   * LRRM - Live Radio Recommended in Market
   * DL - Merch or Slider content
   * Example: LR,LR,CR,LN
   */
  template?: string;
  /** the zipcode of the client */
  zipCode?: string;
}

/** GetUserSubscriptionResponse */
export type GetUserSubscriptionResponse = ResponseObject & {
  accountType?: string;
  activeStreamer: boolean;
  /** @format int64 */
  endDate?: number;
  failedPayment: boolean;
  /** @format int32 */
  hoursTillEndDate: number;
  lastBillingMessage?: string;
  /** @format int64 */
  nextBillDate?: number;
  paymentType?: string;
  recurringPaymentId?: string;
  /** @format int32 */
  subscriptionId: number;
  subscriptions?: object[];
  validForPremiumStreaming: boolean;
  validForRadioStreaming: boolean;
};

/** White List Api Urls */
export type GetWhiteListApiUrlsData = GetWhiteListApiUrlsResponse;

/** GetWhiteListApiUrlsResponse */
export type GetWhiteListApiUrlsResponse = ResponseObject & {
  whilteListApiUrls?: string[];
};

/** IContentTO */
export type IContentTO = object;

/** ImmutableResultRestValue */
export type ImmutableResultRestValue = ResponseObject & {
  badShowSingletonInstance?: ImmutableResultRestValue;
  defaultSingletonInstance?: ImmutableResultRestValue;
  /** @format int64 */
  lastModifiedDate?: number;
  notFoundSingletonInstance?: ImmutableResultRestValue;
  objectIds?: string[];
  /** @format int64 */
  preModifiedDate?: number;
  /** @format int64 */
  profileId?: number;
};

/** KeywordRestValue */
export interface KeywordRestValue {
  androidUrl?: string;
  category?: string;
  /** @format int32 */
  contentId: number;
  contentType?: string;
  description?: string;
  iPhoneUrl?: string;
  /** @format int32 */
  id: number;
  image?: string;
  keywords?: string[];
  name?: string;
  /** @format int32 */
  priority?: number;
  /** @format float */
  score: number;
  webUrl?: string;
}

/** LiveArtistStationRestValue */
export interface LiveArtistStationRestValue {
  /** the description */
  description?: string;
  /**
   * the score
   * @format double
   */
  score: number;
  /**
   * the stationId
   * @format int32
   */
  stationId: number;
  /** the stationName */
  stationName?: string;
}

/** LiveGenreResponse */
export type LiveGenreResponse = BaseResponse & {
  primary: boolean;
  /** @format int32 */
  sortIndex: number;
};

/** LiveMarketResponse */
export type LiveMarketResponse = BaseResponse & {
  city?: string;
  /** @format int32 */
  cityId: number;
  country?: string;
  /** @format int32 */
  countryId: number;
  marketId?: string;
  origin: boolean;
  primary: boolean;
  /** @format int32 */
  sortIndex: number;
  stateAbbreviation?: string;
  /** @format int32 */
  stateId: number;
};

/** LiveRadioAdConfigResponse */
export type LiveRadioAdConfigResponse = ResponseObject & {
  /** @format int32 */
  adInterval: number;
  enabledFormats?: Record<string, boolean>;
  liveIdleDisabledFormats?: Record<string, boolean>;
  /** @format int32 */
  maximumScans: number;
};

/** LiveRadioStationRecs */
export interface LiveRadioStationRecs {
  /** @format int32 */
  liveRadioStationId?: number;
  liveRadioStationRecs?: number[];
}

/** LiveRadioStationRestValue */
export interface LiveRadioStationRestValue {
  /** the buttonid */
  buttonid?: string;
  favorite?: boolean;
  /** @format int64 */
  lastModifiedDate?: number;
  /** @format int32 */
  liveRadioStationID?: number;
  liveRadioStationName?: string;
  /** @format int32 */
  playCount?: number;
  /** @format int64 */
  registeredDate?: number;
  thumbsDownTracks?: number[];
  thumbsUpTracks?: number[];
  tracks?: TrackRestLiteValue[];
}

/** LiveRadioStationRestValueList */
export type LiveRadioStationRestValueList = ResponseObject & {
  /** @format int64 */
  lastModifiedDate?: number;
  liveRadioStations?: LiveRadioStationRestValue[];
  /** @format int64 */
  preModifiedDate?: number;
  /** @format int64 */
  profileId: number;
};

/** LiveResponse */
export type LiveResponse = StationResponse & {
  ads?: Record<string, string>;
  adswizz?: Record<string, string>;
  adswizzZones?: Record<string, string>;
  /** @format int32 */
  ageLimit?: number;
  callLetterAlias?: string;
  callLetterRoyalty?: string;
  countries?: string;
  created?: string;
  /** @format int32 */
  cume?: number;
  email?: string;
  esid?: string;
  esidSplit?: string;
  fccFacilityId?: string;
  feeds?: Record<string, string>;
  format?: string;
  freq?: string;
  genres?: LiveGenreResponse[];
  isActive?: boolean;
  link?: string;
  markets?: LiveMarketResponse[];
  modified?: string;
  phone?: string;
  primaryMarket?: string;
  pronouncements?: UtteranceTO[];
  provider?: string;
  rds?: string;
  rdsPiCode?: string;
  social?: Record<string, string>;
  streamingPlatform?: string;
  streams?: Record<string, string>;
  talkbackEnabled?: boolean;
  website?: string;
  zips?: string;
};

export type Login3rdPartyData = LoginResponse;

export interface Login3rdPartyPayload {
  code?: string;
  /**
   * Unique static device id for a specific device. This is created
   * by the client.
   */
  deviceId?: string;
  /** Static name of the device selected by the client. */
  deviceName?: string;
  /** key associated with that sepecific device */
  deviceType?: string;
  /** Token from the 3rd party device. */
  externalUuid?: string;
  /**
   * SHA-1 hash of salt + external uuid + timestamp. Salt is unique for
   * each device type.
   */
  hash?: string;
  /** Host value for the client. */
  host?: string;
  /**
   * Set if this device should immediately be able to stream.
   * Should be set to true.
   */
  setCurrentStreamer?: boolean;
  /**
   * Current time on the device(unix time). This is used in the sha-1
   * hash. If it is more than 24 hours off the server time, it will
   * be rejected
   * @format int64
   */
  timeStamp?: number;
}

/** a login response */
export type LoginAdvData = LoginResponse;

export interface LoginAdvPayload {
  /** Access Token */
  accessToken?: string;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  deviceId?: string;
  deviceName?: string;
  /** whether to generate a token for subsequent logins */
  generateToken?: boolean;
  host?: string;
  /** OAuth UUID */
  oauthUuid?: string;
  setCurrentStreamer?: boolean;
}

/** a login response */
export type LoginData = LoginResponse;

export type LoginOAuthDeviceData = LoginResponse;

/** LoginOAuthDeviceRequest */
export interface LoginOAuthDeviceRequest {
  accessToken?: string;
  deviceId?: string;
  deviceName?: string;
  host?: string;
}

export type LoginOrCreateOauthUserData = CreateUserResponse;

export interface LoginOrCreateOauthUserPayload {
  accessToken?: string;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  appInstallTime?: string;
  /** @format int32 */
  birthYear?: number;
  deviceId?: string;
  deviceName?: string;
  gender?: string;
  generateToken?: boolean;
  host?: string;
  oauthUuid?: string;
  /** @default "false" */
  oauthoverride?: string;
  /** @default "true" */
  sendWelcomeEmail?: string;
  /** @format int32 */
  subscriptionId: number;
  userName?: string;
  zipCode?: string;
}

export type LoginOrCreateUserData = CreateUserResponse;

export interface LoginOrCreateUserPayload {
  /**
   * Time the app was installed including timezone. Date format is
   * dd MMM yyyy HH:mm:ss Z ex: 29 Jan 2002 22:14:02 -0300
   * #required#
   */
  appInstallTime?: string;
  /**
   * - birthYear of user (should be passed only for new users)
   * @format int32
   */
  birthYear?: number;
  /** #required# */
  deviceId?: string;
  /** #required# */
  deviceName?: string;
  /**
   * - Integer flag indicating opt out preference (0/1)
   * @format int32
   */
  emailOptOut?: number;
  /**
   * - Gender (Male or Female, no "Other" option) (should be passed
   * only for new users)
   */
  gender?: string;
  /** whether to generate a token for subsequent logins */
  generateToken?: boolean;
  /** Host #required# */
  host?: string;
  /** Users password #required# */
  password?: string;
  /** @default "true" */
  sendWelcomeEmail?: string;
  /** @format int32 */
  subscriptionId: number;
  /**
   * - termsAcceptanceDate in time format (long), milliseconds
   * @format int64
   */
  termsAcceptanceDate?: number;
  /** Request user name. #required# */
  userName?: string;
  /** - zipCode of user (should be passed only for new users) */
  zipCode?: string;
}

export interface LoginPayload {
  /**
   * Unique static device id for a specific device. This is created
   * by the client.
   */
  deviceId?: string;
  /** Static name of the device selected by the client. */
  deviceName?: string;
  /** whether to generate a token for subsequent logins */
  generateToken?: boolean;
  /** the host name */
  host?: string;
  /** Users password */
  password?: string;
  /** true if active streamer; false otherwise */
  setCurrentStreamer?: boolean;
  /**
   * - termsAcceptanceDate in time format (long), milliseconds
   * (optional parameter)
   * @format int64
   */
  termsAcceptanceDate?: number;
  /** User name */
  userName?: string;
}

/** LoginResponse */
export type LoginResponse = ResponseObject & {
  accountType?: AccountType;
  countryCode?: string;
  /** @format int64 */
  currentTime?: number;
  deauthorizedDeviceName?: string;
  loginToken?: string;
  oauths?: OauthRestValue[];
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  userSubscription?: GetUserSubscriptionResponse;
};

export type LoginSamlData = LoginResponse;

export interface LoginSamlPayload {
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  host?: string;
  setCurrentStreamer?: boolean;
}

export type LoginWithShortLivedTokenData = LoginResponse;

export interface LoginWithShortLivedTokenPayload {
  deviceId?: string;
  deviceName?: string;
  host?: string;
  token?: string;
}

/** a login response */
export type LoginWithTokenData = LoginResponse;

export interface LoginWithTokenPayload {
  /**
   * Unique static device id for a specific device. This is created
   * by the client.
   */
  deviceId?: string;
  /** Static name of the device selected by the client. */
  deviceName?: string;
  /**
   * SHA-1 hash of salt + token + timestamp. Salt is unique for
   * each device type.
   */
  hash?: string;
  /** Host value for the client. */
  host?: string;
  /**
   * the user's profile id
   * @format int64
   */
  profileId: number;
  /**
   * Current time on the device(unix time). This is used in the sha-1
   * hash. If it is more than 24 hours off the server time, it will
   * be rejected
   * @format int64
   */
  timestamp?: number;
  /** the token */
  token?: string;
}

/**
 * success or failure of operation.
 * @format binary
 */
export type MoveUserFavoriteData = File;

export interface MoveUserFavoritePayload {
  /**
   * new position index in the list.  0 is top position.
   * @format int32
   */
  position: number;
  /** station id */
  stationId?: string;
  /** station type */
  stationType?: 'CR' | 'CRA' | 'CT' | 'LR' | 'P' | 'PC';
}

/** OBJTYPE */
export enum OBJTYPE {
  STATION = 'STATION',
  ARTIST = 'ARTIST',
  TRACK = 'TRACK',
  FEATUREDSTATION = 'FEATUREDSTATION',
  TALK_SHOW = 'TALK_SHOW',
  TALK_THEME = 'TALK_THEME',
  KEYWORD = 'KEYWORD',
}

/** OauthRestValue */
export interface OauthRestValue {
  oauthUuid?: string;
  type?: string;
}

/** PRNContentRestValue */
export interface PRNContentRestValue {
  formats?: FormatRestValue[];
}

/** PRNEpisodeGroupCountResponse */
export type PRNEpisodeGroupCountResponse = ResponseObject & {
  /** @format int64 */
  episodeCount: number;
};

/** PRNEpisodeGroupRestValue */
export interface PRNEpisodeGroupRestValue {
  /** @format int32 */
  groupId?: number;
  /** @format int64 */
  serialversionuid: number;
  voDEpisode?: PRNEpisodeRestValue;
}

/** PRNEpisodeRestValue */
export interface PRNEpisodeRestValue {
  content?: PRNContentRestValue;
  /** @format int64 */
  date?: number;
  description?: string;
  /** @format int32 */
  duration?: number;
  /** @format int32 */
  episodeId?: number;
  externalUrl?: string;
  /** @format int32 */
  groupId?: number;
  image?: string;
  live: boolean;
  /** @format int64 */
  serialversionuid: number;
  shortDescription?: string;
  /** @format int32 */
  showId?: number;
  title?: string;
  /** @format int32 */
  viewCount?: number;
}

/** PRNShowRestValue */
export interface PRNShowRestValue {
  description?: string;
  episodeGroups?: PRNEpisodeGroupRestValue[];
  episodes?: PRNEpisodeRestValue[];
  /** @format int32 */
  id?: number;
  imagePath?: string;
  latestEpisode?: PRNEpisodeRestValue;
  live: boolean;
  title?: string;
}

/** PlaybackRights */
export interface PlaybackRights {
  onDemand?: boolean;
}

/** PlaybackRightsRestValue */
export interface PlaybackRightsRestValue {
  onDemand?: boolean;
}

/** PlayedFromContextType */
export enum PlayedFromContextType {
  LR = 'LR',
  CR = 'CR',
  P = 'P',
  CRA = 'CRA',
  CT = 'CT',
  PC = 'PC',
}

/** PlaylistStationResponse */
export type PlaylistStationResponse = ResponseObjectV2 & {
  content?: BaseResponse[];
  description?: string;
  deviceLink?: string;
  favorite?: boolean;
  id?: string;
  imagePath?: string;
  /** @format int64 */
  lastModifiedDate?: number;
  /** @format int64 */
  lastPlayedDate?: number;
  link?: string;
  name?: string;
  /** @format int32 */
  newEpisodeCount?: number;
  /** @format int32 */
  playCount?: number;
  presetId?: string;
  /** @format int64 */
  profileId?: number;
  /** @format int64 */
  registeredDate?: number;
  slug?: string;
  stationType?: StationEnum;
  thumbsDown?: number[];
  thumbsUp?: number[];
  variety?: VarietyType;
};

/** PresetKeyRestValue */
export interface PresetKeyRestValue {
  buttonid?: string;
  playedFrom?: PlayedFromContextType;
  stationid?: string;
}

/** QualityRestValue */
export interface QualityRestValue {
  /** @format int32 */
  bitRate: number;
  /** @format int32 */
  height?: number;
  level?: string;
  url?: string;
  /** @format int32 */
  width?: number;
}

/** query results */
export type QueryAllData = SearchResponse;

export interface QueryAllParams {
  /** marketId id of the market to boost */
  boostMarketId?: string;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /** #required# */
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * true to return artists; false otherwise
   * @default "true"
   */
  queryArtist?: boolean;
  /**
   * true to return bundles; false otherwise
   * @default "true"
   */
  queryBundle?: boolean;
  /**
   * true to return featured stations; false otherwise
   * @default "false"
   */
  queryFeaturedStation?: boolean;
  /** @default "false" */
  queryKeyword?: boolean;
  /**
   * true to return stations; false otherwise
   * @default "true"
   */
  queryStation?: boolean;
  /**
   * true to return talk shows; false otherwise
   * @default "false"
   */
  queryTalkShow?: boolean;
  /**
   * true to return talk themes; false otherwise
   * @default "false"
   */
  queryTalkTheme?: boolean;
  /**
   * true to return tracks; false otherwise
   * @default "true"
   */
  queryTrack?: boolean;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
  trackBundleId?: string;
}

/** artist results */
export type QueryArtistData = SearchResponse;

export interface QueryArtistParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /** @format int32 */
  genreId?: number;
  /** #required# */
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
  /** @format int32 */
  vendorGenreId?: number;
}

/** search results */
export type QueryKeywordData = SearchResponse;

export interface QueryKeywordParams {
  countryCode?: string;
  /** #required# */
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** prnEpisodes */
export type QueryPrnEpisodeData = SearchResponse;

export interface QueryPrnEpisodeParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  /** @format int32 */
  groupId?: number;
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /** @format int32 */
  showId?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** shows */
export type QueryShowData = SearchResponse;

export interface QueryShowParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** artist results */
export type QueryStationData = SearchResponse;

export interface QueryStationParams {
  /** id of the market you want the boost */
  boostMarketId?: string;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /** #required# */
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** themes */
export type QueryThemeData = SearchResponse;

export interface QueryThemeParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   */
  countryCode?: string;
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
}

/** trackbundle results */
export type QueryTrackBundleData = SearchResponse;

export interface QueryTrackBundleParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /** @format int32 */
  genreId?: number;
  /** #required# */
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
  /** @format int32 */
  vendorGenreId?: number;
}

/** tracks */
export type QueryTrackData = SearchResponse;

export type QueryTrackExternalData = EnrichmentTrackQueryResponse;

export interface QueryTrackExternalParams {
  artist?: string;
  cartId?: string;
  duration?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
  track?: string;
}

export interface QueryTrackParams {
  artistId?: string;
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /** @format int32 */
  genreId?: number;
  /** #required# */
  keywords?: string;
  /**
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /**
   * @format int32
   * @default "0"
   */
  startIndex?: number;
  trackBundleId?: string;
  /** @format int32 */
  vendorGenreId?: number;
}

/** RadioStationRestValue */
export interface RadioStationRestValue {
  artistName?: string;
  artistRadio: boolean;
  /** @format int32 */
  artistSeed?: number;
  /** the buttonid */
  buttonid?: string;
  favorite?: boolean;
  /** @format int32 */
  featuredStationId?: number;
  /** @format int64 */
  lastPlayedDate?: number;
  /** @format int32 */
  playCount?: number;
  radioStationID?: string;
  radioStationName?: string;
  /** @format int64 */
  registeredDate?: number;
  stationType?: RadioType;
  suppressedArtistIds?: number[];
  thumbsDownTracks?: number[];
  thumbsUpTracks?: number[];
  /** @format int32 */
  trackSeed?: number;
  tracks?: TrackRestLiteValue[];
  /** @format int32 */
  variety?: number;
}

/** RadioStationRestValueList */
export type RadioStationRestValueList = ResponseObject & {
  /** @format int64 */
  profileId?: number;
  radioStations?: RadioStationRestValue[];
};

/** RadioType */
export enum RadioType {
  ARTIST = 'ARTIST',
  TRACK = 'TRACK',
  GENRE = 'GENRE',
  MOOD = 'MOOD',
  LIVE = 'LIVE',
  TALK_THEME = 'TALK_THEME',
  TALK_SHOW = 'TALK_SHOW',
  FAVORITES = 'FAVORITES',
  COLLECTION = 'COLLECTION',
  PODCAST = 'PODCAST',
  N4U = 'N4U',
}

/** RecArtistRestValue */
export interface RecArtistRestValue {
  /** @format int32 */
  artistId: number;
  artistName?: string;
  /** the formatName */
  formatName?: string;
  /**
   * the formatRank
   * @format int32
   */
  formatRank?: number;
}

/** RecBasisDescriptor */
export interface RecBasisDescriptor {
  /** @format int64 */
  basisId: number;
  basisType?: RecBasisType;
}

/** RecBasisType */
export enum RecBasisType {
  RECENT_LIVE_STATION = 'RECENT_LIVE_STATION',
  MOST_PLAYED_LIVE_STATION = 'MOST_PLAYED_LIVE_STATION',
  RECENT_CUSTOM_STATION = 'RECENT_CUSTOM_STATION',
  MOST_PLAYED_CUSTOM_STATION = 'MOST_PLAYED_CUSTOM_STATION',
  FB_CUSTOM_STATION = 'FB_CUSTOM_STATION',
  FB_LIVE_STATION = 'FB_LIVE_STATION',
  NEARBY_LIVE_STATION = 'NEARBY_LIVE_STATION',
  RECENT_LISTENED_TO_LIVE_STATION = 'RECENT_LISTENED_TO_LIVE_STATION',
  RECENT_LISTENED_TO_CUSTOM_STATION = 'RECENT_LISTENED_TO_CUSTOM_STATION',
  GENRE = 'GENRE',
  MARKET = 'MARKET',
  FAVORITES = 'FAVORITES',
  POPULAR = 'POPULAR',
  FEATURED_FOR_YOU = 'FEATURED_FOR_YOU',
  DL = 'DL',
  N4U = 'N4U',
}

/** RecCustArtistStationsRestValue */
export type RecCustArtistStationsRestValue = ResponseObject & {
  /** the recommendedArtistIds */
  recs?: CustArtistStationRestValue[];
};

/** RecLiveArtistStationsRestValue */
export type RecLiveArtistStationsRestValue = ResponseObject & {
  recs?: LiveArtistStationRestValue[];
};

/** RecLiveStationRestValue */
export type RecLiveStationRestValue = ResponseObject & {
  recs?: LiveRadioStationRecs;
};

/** RecTO */
export interface RecTO {
  basedOn?: Record<string, RecBasisType>;
  /** @format int64 */
  basisArtistId?: number;
  basisDescriptor?: RecBasisDescriptor;
  basisIdSet: boolean;
  complete: boolean;
  /** @format int64 */
  contentId?: number;
  contentName?: string;
  contentTO?: IContentTO;
  extraPayload?: DLContentPayload;
  image?: string;
  label?: string;
  numericId: boolean;
  recTO?: RecTO;
  recommendationSet: boolean;
  recommendedContentName?: string;
  recommendedContentType?: RecType;
  subLabel?: string;
  subType?: DLType;
  type?: RecType;
}

/** RecType */
export enum RecType {
  UNDEFINED = 'UNDEFINED',
  LR = 'LR',
  CR = 'CR',
  LN = 'LN',
  LRRM = 'LRRM',
  DL = 'DL',
  LGN = 'LGN',
  FAV = 'FAV',
  RL = 'RL',
  N4U = 'N4U',
}

/** RecommendationElement */
export interface RecommendationElement {
  basedOn?: Record<string, RecBasisType>;
  /** @format int64 */
  contentId?: number;
  contentName?: string;
  contentTO?: IContentTO;
  recTO?: RecTO;
  type?: RecType;
}

/** RecordLabelRestValue */
export interface RecordLabelRestValue {
  recordLabel?: string;
  /** @format int32 */
  recordLabelId: number;
  recordProvider?: string;
  recordSublabel?: string;
}

export type RegisterClientData = RegisterClientResponse;

export interface RegisterClientParams {
  /** #required# */
  deviceId?: string;
  /** #required# */
  deviceName?: string;
  trackingParams: string;
}

/** RegisterClientResponse */
export type RegisterClientResponse = ResponseObject & {
  /** @format int32 */
  clientInstanceId?: number;
};

export type RegisterListenData = ResultRestValue;

export interface RegisterListenPayload {
  /** @default "true" */
  isSavedStation?: boolean;
  /**
   * #required#
   * @format int64
   */
  profileId?: number;
  /** #required# */
  sessionId?: string;
}

export type RegisterPlayData = ResultRestValue;

export interface RegisterPlayParams {
  /** @format int32 */
  episodeId: number;
  /** @format int32 */
  groupId: number;
}

/** RelatedArtistsResponse */
export type RelatedArtistsResponse = ResponseObject & {
  followerArtists?: ArtistRestValue[];
  influenceArtists?: ArtistRestValue[];
  similarArtists?: ArtistRestValue[];
};

export type RemoveLongLastingToken2Data = RemoveTokenResponse;

/** the token response */
export type RemoveLongLastingTokenData = RemoveTokenResponse;

/** Success message */
export type RemoveOauthCredData = UpdateOauthCredResponse;

export interface RemoveOauthCredPayload {
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  /**
   * Logged in users profile Id.
   * @format int64
   */
  profileId: number;
  /** Logged in users session id. */
  sessionId?: string;
}

/** User's Preset preferences */
export type RemovePresetPreferenceData = UserProfileRestValue;

export interface RemovePresetPreferencePayload {
  buttonid?: string;
  /**
   * - Logged in users's profile id. #required#
   * @format int64
   */
  profileId: number;
  /** - Logged in users session id. #required# */
  sessionId?: string;
}

/** an object representing the results of the operation */
export type RemoveShowFromStationData = ImmutableResultRestValue;

export interface RemoveShowFromStationPayload {
  /** #required# */
  sessionId?: string;
}

/** RemoveTokenResponse */
export type RemoveTokenResponse = ResponseObject & {
  /** @format int32 */
  tokenRemovedCount?: number;
};

/** an object representing the results of the operation */
export type RenameRadioStation2Data = ImmutableResultRestValue;

export interface RenameRadioStation2Payload {
  /** #required */
  name?: string;
  /** #required# */
  sessionId?: string;
}

export type RenameRadioStationData = ResultRestValue;

export interface RenameRadioStationPayload {
  /**
   * - the override name chosen by the user. This will not make the
   * station unique.#required#
   */
  name?: string;
  /**
   * #required#
   * @format int64
   */
  profileId: number;
  /** #required# */
  sessionId?: string;
}

/** @format binary */
export type RenameStationData = File;

export interface RenameStationPayload {
  /** what you want to rename the station to */
  name?: string;
}

/** @format binary */
export type ReportStatusData = File;

export interface ReportStatusPayload {
  /**
   * A milliseconds representation of the current date
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /** PlayerKey used to listen to this item. */
  playerKey?: string;
  /**
   * the number of seconds played
   * @format int32
   */
  secondsPlayed?: number;
  /**
   * Status of the call. </br></br>
   * START - when a stream is started.</br>
   * REPORT_15 - when a stream has played for 15 seconds.</br>
   * STATIONCHANGE - when a stream is has been changed.</br>
   * APPCLOSE - when a user has closed the app.</br>
   * SKIP - when a user has skipped the song.</br>
   * DONE - when a song has been completed.</br>
   */
  status?:
    | 'APPCLOSE'
    | 'APPCLOSE2'
    | 'DONE'
    | 'ERROR'
    | 'REPORT_15'
    | 'SKIP'
    | 'START'
    | 'STATIONCHANGE';
}

/** A response containing boolean status */
export type ReportStreamDoneData = ReportStreamDoneResponse;

export interface ReportStreamDonePayload {
  /**
   * - Track Id of currently playing track, or the episode id if this is a talk event
   * @format int32
   */
  contentId?: number;
  /**
   * - Elapsed Time in seconds.
   * @format int32
   */
  elapsedTime?: number;
  /** - not used for talk */
  host?: string;
  /** - mixinType (AD, SWEEPER, PRODUCTION) . */
  mixinType?: 'AD' | 'NEWS' | 'PRODUCTION' | 'SWEEPER' | 'TRAFFIC' | 'WEATHER';
  /**
   * - this is the ID of the context it was played in, either a Live Station, Custom Station, etc
   * @default ""
   */
  parentId?: string;
  /**
   * - playDate in time format (long), milliseconds
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
   * (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /** #required# */
  playerKey?: string;
  /**
   * Logged in users profile Id. #required#
   * @format int64
   */
  profileId: number;
  /**
   * - the radio station id
   * @default ""
   */
  radiostationId?: string;
  /** - reason string should be one of "completed", "skipped", "stopped", "stationchange", or "appclose" */
  reason?: string;
  /** session id #required# */
  sessionId?: string;
}

/** ReportStreamDoneResponse */
export type ReportStreamDoneResponse = ReportStreamResponse & {
  /** @format int32 */
  daySkipsRemaining?: number;
  /** @format int32 */
  hourSkipsRemaining?: number;
};

/** A response containing boolean status */
export type ReportStreamOneData = ReportStreamStartedResponse;

export interface ReportStreamOnePayload {
  /**
   * - Track Id of currently playing track, or Episode Id for talk;
   * @format int32
   */
  contentId?: number;
  /** #required# */
  host?: string;
  /**
   * - this is the ID of the context it was played in, either a Live Station, Custom Station, etc
   * @default ""
   */
  parentId?: string;
  /**
   * - playDate in time format (long), milliseconds
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
   * (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /** - the player key */
  playerKey?: string;
  /**
   * Logged in users profile Id. #required#
   * @format int64
   */
  profileId: number;
  /** session id #required# */
  sessionId?: string;
}

/** ReportStreamResponse */
export type ReportStreamResponse = ResponseObject & {
  success?: string;
  userSubscription?: GetUserSubscriptionResponse;
};

export type ReportStreamStarted2Data = ReportStreamStartedResponse;

export interface ReportStreamStarted2Payload {
  /**
   * @format int32
   * @default "0"
   */
  artistId?: number;
  /** @format int32 */
  contentId?: number;
  /**
   * @format int32
   * @default "0"
   */
  featuredStationId?: number;
  host?: string;
  /** @default "" */
  parentId?: string;
  playDate?: string;
  /**
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /** @format int32 */
  playedFrom?: number;
  playerKey?: string;
  /** @format int64 */
  profileId: number;
  /** @default "true" */
  returnUserInfo?: boolean;
  /**
   * @format int32
   * @default "0"
   */
  seedArtistId?: number;
  /**
   * @format int32
   * @default "0"
   */
  seedTrackId?: number;
  sessionId?: string;
}

/** @format binary */
export type ReportStreamStarted3Data = File;

export interface ReportStreamStarted3Payload {
  /** @format int32 */
  artistId?: number;
  /** @format int32 */
  contentId?: number;
  host?: string;
  /**
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /** @format int32 */
  playedFrom?: number;
  /** @format int64 */
  profileId: number;
  /** @format int32 */
  secondsPlayed?: number;
  sessionId?: string;
  /** @default "" */
  stationId?: string;
  status?:
    | 'APPCLOSE'
    | 'APPCLOSE2'
    | 'DONE'
    | 'ERROR'
    | 'REPORT_15'
    | 'SKIP'
    | 'START'
    | 'STATIONCHANGE';
}

/**
 * A response containing the URL for the content stream and the next
 * player key
 */
export type ReportStreamStartedData = ReportStreamStartedResponse;

export interface ReportStreamStartedPayload {
  /**
   * - Artist Id of currently playing track
   * @format int32
   */
  artistId?: number;
  /**
   * - Track Id of currently playing track
   * @format int32
   */
  contentId?: number;
  /**
   * - host name (example: desktop.app.thumbplay.com,
   * mobile.app.thumbplay.com etc..)
   */
  host?: string;
  /**
   * - this is the ID of the context it was played in, either a
   * Live Station, Custom Station, etc
   * @default ""
   */
  parentId?: string;
  /**
   * - Value should match the range for Live radio (300-399)
   * @format int32
   */
  playedFrom?: number;
  /**
   * Logged in users profile Id.
   * @format int64
   */
  profileId: number;
  /** session id #required# */
  sessionId?: string;
}

/** ReportStreamStartedResponse */
export type ReportStreamStartedResponse = ReportStreamResponse;

/** A response containing the URL for the content stream and the next player key */
export type ReportStreamTwoData = ReportStreamStartedResponse;

export interface ReportStreamTwoPayload {
  /**
   * - Artist Id of currently playing track, for talk set to 0;
   * @format int32
   */
  artistId?: number;
  /**
   * - Track Id of currently playing track, or Episode Id for Talk
   * @format int32
   */
  contentId?: number;
  /**
   * - Featured stationId. Client should pass it for featured station. (Optional parameter) For talk set to
   * 0;
   * @format int32
   */
  featuredStationId?: number;
  /** #required# */
  host?: string;
  /**
   * - this is the ID of the context it was played in, either a Live Station, Custom Station, etc
   * @default ""
   */
  parentId?: string;
  /**
   * - playDate in time format (long), milliseconds
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
   * (Custom Talk)
   * @format int32
   */
  playedFrom?: number;
  playerKey?: string;
  /**
   * Logged in users profile Id. #required#
   * @format int64
   */
  profileId: number;
  /**
   * - Seed Artist Id. Client should pass it for both track seeded and artist seeded stations. (Optional
   * parameter). For talk set to 0;
   * @format int32
   */
  seedArtistId?: number;
  /**
   * - Seed ShowId. Client should pass it for show seeded Talk Stations. Don't pass this param if it's not
   * a show seeded station.
   * @format int32
   * @default "0"
   */
  seedShowId?: number;
  /**
   * - Seed ThemeId. Client should pass it for theme seeded Talk Stations. Don't pass this param if it's
   * not a theme seeded station.
   * @format int32
   * @default "0"
   */
  seedThemeId?: number;
  /**
   * - Seed TrackId Client should pass it for trackSeeded Stations. (Optional parameter). For talk set to
   * 0;
   * @format int32
   */
  seedTrackId?: number;
  /** session id #required# */
  sessionId?: string;
  /**
   * - ShowId for the given contentId (Only pass if the content is an episode). Client should pass it for
   * Talk Stations. Don't pass this param if it's not a Talk station.
   * @format int32
   * @default "0"
   */
  showId?: number;
}

/** A response containing boolean status */
export type ReportStreamVastData = ReportStreamResponse;

export interface ReportStreamVastParams {
  /**
   * - Track Id of currently playing track, or the episode id if this is a talk event
   * @format int32
   */
  contentId?: number;
  /**
   * - Elapsed Time in seconds.
   * @format int32
   */
  elapsedTime?: number;
  /** - not used for talk */
  host?: string;
  /** - mixinType (AD, SWEEPER, PRODUCTION) . */
  mixinType?: 'AD' | 'NEWS' | 'PRODUCTION' | 'SWEEPER' | 'TRAFFIC' | 'WEATHER';
  /**
   * - this is the ID of the context it was played in, either a Live Station, Custom Station, etc
   * @default ""
   */
  parentId?: string;
  /**
   * - playDate in time format (long), milliseconds
   * @format int64
   * @default "0"
   */
  playedDate?: number;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
   * (custom talk)
   * @format int32
   */
  playedFrom?: number;
  playerKey?: string;
  /**
   * Logged in users profile Id. #required#
   * @format int64
   */
  profileId: number;
  /**
   * - the radio station id
   * @default ""
   */
  radiostationId?: string;
  /** - reason string should be one of "completed", "skipped", "stopped", "stationchange", or "appclose" */
  reason?: string;
  /** session id #required# */
  sessionId?: string;
}

/** RequestParam */
export interface RequestParam {
  name?: string;
  value?: string;
}

/** ResetDeviceTokenRestValue */
export type ResetDeviceTokenRestValue = ResponseObject & {
  success: boolean;
};

/** Success message */
export type ResetPwData = ResetPwResponse;

/** ResetPwResponse */
export type ResetPwResponse = ResponseObject & {
  success: boolean;
};

/** @format binary */
export type ResetRadioSessionData = File;

export interface ResetRadioSessionParams {
  /** @format int64 */
  profileId?: number;
  radioStationId?: string;
}

/**
 * boolean
 * @format binary
 */
export type ResetThumbData = File;

/** ResponseEnum */
export enum ResponseEnum {
  TRACK = 'TRACK',
  ARTIST = 'ARTIST',
  FEATUREDSTATION = 'FEATUREDSTATION',
  STATION = 'STATION',
  TALKTHEME = 'TALKTHEME',
  TALKSHOW = 'TALKSHOW',
  TRACKBUNDLE = 'TRACKBUNDLE',
  LIVE = 'LIVE',
  P4 = 'P4',
  CURATED = 'CURATED',
  SWEEPER = 'SWEEPER',
  LINK = 'LINK',
  FAVORITES = 'FAVORITES',
  N4U = 'N4U',
}

/** ResponseObject */
export interface ResponseObject {
  /** @format int64 */
  duration?: number;
  errors?: ErrorEntry[];
  firstError?: ErrorEntry;
}

/** ResponseObjectContainerOfLiveResponse */
export type ResponseObjectContainerOfLiveResponse = ResponseObjectV2 & {
  hits?: LiveResponse[];
  /** @format int64 */
  total: number;
};

/** ResponseObjectContainerOfPlaylistStationResponse */
export type ResponseObjectContainerOfPlaylistStationResponse =
  ResponseObjectV2 & {
    hits?: PlaylistStationResponse[];
    /** @format int64 */
    total: number;
  };

/** ResponseObjectV2 */
export interface ResponseObjectV2 {
  /** @format int64 */
  duration?: number;
  error?: ErrorEntry;
  firstError?: ErrorEntry;
}

/** ResultRestValue */
export type ResultRestValue = ResponseObject & {
  /** @format int64 */
  lastModifiedDate?: number;
  objectIds?: string[];
  /** @format int64 */
  preModifiedDate?: number;
  /** @format int64 */
  profileId?: number;
};

/** User's preferences */
export type SavePreferenceData = UserProfileRestValue;

export interface SavePreferencePayload {
  name?: string;
  /**
   * - Logged in users's profile id. #required#
   * @format int64
   */
  profileId: number;
  /** - Logged in users session id. #required# */
  sessionId?: string;
  /** @default "true" */
  usePeriodDelimiterInPrefKeys?: boolean;
  value?: string;
}

/** User's preferences */
export type SavePreferencesData = UserProfileRestValue;

export interface SavePreferencesPayload {
  /**
   * - Logged in users's profile id. #required#
   * @format int64
   */
  profileId: number;
  /** - Logged in users session id. #required# */
  sessionId?: string;
  /** @default "true" */
  usePeriodDelimiterInPrefKeys?: boolean;
}

/** User's Preset preferences */
export type SavePresetPreferencesData = UserProfileRestValue;

export interface SavePresetPreferencesPayload {
  /** - DEPRECATED (presets are going to be global) */
  deviceId?: string;
  /**
   * - Logged in users's profile id. #required#
   * @format int64
   */
  profileId: number;
  /** - Logged in users session id. #required# */
  sessionId?: string;
  /**
   * - The type of the parent object, valid values include:
   * LR("Live Radio"), CR("Custom Radio") #required#
   */
  type?: 'CR' | 'CRA' | 'CT' | 'LR' | 'P' | 'PC';
}

/** SearchResponse */
export type SearchResponse = ResponseObject & {
  /** the artists */
  artists?: ArtistRestValue[];
  bestMatch?: BestMatch;
  bestMatches?: BestMatch[];
  featuredStations?: Void[];
  keywords?: KeywordRestValue[];
  /** the prnEpisodes */
  prnEpisodes?: PRNEpisodeRestValue[];
  spellingSuggestions?: SpellCheckResponse[];
  stations?: StationRestValue[];
  talkShows?: ShowRestValue[];
  talkThemes?: TalkThemeRestValue[];
  /**
   * the totalArtists
   * @format int64
   */
  totalArtists?: number;
  /**
   * the totalBundles
   * @format int64
   */
  totalBundles?: number;
  /** @format int64 */
  totalFeaturedStations?: number;
  /** @format int64 */
  totalKeywords?: number;
  /**
   * the totalPrnEpisodes
   * @format int64
   */
  totalPrnEpisodes?: number;
  /** @format int64 */
  totalStations?: number;
  /** @format int64 */
  totalTalkShows?: number;
  /** @format int64 */
  totalTalkThemes?: number;
  /**
   * the totalTracks
   * @format int64
   */
  totalTracks?: number;
  /** the trackBundles */
  trackBundles?: TrackBundleRestValue[];
  /** the tracks */
  tracks?: TrackRestValue[];
};

/** an 200 response on success; another code otherwise */
export type SetEmailCredentialsData = SetEmailCredentialsResponse;

export interface SetEmailCredentialsPayload {
  /** the password */
  password?: string;
  /**
   * the profile id
   * @format int64
   */
  profileId: number;
  /** the session id */
  sessionId?: string;
  /** the username */
  username?: string;
}

/** SetEmailCredentialsResponse */
export type SetEmailCredentialsResponse = ResponseObject;

/**
 * HTTP response code
 * @format binary
 */
export type SetGenresData = File;

/** Success message */
export type SetNewPasswordData = UpdatePwResponse;

export interface SetNewPasswordPayload {
  /** - Access token */
  accessToken?: string;
  /** - New password to be set for given user */
  password?: string;
  /**
   * - Profile Id
   * @format int64
   */
  profileId?: number;
}

/**
 * Success or failure of operation.
 * @format binary
 */
export type SetUserFavoritesData = File;

/** the user's market and whether that market has mixins or not. */
export type SetUserLocationData = ResponseObject;

export interface SetUserLocationPayload {
  /** Whether the user wants to roam. #required# */
  roaming: boolean;
  /** Logged in users session id. #required# */
  sessionId?: string;
  /** The user's current zipcode. */
  zipcode?: string;
}

/**
 * true if successful; false otherwise
 * @format binary
 */
export type SetVarietyData = File;

export interface SetVarietyPayload {
  /** the variety to set: TOP_HITS, MIX and VARIETY */
  variety?: 'MIX' | 'TOP_HITS' | 'VARIETY';
}

/** ShowResponse */
export type ShowResponse = BaseResponse & {
  allepisodes?: EpisodeRestValue[];
  /** @format int32 */
  associationWeight?: number;
  broadcaster?: string;
  categories?: number[];
  description?: string;
  email?: string;
  episodeclips?: EpisodeRestValue[];
  fullepisodes?: EpisodeRestValue[];
  /** @format int32 */
  globalRank?: number;
  phone?: string;
  slug?: string;
  socialMediaInfo?: SocialMediaRestValue[];
  subtitle?: string;
  title?: string;
  url?: string;
};

/** ShowRestValue */
export interface ShowRestValue {
  allepisodes?: EpisodeRestValue[];
  /** @format int32 */
  associationWeight?: number;
  broadcaster?: string;
  categories?: number[];
  defaultShowRestValue?: ShowRestValue;
  description?: string;
  email?: string;
  episodeclips?: EpisodeRestValue[];
  fullepisodes?: EpisodeRestValue[];
  /** @format int32 */
  globalRank?: number;
  /** @format int32 */
  id?: number;
  imagePath?: string;
  phone?: string;
  /** @format double */
  score: number;
  slug?: string;
  socialMediaInfo?: SocialMediaRestValue[];
  subtitle?: string;
  title?: string;
  url?: string;
}

/** ShowThumbRestValue */
export interface ShowThumbRestValue {
  /** @format int32 */
  count?: number;
  /** @format int32 */
  showId?: number;
}

/** SliderItemTO */
export interface SliderItemTO {
  artistID?: string;
  artistName?: string;
  imageLarge?: string;
  trackID?: string;
}

/** SocialMediaRestValue */
export interface SocialMediaRestValue {
  type?: string;
  url?: string;
}

/** SourceMetaData */
export interface SourceMetaData {
  /** @format int32 */
  count: number;
  /** @format int64 */
  date?: number;
  type?: Type;
}

/** SpellCheckResponse */
export type SpellCheckResponse = ResponseObject & {
  suggestion?: string;
  updated: boolean;
};

/** StationArtist */
export interface StationArtist {
  /** @format int32 */
  artistId: number;
  imagePath?: string;
  name?: string;
  /** @format float */
  score: number;
  /** @format int32 */
  variety?: number;
}

/** StationEnum */
export enum StationEnum {
  TRACK = 'TRACK',
  COLLECTION = 'COLLECTION',
  ARTIST = 'ARTIST',
  TALKSHOW = 'TALKSHOW',
  TALKTHEME = 'TALKTHEME',
  LIVE = 'LIVE',
  N4U = 'N4U',
  RADIO = 'RADIO',
  TALK = 'TALK',
  CLIP = 'CLIP',
  FAVORITES = 'FAVORITES',
  PODCAST = 'PODCAST',
}

/** StationResponse */
export type StationResponse = BaseResponse & {
  artists?: StationArtist[];
  band?: string;
  callLetters?: string;
  city?: string;
  dartUrl?: string;
  description?: string;
  frequency?: string;
  logo?: string;
  shareLink?: string;
  state?: string;
};

/** StationRestValue */
export interface StationRestValue {
  band?: string;
  callLetters?: string;
  city?: string;
  dartUrl?: string;
  description?: string;
  frequency?: string;
  /** @format int32 */
  id?: number;
  logo?: string;
  name?: string;
  newlogo?: string;
  /** @format int32 */
  rank?: number;
  /** @format float */
  score: number;
  shareLink?: string;
  state?: string;
}

/** Stream */
export interface Stream {
  content?: ContentMetadata;
  contentType?: ContentType;
  reportPayload?: string;
  streamUrl?: string;
}

/** StreamUrlResponse */
export type StreamUrlResponse = ResponseObject & {
  ads?: AdRestValue[];
  /** @format int32 */
  daySkipsRemaining?: number;
  /** @format int32 */
  hourSkipsRemaining?: number;
  playerKey?: string;
  /** The generated URL for the stream */
  url?: string;
  userSubscription?: GetUserSubscriptionResponse;
};

/** StreamsResponse */
export type StreamsResponse = ResponseObjectV2 & {
  /** @format int32 */
  ageLimit?: number;
  items?: Stream[];
  skips?: UserSkipsTO;
};

/** SuccessResponse */
export type SuccessResponse = ResponseObject & {
  success: boolean;
};

/** SuccessResponseV2 */
export type SuccessResponseV2 = ResponseObjectV2 & {
  success: boolean;
};

/**
 * SuppressedArtistRV
 * NOTE: <code>created</code> field intentionally omitted from hash and equals.
 */
export interface SuppressedArtistRV {
  /**
   * the artistId
   * @format int32
   */
  artistId: number;
  /**
   * the created
   * @format int64
   */
  created?: number;
  /** the stationId */
  stationId?: string;
}

/** SuppressedStationRV */
export interface SuppressedStationRV {
  /** @format int64 */
  created?: number;
  dlType?: string;
  id?: string;
  type?: RecType;
}

/** SuppressedStationRVList */
export type SuppressedStationRVList = ResponseObjectV2 & {
  stations?: SuppressedStationRV[];
};

/** TalkCategoryRestValue */
export interface TalkCategoryRestValue {
  /** @format int32 */
  categoryId?: number;
  description?: string;
  name?: string;
  shows?: ShowRestValue[];
}

/** TalkStationRestValue */
export interface TalkStationRestValue {
  addedShows?: number[];
  addedShowsFullList?: ShowRestValue[];
  /** the buttonid */
  buttonid?: string;
  episodes?: EpisodeRestValue[];
  favorite?: boolean;
  /** @format int64 */
  lastPlayedDate?: number;
  name?: string;
  /** @format int32 */
  playCount?: number;
  /** @format int64 */
  profileId?: number;
  /** @format int64 */
  registeredDate?: number;
  removedShows?: number[];
  removedShowsFullList?: ShowRestValue[];
  /** @format int32 */
  seedShow?: number;
  /** @format int32 */
  seedTheme?: number;
  talkStationId?: string;
  thumbDownEpisodes?: number[];
  thumbDownShows?: ShowThumbRestValue[];
  thumbUpEpisodes?: number[];
  thumbUpShows?: ShowThumbRestValue[];
}

/** TalkStationRestValueList */
export type TalkStationRestValueList = ResponseObject & {
  badShowSingletonInstance?: TalkStationRestValueList;
  defaultSingletonInstance?: TalkStationRestValueList;
  noEpisodesSingletonInstance?: TalkStationRestValueList;
  notFoundSingletonInstance?: TalkStationRestValueList;
  /** @format int64 */
  profileId?: number;
  talkStations?: TalkStationRestValue[];
};

/** TalkThemeResponse */
export type TalkThemeResponse = BaseResponse & {
  /** @format int64 */
  dateCreated?: number;
  /** @format int64 */
  dateUpdated?: number;
  description?: string;
  /** @format int32 */
  globalRank?: number;
  shows?: ShowResponse[];
  slug?: string;
};

/** TalkThemeRestValue */
export interface TalkThemeRestValue {
  /** @format int64 */
  dateCreated?: number;
  /** @format int64 */
  dateUpdated?: number;
  defaultTalkThemeRestValue?: TalkThemeRestValue;
  description?: string;
  /** @format int32 */
  globalRank?: number;
  /** @format int32 */
  id?: number;
  imagePath?: string;
  name?: string;
  /** @format double */
  score: number;
  shows?: ShowRestValue[];
  slug?: string;
}

/** TasteProfileRV */
export interface TasteProfileRV {
  /** the fbArtistLikes */
  fbArtistLikes?: number[];
  /** the fbLiveStationLikes */
  fbLiveStationLikes?: number[];
  /** the genreIds */
  genreIds?: number[];
  /**
   * the profileId
   * @format int64
   */
  profileId: number;
  /** the stationThumbs */
  stationThumbs?: ThumbTO[];
  /** the bannedArtistIds */
  suppressedArtists?: Record<string, SuppressedArtistRV[]>;
}

/** TasteProfileResponseRV */
export type TasteProfileResponseRV = ResponseObjectV2 & {
  /** the tasteProfile */
  value?: TasteProfileRV;
};

/** Success message */
export type TestFbOauthData = UpdateOauthCredResponse;

export interface TestFbOauthPayload {
  accessToken?: string;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  oauthUuid?: string;
}

/** @format binary */
export type ThumbData = File;

/** an object representing the results of the operation */
export type ThumbDownEpisodeData = ImmutableResultRestValue;

export interface ThumbDownEpisodePayload {
  /**
   * the current play position in seconds
   * @format int32
   */
  elapsedTime: number;
  /**
   * the episode Id #required#
   * @format int32
   */
  episodeId: number;
  host?: string;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
   * (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /** #required# */
  sessionId?: string;
}

/** an object representing the results of the operation */
export type ThumbDownTrackData = ResultRestValue;

export interface ThumbDownTrackPayload {
  /**
   * - host name (example: desktop.app.thumbplay.com,
   * mobile.app.thumbplay.com etc..)
   */
  host?: string;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is
   * LR, 400-499 is CR Anon, 500-599 is CT (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /**
   * #required#
   * @format int64
   */
  profileId: number;
  /** #required# */
  sessionId?: string;
  /** - you can specify multiple track ids to thumb #required# */
  trackId?: number[];
}

export interface ThumbPayload {
  /**
   * the id of the piece of content
   * @format int32
   */
  contentId?: number;
  /**
   * id from where it was played from
   * @format int32
   */
  playedFrom?: number;
  /**
   * seconds the piece of content has been played
   * @format int32
   */
  secondsPlayed?: number;
  /** the id of the station that the content is playing on */
  stationId?: string;
  /** RADIO,TALK or LIVE */
  stationType?:
    | 'ARTIST'
    | 'CLIP'
    | 'COLLECTION'
    | 'FAVORITES'
    | 'LIVE'
    | 'N4U'
    | 'PODCAST'
    | 'RADIO'
    | 'TALK'
    | 'TALKSHOW'
    | 'TALKTHEME'
    | 'TRACK';
  /** UP or DOWN */
  thumbDirection?: 'DOWN' | 'UP';
}

/** ThumbTO */
export interface ThumbTO {
  /** @format int32 */
  contentId: number;
  contentTO?: IContentTO;
  /** @format int64 */
  lastModifiedDate?: number;
  parentId?: string;
  /** @format int64 */
  profileId: number;
  state?: ThumbType;
  stationId?: string;
  stationType?: StationEnum;
}

/** ThumbType */
export enum ThumbType {
  UP = 'UP',
  DOWN = 'DOWN',
}

/** an object representing the results of the operation */
export type ThumbUpEpisodeData = ImmutableResultRestValue;

export interface ThumbUpEpisodePayload {
  /**
   * the current play position in seconds
   * @format int32
   */
  elapsedTime: number;
  /**
   * the episode Id #required#
   * @format int32
   */
  episodeId: number;
  host?: string;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
   * (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /** #required# */
  sessionId?: string;
}

/** an object representing the results of the operation */
export type ThumbsDownTrackData = ResultRestValue;

export interface ThumbsDownTrackPayload {
  /**
   * host name (example: desktop.app.thumbplay.com,
   * mobile.app.thumbplay.com etc..)
   */
  host?: string;
  /** - a new station is created with this name if it does not exist */
  liveRadioStationName?: string;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is
   * LR, 400-499 is CR Anon, 500-599 is CT (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /** @format int64 */
  profileId: number;
  /** #required# */
  sessionId?: string;
  /** - you can specify multiple track ids to thumb #required# */
  trackId?: number[];
}

export type ThumbsResetTrack2Data = ResultRestValue;

export interface ThumbsResetTrack2Payload {
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  /** - you can specify multiple track ids to thumbs reset */
  trackId?: number[];
}

/** an object representing the results of the operation */
export type ThumbsResetTrackData = ResultRestValue;

export interface ThumbsResetTrackPayload {
  /** @format int64 */
  profileId: number;
  sessionId?: string;
  /** - you can specify multiple track ids to thumbs reset */
  trackId?: number[];
}

/** an object representing the results of the operation */
export type ThumbsUpTrack2Data = ResultRestValue;

export interface ThumbsUpTrack2Payload {
  /**
   * - host name (example: desktop.app.thumbplay.com,
   * mobile.app.thumbplay.com etc..)
   */
  host?: string;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is
   * LR, 400-499 is CR Anon, 500-599 is CT (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /**
   * #required#
   * @format int64
   */
  profileId: number;
  /** #required# */
  sessionId?: string;
  /** - you can specify multiple track ids to thumb #required# */
  trackId?: number[];
}

/** an object representing the results of the operation */
export type ThumbsUpTrackData = ResultRestValue;

export interface ThumbsUpTrackPayload {
  /**
   * - host name (example: desktop.app.thumbplay.com,
   * mobile.app.thumbplay.com etc..)
   */
  host?: string;
  /** - a new station is created with this name if it does not exist */
  liveRadioStationName?: string;
  /**
   * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is
   * LR, 400-499 is CR Anon, 500-599 is CT (custom talk)
   * @format int32
   */
  playedFrom?: number;
  /** @format int64 */
  profileId: number;
  /** #required# */
  sessionId?: string;
  /** - you can specify multiple track ids to thumb #required# */
  trackId?: number[];
}

/**
 * status of operation.
 * @format binary
 */
export type ToggleSuppressArtistForStationData = File;

export interface ToggleSuppressArtistForStationPayload {
  /** if true, artist will be suppressed, otherwise will be reset. */
  suppress: boolean;
}

/** TokenResponse */
export type TokenResponse = ResponseObject & {
  token?: string;
};

/** list of tracks sorted by popularity */
export type TopSongsData = SearchResponse;

export interface TopSongsParams {
  /**
   * ISO Country code. This should be the country code that is
   * returned from the login call.
   * @default "US"
   */
  countryCode?: string;
  /**
   * filter by genre id
   * @format int32
   */
  genreId?: number;
  /**
   * max number of tracks to return
   * @format int32
   * @default "10"
   */
  maxRows?: number;
  /** @format int32 */
  vendorGenreId?: number;
}

/** TopStationResponse */
export type TopStationResponse = BaseResponse & {
  artistName?: string;
  /** @format int32 */
  artistSeed?: number;
  /** @format int32 */
  featuredStationId?: number;
  featuredStationName?: string;
  /** @format int32 */
  liveStationId?: number;
  liveStationName?: string;
  trackBundleName?: string;
  trackName?: string;
  /** @format int32 */
  trackSeed?: number;
  type?: RadioType;
};

/** TrackBundleResponse */
export type TrackBundleResponse = BaseTrackResponse & {
  /** @format int32 */
  albumRank?: number;
  albumType?: string;
  allowStreaming: boolean;
  calculatedType?: string;
  currencyCode?: string;
  explicitLyrics?: boolean;
  /** @format int32 */
  fileSize: number;
  genre?: string;
  /** @format int32 */
  genreId?: number;
  largeAlbumCover?: string;
  mediumAlbumCover?: string;
  /** @format int32 */
  numberOfTracks: number;
  /** @format int32 */
  numberOfVolumes: number;
  recordLabelRestValue?: RecordLabelRestValue;
  /** @format int64 */
  releaseDate?: number;
  rightsAllowed: boolean;
  smallAlbumCover?: string;
  trackBundleType?: string;
  trackOnly: boolean;
  tracks?: TrackResponse[];
};

/** TrackBundleRestValue */
export interface TrackBundleRestValue {
  /** @format int32 */
  albumId: number;
  /** @format int32 */
  albumRank?: number;
  albumType?: string;
  allowStreaming: boolean;
  artist?: string;
  /** @format int32 */
  artistId: number;
  calculatedType?: string;
  copyright?: string;
  currencyCode?: string;
  explicitLyrics?: boolean;
  /** @format int32 */
  fileSize: number;
  genre?: string;
  /** @format int32 */
  genreId?: number;
  imagePath?: string;
  largeAlbumCover?: string;
  mediumAlbumCover?: string;
  /** @format int32 */
  numberOfTracks: number;
  /** @format int32 */
  numberOfVolumes: number;
  /** @format int32 */
  rank?: number;
  recordLabelRestValue?: RecordLabelRestValue;
  /** @format int64 */
  releaseDate?: number;
  rightsAllowed: boolean;
  /** @format float */
  score: number;
  /** @format float */
  searchScore: number;
  smallAlbumCover?: string;
  streamReady: boolean;
  title?: string;
  trackBundleType?: string;
  trackOnly: boolean;
  tracks?: TrackRestValue[];
  version?: string;
}

/** TrackHistoryParentRestValue */
export interface TrackHistoryParentRestValue {
  artistName?: string;
  artistRadio?: boolean;
  /** @format int32 */
  artistSeed?: number;
  /** @format int64 */
  dateLong?: number;
  dateString?: string;
  eventTracks?: TrackHistoryTrackRestValue[];
  /** @format int32 */
  featuredStationId?: number;
  id?: string;
  parentExists: boolean;
  stationType?: RadioType;
  title?: string;
  /** @format int32 */
  trackSeed?: number;
  type?: PlayedFromContextType;
}

/** TrackHistoryRestValue */
export type TrackHistoryRestValue = ResponseObject & {
  events?: TrackHistoryParentRestValue[];
  /** @format int64 */
  firstEventTime: number;
  /** @format int64 */
  lastEventTime: number;
};

/** TrackHistoryTrackRestValue */
export interface TrackHistoryTrackRestValue {
  album?: string;
  /** @format int32 */
  albumId?: number;
  /** @format int32 */
  artistId?: number;
  artistName?: string;
  /** @format int64 */
  dateLong?: number;
  dateString?: string;
  explicitLyrics?: boolean;
  hotness?: number;
  imagePath?: string;
  /** @format int32 */
  lyricsId?: number;
  previewPath?: string;
  title?: string;
  /** @format int32 */
  trackDuration?: number;
  /** @format int32 */
  trackId?: number;
  version?: string;
}

/** TrackResponse */
export type TrackResponse = BaseTrackResponse & {
  album?: string;
  artist?: string;
  artistName?: string;
  explicitLyrics?: boolean;
  externalTrackId?: string;
  /** @format int64 */
  lastUpdated?: number;
  /** @format int32 */
  lyricsId?: number;
  modifyArt: boolean;
  previewPath?: string;
  recordLabel?: RecordLabelRestValue;
  sources?: SourceMetaData[];
  testing?: Record<string, object>;
  /** @format int32 */
  trackDuration?: number;
};

/** TrackRestLiteValue */
export interface TrackRestLiteValue {
  album?: string;
  /** @format int32 */
  albumId?: number;
  /** @format int32 */
  artistId?: number;
  artistName?: string;
  explicitLyrics?: boolean;
  hashedTrackId?: string;
  /** @format double */
  hotness: number;
  imagePath?: string;
  /** @format int32 */
  lyricsId?: number;
  previewPath?: string;
  /** @format int32 */
  rank?: number;
  /** @format float */
  score: number;
  sources?: string[];
  title?: string;
  /** @format int32 */
  trackDuration?: number;
  /** @format int32 */
  trackId?: number;
  version?: string;
}

/** TrackRestValue */
export interface TrackRestValue {
  album?: string;
  albumCalculatedType?: string;
  /** @format int32 */
  albumId: number;
  /** @format int32 */
  albumNrOfVolumes: number;
  artist?: string;
  /** @format int32 */
  artistId: number;
  artistName?: string;
  copyright?: string;
  explicitLyrics?: boolean;
  externalTrackId?: string;
  /** @format float */
  familiarity: number;
  /** @format float */
  hotness: number;
  imagePath?: string;
  /** @format int64 */
  lastUpdated?: number;
  /** @format int32 */
  lyricsId: number;
  modifyArt: boolean;
  playbackRights?: PlaybackRightsRestValue;
  /** @format int32 */
  popularity: number;
  previewPath?: string;
  /** @format int32 */
  rank?: number;
  recordLabel?: RecordLabelRestValue;
  /** @format float */
  score: number;
  /** @format float */
  searchScore: number;
  /** @format int32 */
  sortOrder: number;
  streamReady: boolean;
  title?: string;
  /** @format int32 */
  trackDuration: number;
  /** @format int32 */
  trackId: number;
  /** @format int32 */
  trackNumber: number;
  version?: string;
  /** @format int32 */
  volumeNumber: number;
}

export type TransferAccessTokenData = UpdateOauthCredResponse;

export interface TransferAccessTokenPayload {
  /**
   * the profile id we want to transfer oauth credentials 'to'
   * @format int64
   */
  destProfileId: number;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, microsoft, google, gigya */
  oauthType?: string;
  /**
   * the profile id we want to transfer oauth credentials 'from'
   * @format int64
   */
  srcProfileId: number;
}

/** Type */
export enum Type {
  THUMB = 'THUMB',
  MULTISEED = 'MULTISEED',
  SEED = 'SEED',
  ALBUMTOSTART = 'ALBUMTOSTART',
  FAVORITE_TRACK_STATIONCREATE = 'FAVORITE_TRACK_STATIONCREATE',
  FAVORITE_ARTIST_STATIONCREATE = 'FAVORITE_ARTIST_STATIONCREATE',
  TRACK_STATIONCREATE = 'TRACK_STATIONCREATE',
  ARTIST_STATIONCREATE = 'ARTIST_STATIONCREATE',
  SIMILAR_ARTISTS = 'SIMILAR_ARTISTS',
  FEATRED_STATION_FROM_GENRE = 'FEATRED_STATION_FROM_GENRE',
  N4U = 'N4U',
  GENERATED_BACKFILL = 'GENERATED_BACKFILL',
  USER_SELECTED = 'USER_SELECTED',
}

/** UnifiedRecommendationsRestValue */
export type UnifiedRecommendationsRestValue = ResponseObjectV2 & {
  /** @format int64 */
  profileId: number;
  values?: RecommendationElement[];
};

/** Success message */
export type UpdateAccessTokenData = UpdateOauthCredResponse;

export interface UpdateAccessTokenPayload {
  accessToken?: string;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  oauthUuid?: string;
  /**
   * Logged in users profile Id.
   * @format int64
   */
  profileId: number;
  /** Logged in users session id. */
  sessionId?: string;
}

/** UpdateOauthCredResponse */
export type UpdateOauthCredResponse = ResponseObject & {
  success: boolean;
};

/** Success message */
export type UpdateProfileData = SuccessResponse;

export interface UpdateProfilePayload {
  /** - Logged in users's street Address2 */
  streetAddress2?: string;
  /**
   * - Logged in users's birth Day
   * @format int32
   */
  birthDay?: number;
  /**
   * - Logged in users's birth Month
   * @format int32
   */
  birthMonth?: number;
  /**
   * - Logged in users's birth year
   * @format int32
   */
  birthYear?: number;
  /** - Logged in users's city */
  city?: string;
  /** - Logged in users's gender */
  gender?: string;
  /** - Logged in users's Name */
  name?: string;
  /** - Logged in users's phone Number */
  phoneNumber?: string;
  /**
   * - Logged in users's profile id. #required#
   * @format int64
   */
  profileId?: number;
  /** - Logged in users session id. #required# */
  sessionId?: string;
  /** - Logged in users's state */
  state?: string;
  /** - Logged in users's street Address */
  streetAddress?: string;
  /** - Logged in users's user Image */
  userImage?: string;
  /** - Logged in users's zip code */
  zipCode?: string;
}

export type UpdatePw2Data = ResetPwResponse;

export interface UpdatePw2Payload {
  email?: string;
  password?: string;
}

/** Success message */
export type UpdatePwData = UpdatePwResponse;

export interface UpdatePwPayload {
  newPw?: string;
  oldPw?: string;
  /**
   * Logged in users profile Id.
   * @format int64
   */
  profileId: number;
  /** Logged in users session id. */
  sessionId?: string;
}

/** UpdatePwResponse */
export type UpdatePwResponse = ResponseObject & {
  success: boolean;
};

/** a create user response */
export type UpgradeAnonAccountData = CreateUserResponse;

export interface UpgradeAnonAccountPayload {
  /** the device token */
  accessToken?: string;
  /** options: ihr, fb, ihr_fb, gplus, amzn, twtr, anon, microsoft, google, gigya */
  accessTokenType?: string;
  /**
   * the birthyear
   * @format int32
   */
  birthYear?: number;
  /** the device id */
  deviceId?: string;
  /** the device name */
  deviceName?: string;
  /**
   * whether the user should be opted out of email
   * @format int32
   */
  emailOptOut?: number;
  /** the gender */
  gender?: string;
  /** the host */
  host: string;
  /** the oauth uuid */
  oauthUuid?: string;
  /** the password */
  password?: string;
  /**
   * the profile id
   * @format int64
   */
  profileId: number;
  /** the session id */
  sessionId?: string;
  /**
   * the terms acceptance date
   * @format int64
   */
  termsAcceptanceDate?: number;
  /** the username/email */
  userName?: string;
  /** the zipcode */
  zipCode?: string;
}

export type UserExistsData = UserExistsResponse;

export interface UserExistsParams {
  /** Access Token Type */
  accessTokenType?: string;
  host?: string;
  /** OAuth UUID */
  oauthUuid?: string;
  /** Users email address */
  userName?: string;
}

/** UserExistsResponse */
export type UserExistsResponse = ResponseObject & {
  exists: boolean;
};

/** UserFavoritesRestValue */
export interface UserFavoritesRestValue {
  /** the station id */
  id?: string;
  /** the station type */
  type?: PlayedFromContextType;
}

/** UserFavoritesRestValueInput */
export interface UserFavoritesRestValueInput {
  /** the favorites */
  favorites?: UserFavoritesRestValue[];
}

/** UserProfileResponse */
export interface UserProfileResponse {
  profileServiceResult?: AmwProfileBean;
}

/** UserProfileRestValue */
export type UserProfileRestValue = ResponseObject & {
  streetAddress2?: string;
  /** @format int64 */
  accountCreationDate?: number;
  accountType?: AccountType;
  amazonId?: string;
  appleId?: string;
  /** @format int64 */
  birthDate?: number;
  /** @format int32 */
  birthDay?: number;
  /** @format int32 */
  birthMonth?: number;
  /** @format int32 */
  birthYear?: number;
  city?: string;
  customNews?: boolean;
  customTraffic?: boolean;
  customWeather?: boolean;
  eligibleExperiments?: string[];
  /** the email */
  email?: string;
  facebookId?: string;
  /** the favorites */
  favorites?: UserFavoritesRestValue[];
  fbLocation?: string;
  friends?: FacebookFriendsRestValue[];
  gender?: string;
  googlePlusId?: string;
  homeTown?: string;
  /** the iheartId */
  iheartId?: string;
  marketName?: string;
  microsoftId?: string;
  mixinSwitch?: boolean;
  mixinZipcode?: string;
  name?: string;
  phoneNumber?: string;
  preferences?: Record<string, string>;
  presetData?: Record<string, PresetKeyRestValue[]>;
  /** the presets */
  presets?: PresetKeyRestValue[];
  /** @format int64 */
  profileId?: number;
  roaming?: boolean;
  /** @format int32 */
  shareProfile?: number;
  state?: string;
  streetAddress?: string;
  talkNews?: boolean;
  talkTraffic?: boolean;
  talkWeather?: boolean;
  /** @format int64 */
  termsAcceptanceDate?: number;
  twitterId?: string;
  userImage?: string;
  zipCode?: string;
};

/** UserSkipsTO */
export interface UserSkipsTO {
  /** @format int32 */
  daySkipsRemaining?: number;
  /** @format int32 */
  hourSkipsRemaining?: number;
}

/** UtteranceTO */
export interface UtteranceTO {
  primary: boolean;
  utterance?: string;
}

/** ValidateIPRestValue */
export type ValidateIPRestValue = ResponseObject & {
  city?: string;
  countryCode?: string;
  ipAddress?: string;
  isAllowed?: boolean;
  latitude?: number;
  longitude?: number;
  state?: string;
  zipCode?: string;
};

/** ValidateIPRestValue */
export type ValidateIpData = ValidateIPRestValue;

export interface ValidateIpParams {
  /** User's IP address #required# */
  ip?: string;
}

/** ValidateOauthResponse */
export type ValidateOauthResponse = ResponseObject & {
  accessToken?: string;
  /** @format int64 */
  profileId: number;
  userName?: string;
  uuid?: string;
};

/** VarietyType */
export enum VarietyType {
  TOP_HITS = 'TOP_HITS',
  MIX = 'MIX',
  VARIETY = 'VARIETY',
}

/** Void */
export type Void = object;

export namespace V1 {
  /**
   * @description Adds a station to a users set of saved stations. </br></br>
   * @tags live radio
   * @name AddLiveRadioStation
   * @request POST:/api/v1/liveRadio/{ownerProfileId}/add
   * @deprecated
   * @response `201` `AddLiveRadioStationData`
   * @response `400` `void` 2: user.logged.out
   * @response `409` `void` 1: not modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace AddLiveRadioStation {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AddLiveRadioStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = AddLiveRadioStationData;
  }

  /**
   * @description Create and save a radio station by passing in one of: artistId, trackId. Featured stations are no longer supported.
   * @tags custom radio
   * @name AddRadioStation
   * @request POST:/api/v1/radio/{ownerProfileId}/add
   * @deprecated
   * @response `201` `AddRadioStationData` a JSON array of this user's radio stations.
   */
  export namespace AddRadioStation {
    export type RequestParams = {
      /**
       * (Required) the profile id of the person that owns the resource
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AddRadioStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = AddRadioStationData;
  }

  /**
   * @description Adds a show to a stored custom talk station. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>601</td> <td>400</td> <td>Show doesn't exist</td> </tr> </table>
   * @tags talk radio
   * @name AddShowToStation
   * @request POST:/api/v1/talk/{ownerProfileId}/{talkStationId}/{showId}/addShowToStation
   * @deprecated
   * @response `201` `AddShowToStationData` an object representing the results of the operation
   */
  export namespace AddShowToStation {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      /**
       * #required#
       * @format int32
       */
      showId: number;
      /** #required# */
      talkStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AddShowToStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = AddShowToStationData;
  }

  /**
   * @description Create and save a talk station by passing theme id or show id</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>5</td> <td>404</td> <td>Not found</td> </tr> <tr> <td>603</td> <td>404</td> <td>No episodes remaining for this station</td> </tr> <tr> <td>607</td> <td>404</td> <td>Invalid theme or show used as seed</td> </tr> </table>
   * @tags talk radio
   * @name AddThemeStation
   * @request POST:/api/v1/talk/{ownerProfileId}/add
   * @deprecated
   * @response `201` `AddThemeStationData` a JSON array of this user's talk stations.
   */
  export namespace AddThemeStation {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AddThemeStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = AddThemeStationData;
  }

  /**
   * @description Used to change a users login email
   * @tags account
   * @name ChangeEmail
   * @request POST:/api/v1/account/changeEmail
   * @response `201` `ChangeEmailData`
   * @response `400` `void` 2: user.logged.out
   */
  export namespace ChangeEmail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangeEmailPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangeEmailData;
  }

  /**
   * @description Creates a user with for the host. - If deviceName and deviceId are present, then a session will also be returned. - If password is empty (or null) and isGeneratePassword is true, then password will be autogenerated.
   * @tags account
   * @name CreateUser
   * @request POST:/api/v1/account/createUser{trackingParams}
   * @response `200` `CreateUserData` Everything is OK.
   * @response `400` `void` 6: invalid.host
   * @response `403` `void` 118: country.not.supported
   * @response `500` `void` 114: service.fb.unavailable
   */
  export namespace CreateUser {
    export type RequestParams = {
      trackingParams: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateUserPayload;
    export type RequestHeaders = {
      'Fastly-Client-IP'?: string;
      'User-Agent'?: string;
      'X-GEO-CITY'?: string;
      'X-GEO-COUNTRY': string;
      'X-GEO-DMA'?: string;
      /** @format double */
      'X-GEO-LAT'?: number;
      /** @format double */
      'X-GEO-LNG'?: number;
    };
    export type ResponseBody = CreateUserData;
  }

  /**
   * @description Delete Device Associated with the given User. Either authHeader or uuid is required. </br>
   * @tags profile
   * @name DeleteDeviceProfile
   * @request POST:/api/v1/profile/removeDeviceProfile
   * @response `201` `DeleteDeviceProfileData` ResetDeviceTokenRestValue User's Device Token Configuration
   * @response `500` `void` 1: service.unavailable
   */
  export namespace DeleteDeviceProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DeleteDeviceProfilePayload;
    export type RequestHeaders = {
      /** XBL2.0 or XBL3.0 custom auth header from XBOX */
      Authorization?: string;
    };
    export type ResponseBody = DeleteDeviceProfileData;
  }

  /**
   * @description Removes a station to a users set of saved stations </br></br> </br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> </table>
   * @tags live radio
   * @name DeleteLiveRadioStation
   * @request POST:/api/v1/liveRadio/{ownerProfileId}/{liveRadioStationId}/remove
   * @deprecated
   * @response `201` `DeleteLiveRadioStationData`
   */
  export namespace DeleteLiveRadioStation {
    export type RequestParams = {
      /**
       * #required#
       * @format int32
       */
      liveRadioStationId: number;
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = DeleteLiveRadioStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteLiveRadioStationData;
  }

  /**
   * @description Remove a custom radio stations that the user has saved.
   * @tags custom radio
   * @name DeleteRadioStation
   * @request POST:/api/v1/radio/{ownerProfileId}/{radioStationId}/remove
   * @deprecated
   * @response `201` `DeleteRadioStationData`
   */
  export namespace DeleteRadioStation {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      radioStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DeleteRadioStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteRadioStationData;
  }

  /**
   * @description Remove a custom talk stations that the user has saved. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> </table>
   * @tags talk radio
   * @name DeleteRadioStation2
   * @request POST:/api/v1/talk/{ownerProfileId}/{talkStationId}/remove
   * @deprecated
   * @response `201` `DeleteRadioStation2Data` an object representing the results of the operation
   */
  export namespace DeleteRadioStation2 {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      /** #required# */
      talkStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DeleteRadioStation2Payload;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteRadioStation2Data;
  }

  /**
   * @description Deletes given user
   * @tags customer care
   * @name DeleteUser
   * @request POST:/api/v1/secure/cc/deleteUser
   * @response `201` `DeleteUserData`
   * @response `400` `void` 101: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace DeleteUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DeleteUserPayload;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteUserData;
  }

  /**
   * @description Entered by the web. This associates an account with a 3rd party device. Should be called after getCode, passing the code that getCode returned.
   * @tags account
   * @name EnterCode
   * @request POST:/api/v1/account/enterCode
   * @response `2` `void` 2: user.logged.out
   * @response `125` `void` 400: duplicate.device
   * @response `201` `EnterCodeData`
   * @response `500` `void` 1: service.unavailable
   * @response `802` `void` 400: invalid.code.exception
   * @response `804` `void` 400: code.already.validated
   */
  export namespace EnterCode {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EnterCodePayload;
    export type RequestHeaders = {};
    export type ResponseBody = EnterCodeData;
  }

  /**
   * @description Exchange a profile/session pair for an auth token
   * @tags account
   * @name ExchangeSessionForToken
   * @request POST:/api/v1/account/getLoginToken
   * @response `201` `ExchangeSessionForTokenData` the token response
   * @response `400` `void` 2: user.logged.out
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ExchangeSessionForToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /**
       * the profile id
       * @format int64
       */
      profileId: number;
      /** the session id */
      sessionId?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = ExchangeSessionForTokenData;
  }

  /**
   * @description Retrieve the set of albums for the specified artist. Order by Release date.</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name FindAlbumsByArtistIdSearch
   * @request GET:/api/v1/catalog/artist/{artistId}/getAlbums
   * @deprecated
   * @response `200` `FindAlbumsByArtistIdSearchData` Artist Albums
   */
  export namespace FindAlbumsByArtistIdSearch {
    export type RequestParams = {
      /**
       * artist identifier
       * @format int32
       */
      artistId: number;
    };
    export type RequestQuery = {
      clientRequestId?: string;
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /**
       * max number of records to return (default MAX_ROWS)
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * start index (zero based)
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindAlbumsByArtistIdSearchData;
  }

  /**
   * @description Find artist by identifier. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>306</td> <td>400</td> <td>bad.param.artist.id</td> </tr> </table>
   * @tags catalog
   * @name FindArtistById
   * @request GET:/api/v1/catalog/getArtistByArtistId
   * @deprecated
   * @response `200` `FindArtistByIdData` artist details
   */
  export namespace FindArtistById {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * artist identifier #required#
       * @format int32
       */
      artistId: number;
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      /**
       * If the bio for each artist should be included
       * @default "true"
       */
      includeBio?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindArtistByIdData;
  }

  /**
   * @description Find track by identifier
   * @tags catalog
   * @name FindTrackById
   * @request GET:/api/v1/catalog/getTrackByTrackId
   * @deprecated
   * @response `200` `FindTrackByIdData` track details
   * @response `400` `void` 303: missing.param.rule.criterias
   * @response `500` `void` 1: service.unavailable
   */
  export namespace FindTrackById {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      /**
       * #required#
       * @format int32
       */
      trackId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindTrackByIdData;
  }

  /**
   * @description Find track by identifier internal. This method will return streamurl along with track info.
   * @tags catalog
   * @name FindTrackByIdWithStreamUrl
   * @request GET:/api/v1/catalog/internal/getTrackByTrackId
   * @deprecated
   * @response `200` `FindTrackByIdWithStreamUrlData` track details
   * @response `400` `void` 303: missing.param.rule.criterias
   * @response `500` `void` 1: service.unavailable
   */
  export namespace FindTrackByIdWithStreamUrl {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      /**
       * #required#
       * @format int32
       */
      trackId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindTrackByIdWithStreamUrlData;
  }

  /**
   * @description Retrieve Tracks for the specified artist. Results returned in popularity order.
   * @tags catalog
   * @name FindTracksByArtistIdSearch
   * @request GET:/api/v1/catalog/artist/{artistId}/getTracks
   * @deprecated
   * @response `200` `FindTracksByArtistIdSearchData` artist's tracks
   * @response `500` `void` 1: service.unavailable
   */
  export namespace FindTracksByArtistIdSearch {
    export type RequestParams = {
      /**
       * artist identifier
       * @format int32
       */
      artistId: number;
    };
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /**
       * max number of records to return (default MAX_ROWS)
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * start index (zero based)
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FindTracksByArtistIdSearchData;
  }

  /**
   * @description Sends password reset access token.(user will receive an email)
   * @tags account
   * @name GenerateResetPasswordEmail
   * @request POST:/api/v1/account/generateResetPwEmail
   * @response `201` `GenerateResetPasswordEmailData` Success message
   * @response `400` `void` 101: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GenerateResetPasswordEmail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /** @default "false" */
      includeLogin?: boolean;
      redirectUrl?: string;
      /** Request user name. */
      userName?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = GenerateResetPasswordEmailData;
  }

  /**
   * @description List of available genres Genres including visibility and sort-order information <br/> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags catalog
   * @name Genre
   * @request GET:/api/v1/catalog/getGenres
   * @deprecated
   * @response `200` `GenreData` genres
   */
  export namespace Genre {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GenreData;
  }

  /**
   * @description Get all PRN show </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags prn
   * @name GetAllShows
   * @request GET:/api/v1/prn/getAllShows
   * @response `200` `GetAllShowsData` one PRN show with details
   */
  export namespace GetAllShows {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllShowsData;
  }

  /**
   * @description Get artists for the specified categories</br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>301</td> <td>400</td> <td>missing.param.ids</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>303</td> <td>400</td> <td>missing.param.rule.criterias</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name GetArtistsFromCategories
   * @request GET:/api/v1/catalog/getArtistsByCategories
   * @deprecated
   * @response `200` `GetArtistsFromCategoriesData` category artists
   */
  export namespace GetArtistsFromCategories {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ?categoryId=1&categoryId=2&...#required# */
      categoryId?: number[];
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      /**
       * If the bio for each artist should be included
       * @default "true"
       */
      includeBio?: boolean;
      /**
       * max number of records to return (default MAX_ROWS)
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * start index (zero based)
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetArtistsFromCategoriesData;
  }

  /**
   * @description Gets the list of all talk categories. </br><br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags talk radio
   * @name GetCategories
   * @request GET:/api/v1/talk/getCategories
   * @deprecated
   * @response `200` `GetCategoriesData` an object representing the results of the operation
   */
  export namespace GetCategories {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * - Deprecated: Defaults to false.
       * @default "false"
       */
      includeShows?: boolean;
      /**
       * - sort shows by NAME or POPULARITY. Defaults to NAME.
       * @default "NAME"
       */
      showSortKey?: 'NAME' | 'POPULARITY';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCategoriesData;
  }

  /**
   * @description Gets the list of talk categories for given categoryIds. </br><br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags talk radio
   * @name GetCategory
   * @request GET:/api/v1/talk/getCategory
   * @deprecated
   * @response `200` `GetCategoryData` an object representing the results of the operation
   */
  export namespace GetCategory {
    export type RequestParams = {};
    export type RequestQuery = {
      /** - List of category ids #required# */
      categoryId?: number[];
      /**
       * - Include shows in response? Defaults to true if not passed by clients.
       * @default "true"
       */
      includeShows?: boolean;
      /**
       * - sort shows by NAME or POPULARITY. Defaults to NAME.
       * @default "NAME"
       */
      showSortKey?: 'NAME' | 'POPULARITY';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCategoryData;
  }

  /**
   * @description Retrieve client config properties (all).
   * @tags bootstrap
   * @name GetClientConfig
   * @request GET:/api/v1/bootstrap/getClientConfig
   * @response `200` `GetClientConfigData`
   */
  export namespace GetClientConfig {
    export type RequestParams = {};
    export type RequestQuery = {
      /** #required# */
      clientVersion?: string;
      /** #required# */
      deviceName?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetClientConfigData;
  }

  /**
   * @description First step in creating an 3rd party account.<br/> <p/> This call returns a code to the 3rd party application. <br/> The device should show this code to the user. The user then needs to enter this code on the web. Web will call enterCode which will associate this code with a Clearchannel account. <br/> The device can call getStatus to see if the user has been associated yet. <br/> <br/>
   * @tags account
   * @name GetCode
   * @request GET:/api/v1/account/getCode
   * @response `116` `void` 400: invalid.device
   * @response `125` `void` 400: duplicate.device
   * @response `200` `GetCodeData`
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetCode {
    export type RequestParams = {};
    export type RequestQuery = {
      /** key associated with that sepecific device */
      deviceType?: string;
      /** User id from 3rd party system */
      externalUuid?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCodeData;
  }

  /**
   * No description
   * @tags account
   * @name GetCodeForXbox
   * @request POST:/api/v1/account/getCode
   * @response `201` `GetCodeForXboxData`
   * @response `801` `void` 401: xbox.invalid.saml.exception
   */
  export namespace GetCodeForXbox {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** XBL2.0 or XBL3.0 custom auth header from XBOX */
      Authorization?: string;
    };
    export type ResponseBody = GetCodeForXboxData;
  }

  /**
   * @description Finds the best custom stations for a group of artists.
   * @tags recs
   * @name GetCustStationRecsByArtists
   * @request GET:/api/v1/recs/getBestCustRadioStationsByArtist
   * @deprecated
   * @response `200` `GetCustStationRecsByArtistsData` List of custom stations recommended for input artists.
   * @response `400` `void` 400: invalid.parameter
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetCustStationRecsByArtists {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Maximum number of live stations to return.  Optional.
       * @format int32
       * @default "10"
       */
      amount?: number;
      /** #list#  One or more artist IDs used to determine suitable live stations.  Required */
      artistId?: number[];
      /**
       * offset from start of list.  Default: 0
       * @format int32
       * @default "0"
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCustStationRecsByArtistsData;
  }

  /**
   * @description Delays for a given number of milliseconds and returns a response with the specified status code
   * @tags debug
   * @name GetCustStationRecsByArtists2
   * @request GET:/api/v1/secure/debug/delay
   * @response `200` `GetCustStationRecsByArtists2Data`
   */
  export namespace GetCustStationRecsByArtists2 {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Milliseconds to sleep for
       * @format int32
       * @default "100"
       */
      delayMillis?: number;
      /**
       * Status code to return
       * @format int32
       * @default "200"
       */
      statusCode?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCustStationRecsByArtists2Data;
  }

  /**
   * @description Finds the best custom stations for a user profile.
   * @tags recs
   * @name GetCustStationRecsByProfile
   * @request GET:/api/v1/recs/{ownerProfileId}/getBestCustRadioStationsByUser
   * @deprecated
   * @response `200` `GetCustStationRecsByProfileData` custom stations suitable for given user.
   * @response `400` `void` 2: user.logged.out
   * @response `401` `void` 401: operaton.not.allowed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetCustStationRecsByProfile {
    export type RequestParams = {
      /**
       * profile ID of owner
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * (optional) maximum number of custom stations to return.
       * @format int32
       * @default "10"
       */
      amount?: number;
      /**
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * profile ID of user
       * @format int64
       */
      profileId: number;
      /** session Id */
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCustStationRecsByProfileData;
  }

  /**
   * @description Retrieve DeviceToken profile for a given profile ID. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> </table>
   * @tags profile
   * @name GetDeviceTokenConfig
   * @request GET:/api/v1/profile/getDeviceTokenConfig
   * @response `200` `GetDeviceTokenConfigData` User's Device Token Configuration
   */
  export namespace GetDeviceTokenConfig {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * - Logged in users's profile id. #required#
       * @format int64
       */
      profileId: number;
      /** - Logged in users session id. #required# */
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDeviceTokenConfigData;
  }

  /**
   * No description
   * @tags customer care
   * @name GetDeviceTokens
   * @request GET:/api/v1/secure/cc/getDeviceTokens
   * @response `200` `GetDeviceTokensData`
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetDeviceTokens {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDeviceTokensData;
  }

  /**
   * @description Get talk episode by episode id </br> </br>Error Codes / Throws
   * @tags talk radio
   * @name GetEpisode
   * @request GET:/api/v1/talk/getEpisode
   * @deprecated
   * @response `200` `GetEpisodeData` episode details
   * @response `400` `void` 302: bad.param.ids
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetEpisode {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ?episodeId=1... #required#
       * @format int32
       */
      episodeId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEpisodeData;
  }

  /**
   * @description Get PRN episode by group id </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags prn
   * @name GetEpisodeByGroup
   * @request GET:/api/v1/prn/getEpisodeByGroup
   * @response `200` `GetEpisodeByGroupData` a list of PRN episode details
   */
  export namespace GetEpisodeByGroup {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Required default 12
       * @format int32
       * @default "12"
       */
      amount?: number;
      /** mm/dd/yyyy Optional */
      endDate?: string;
      /**
       * Boolean. Return the number of episode views as part of the
       * results. Defaults to false. Optional
       * @default "False"
       */
      getViewCounts?: boolean;
      /**
       * Required
       * @format int32
       */
      groupid?: number;
      /**
       * Required default 0
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** mm/dd/yyyy Optional */
      startDate?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEpisodeByGroupData;
  }

  /**
   * @description Get PRN episode by id </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags prn
   * @name GetEpisodeById
   * @request GET:/api/v1/prn/{episodeId}/getEpisodeById
   * @response `200` `GetEpisodeByIdData` a PRN Episode
   */
  export namespace GetEpisodeById {
    export type RequestParams = {
      /**
       * Required
       * @format int32
       */
      episodeId: number;
    };
    export type RequestQuery = {
      /**
       * Boolean. Return the number of episode views as part of the
       * results. Defaults to false. Optional
       * @default "False"
       */
      getViewCounts?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEpisodeByIdData;
  }

  /**
   * @description countEpisodeByGroup</br>
   * @tags prn
   * @name GetEpisodeCountByGroup
   * @request GET:/api/v1/prn/{groupId}/countEpisodeByGroup
   * @response `200` `GetEpisodeCountByGroupData` number of episodes in the given group.
   * @response `400` `void` 301: Missing Parameter: ids
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetEpisodeCountByGroup {
    export type RequestParams = {
      /**
       * group id for which to return the total episode count.
       * @format int32
       * @default "0"
       */
      groupId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEpisodeCountByGroupData;
  }

  /**
   * @description Get PRN episode play count.</br>
   * @tags prn
   * @name GetEpisodePlayCount
   * @request GET:/api/v1/prn/{episodeId}/getEpisodePlayCount
   * @response `200` `GetEpisodePlayCountData` a PRN Episode
   * @response `400` `void` 302: bad.param.ids
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetEpisodePlayCount {
    export type RequestParams = {
      /**
       * Required
       * @format int32
       */
      episodeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEpisodePlayCountData;
  }

  /**
   * @description Gets episode for given episodeId. Also returns stream url for it.
   * @tags talk radio
   * @name GetEpisodeWithStreamUrl
   * @request GET:/api/v1/talk/internal/getEpisode
   * @deprecated
   * @response `200` `GetEpisodeWithStreamUrlData` Returns episode details with stream url
   * @response `400` `void` 302: bad.param.ids
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetEpisodeWithStreamUrl {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Id of the episode to retrieve #required#
       * @format int32
       */
      episodeId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEpisodeWithStreamUrlData;
  }

  /**
   * No description
   * @tags catalog
   * @name GetFavoritesStationById
   * @request GET:/api/v1/catalog/getFavoritesStationById
   * @response `200` `GetFavoritesStationByIdData`
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetFavoritesStationById {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @format int64 */
      id: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
    };
    export type ResponseBody = GetFavoritesStationByIdData;
  }

  /**
   * @description Returns a list of all the talk show history for a user.
   * @tags history
   * @name GetHistoryEvents
   * @request GET:/api/v1/history/{ownerProfileId}/getAll
   * @response `200` `GetHistoryEventsData`
   * @response `400` `void` 2: user.logged.out
   * @response `401` `void` 7: operation.not.allowed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetHistoryEvents {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      campaignId?: string;
      /**
       * @format int32
       * @default "10"
       */
      numResults?: number;
      /** @format int64 */
      profileId: number;
      sessionId?: string;
      /**
       * @format int64
       * @default "0"
       */
      startTime?: number;
      types?: string[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHistoryEventsData;
  }

  /**
   * @description Retrieve client config properties for live radio ads.
   * @tags bootstrap
   * @name GetLiveRadioAdConfig
   * @request GET:/api/v1/bootstrap/getLiveRadioAdConfig
   * @response `200` `GetLiveRadioAdConfigData`
   */
  export namespace GetLiveRadioAdConfig {
    export type RequestParams = {};
    export type RequestQuery = {
      hostName?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLiveRadioAdConfigData;
  }

  /**
   * @description Returns a list of this user saved radio stations</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>3</td> <td>304</td> <td>not.modified</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table> <p/> <p/>
   * @tags live radio
   * @name GetLiveRadioStations
   * @request GET:/api/v1/liveRadio/{ownerProfileId}/all
   * @deprecated
   * @response `200` `GetLiveRadioStationsData`
   */
  export namespace GetLiveRadioStations {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * @format int64
       * @default "0"
       */
      lastModifiedDate?: number;
      /**
       * default is 200
       * @format int32
       */
      limit?: number;
      /**
       * default is 0
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** - NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE */
      orderBy?: 'LAST_PLAYED' | 'NAME' | 'PLAYCOUNT' | 'REGISTERED_DATE';
      /**
       * #required#
       * @format int64
       */
      profileId?: number;
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLiveRadioStationsData;
  }

  /**
   * @description Calls to this API should go through L3, the payload from this Service changes very infrequently. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>701</td> <td>404</td> <td>rec.none</td> </tr> </table>
   * @tags recs
   * @name GetLiveStationRecs
   * @request GET:/api/v1/recs/getLiveRadioStations
   * @response `200` `GetLiveStationRecsData`
   */
  export namespace GetLiveStationRecs {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * #required#
       * @format int32
       */
      liveRadioStationId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLiveStationRecsData;
  }

  /**
   * @description Finds the best live stations for a group of artists.
   * @tags recs
   * @name GetLiveStationRecsByArtists
   * @request GET:/api/v1/recs/getBestLiveRadioStationsByArtist
   * @deprecated
   * @response `200` `GetLiveStationRecsByArtistsData` List of live stations recommended for input artists.
   * @response `400` `void` 400: invalid.parameter
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetLiveStationRecsByArtists {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Maximum number of live stations to return.  Optional, defaults to 10.
       * @format int32
       * @default "10"
       */
      amount?: number;
      /**
       * #list#
       * One or more artist IDs used to determine suitable live stations.  Required
       */
      artistId?: number[];
      /**
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * sort algorithm (AVERAGE | HARMONIC | GEOMETRIC)
       * Optional, defaults to AVERAGE
       * @default "AVERAGE"
       */
      sort?: 'AVERAGE' | 'GEOMETRIC' | 'HARMONIC';
      /**
       * source metric to sort by (CUME | PLAY_COUNT | SCORE_COMBINED), defaults to PLAY_COUNT
       * @default "PLAY_COUNT"
       */
      source?: 'CUME' | 'PLAY_COUNT' | 'SCORE_COMBINED';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLiveStationRecsByArtistsData;
  }

  /**
   * @description Finds the best live stations for a user profile.
   * @tags recs
   * @name GetLiveStationRecsByProfile
   * @request GET:/api/v1/recs/{ownerProfileId}/getBestLiveRadioStationsByUser
   * @deprecated
   * @response `200` `GetLiveStationRecsByProfileData` live stations suitable for given user.
   * @response `400` `void` 400: user.logged.out
   * @response `401` `void` 401: operaton.not.allowed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetLiveStationRecsByProfile {
    export type RequestParams = {
      /**
       * profile ID of owner
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * (optional) maximum number of live stations to return.
       * @format int32
       * @default "10"
       */
      amount?: number;
      /**
       * offset from start of list.  Default: 0
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * profile ID of user
       * @format int64
       */
      profileId: number;
      /** session Id */
      sessionId?: string;
      /**
       * (optional) algorithm that determines best station.  May be (AVERAGE | HARMONIC | GEOMETRIC)
       * @default "AVERAGE"
       */
      sort?: 'AVERAGE' | 'GEOMETRIC' | 'HARMONIC';
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLiveStationRecsByProfileData;
  }

  /**
   * @description Returns a merched list of talk shows ordered by rank </br><br/>
   * @tags talk radio
   * @name GetMerchedTalkShows
   * @request GET:/api/v1/talk/getMerchedTalkShows
   * @deprecated
   * @response `200` `GetMerchedTalkShowsData`
   * @response `500` `void` Service unavailable
   */
  export namespace GetMerchedTalkShows {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * @format int32
       * @default "0"
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMerchedTalkShowsData;
  }

  /**
   * @description Get nearby PRN episodes for a given episode from id </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags prn
   * @name GetNearEpisodes
   * @request GET:/api/v1/prn/{episodeId}/getNearEpisodes
   * @response `200` `GetNearEpisodesData` Two lists (before, after) of PRN Episodes near (in time) to the source episode.
   */
  export namespace GetNearEpisodes {
    export type RequestParams = {
      /** @format int32 */
      episodeId: number;
    };
    export type RequestQuery = {
      /**
       * Total number of rows to return before and after. Total number
       * is maximum of amount * 2. #optional* default 1
       * @format int32
       * @default "1"
       */
      amount?: number;
      /**
       * Boolean. Return the number of episode views as part of the
       * results. Defaults to false. Optional
       * @default "False"
       */
      getViewCounts?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetNearEpisodesData;
  }

  /**
   * @description Gets the next episodes for a station </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>603</td> <td>404</td> <td>No episodes remaining for this station</td> </tr> <tr> <td>5</td> <td>404</td> <td>Station not found</td> </tr> <tr> <td>601</td> <td>400</td> <td>Seed show no longer exists</td> </tr> <tr> <td>602</td> <td>400</td> <td>Seed theme no longer exists</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> </table>
   * @tags talk radio
   * @name GetNextEpisodes
   * @request GET:/api/v1/talk/{ownerProfileId}/{talkStationId}/getNextEpisodes
   * @deprecated
   * @response `200` `GetNextEpisodesData` a JSON array of this user's talk stations.
   */
  export namespace GetNextEpisodes {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
      /** - Override the default talk station name. */
      talkStationId: string;
    };
    export type RequestQuery = {
      /**
       * @format int32
       * @default "3"
       */
      episodesRequested?: number;
      /**
       * -Select if we should return an epiosde by the seed id first.
       * @default "false"
       */
      seedFirst?: boolean;
      /** #required# */
      sessionId?: string;
      /** -Select an episode to play first. */
      startEpisodeId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetNextEpisodesData;
  }

  /**
   * @description Get OAuth Access Token for given UUID/token type
   * @tags customer care
   * @name GetOauthDetailsByUuid
   * @request POST:/api/v1/secure/cc/getAccessToken
   * @response `201` `GetOauthDetailsByUuidData`
   * @response `400` `void` 112: invalid.fbAccessToken
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetOauthDetailsByUuid {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GetOauthDetailsByUuidPayload;
    export type RequestHeaders = {};
    export type ResponseBody = GetOauthDetailsByUuidData;
  }

  /**
   * @description Returns user's public profile. Public profile will only be returned if the requesting user is friends with ProfileOwner. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags profile
   * @name GetPublicProfile
   * @request GET:/api/v1/profile/{ownerProfileId}/getPublicProfile
   * @response `200` `GetPublicProfileData` User's Profile
   */
  export namespace GetPublicProfile {
    export type RequestParams = {
      /**
       * - Logged in users's profileId.
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** @format int64 */
      profileId: number;
      /** - Logged in users sessionId. */
      sessionId?: string;
      /** @default "true" */
      usePeriodDelimiterInPrefKeys?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPublicProfileData;
  }

  /**
   * No description
   * @tags customer care
   * @name GetRadioSession
   * @request GET:/api/v1/secure/cc/sessionTracks
   * @response `200` `GetRadioSessionData`
   * @response `400` `void` 101: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetRadioSession {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * @format int32
       * @default "1"
       */
      numTracks?: number;
      /** @format int64 */
      profileId?: number;
      radioStationId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRadioSessionData;
  }

  /**
   * @description Returns a list of all radio stations saved by the specified user
   * @tags custom radio
   * @name GetRadioStations
   * @request GET:/api/v1/radio/{ownerProfileId}/all
   * @deprecated
   * @response `200` `GetRadioStationsData`
   */
  export namespace GetRadioStations {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * default is 200
       * @format int32
       */
      limit?: number;
      /**
       * default is 0
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** - NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE */
      orderBy?:
        | 'LAST_MODIFIED_DATE'
        | 'LAST_PLAYED'
        | 'NAME'
        | 'PLAYCOUNT'
        | 'REGISTERED_DATE'
        | 'TYPE';
      /** @format int64 */
      profileId: number;
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRadioStationsData;
  }

  /**
   * @description Get PRN show by id </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags prn
   * @name GetShow
   * @request GET:/api/v1/prn/getShow
   * @response `200` `GetShowData` one PRN show with details
   */
  export namespace GetShow {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Required
       * @format int32
       */
      showId?: number;
      /**
       * Optional - Defaults to false. If enabled, the latest episode
       * from each episode group is populated in the epiosodeGroups
       * node.
       * @default "false"
       */
      withVoD?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetShowData;
  }

  /**
   * @description Get talk show by show id </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags talk radio
   * @name GetShow2
   * @request GET:/api/v1/talk/getShow
   * @deprecated
   * @response `200` `GetShow2Data` show details including episodes. Episodes are grouped into 'all', 'full', and 'clips'. Each group is sorted by start date, latest first.
   */
  export namespace GetShow2 {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * max number of episodes to return (default MAX_ROWS) #optional#
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * ?showId=1 #required#
       * @format int32
       */
      showId?: number;
      /**
       * start index (zero based) of associated episodes (default 0) #optional#
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetShow2Data;
  }

  /**
   * @description Get talk show by slug </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> </table>
   * @tags talk radio
   * @name GetShowBySlug
   * @request GET:/api/v1/talk/getShowBySlug
   * @deprecated
   * @response `200` `GetShowBySlugData` show details
   */
  export namespace GetShowBySlug {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * max number of episodes to return (default MAX_ROWS) #optional#
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /** ?slug=1... #required# */
      slug?: string;
      /**
       * start index (zero based) of associated episodes (default 0) #optional#
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetShowBySlugData;
  }

  /**
   * @description Retrieve similar artists of the specified artist.</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags catalog
   * @name GetSimilarArtists
   * @request GET:/api/v1/catalog/artist/{artistId}/getSimilar
   * @response `200` `GetSimilarArtistsData`
   */
  export namespace GetSimilarArtists {
    export type RequestParams = {
      /** @format int32 */
      artistId: number;
    };
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSimilarArtistsData;
  }

  /**
   * @description Finds other artists in same format as input artists.
   * @tags recs
   * @name GetSimilarArtistsByFormat
   * @request GET:/api/v1/recs/getSimilarArtistsByFormat
   * @deprecated
   * @response `200` `GetSimilarArtistsByFormatData`
   * @response `400` `void` 400: invalid.parameter
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetSimilarArtistsByFormat {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Number of artists to return.  Optional.
       * @format int32
       * @default "10"
       */
      amount?: number;
      /** #list# List of artist IDs of which to return similar artists by format. Required. */
      artistIds?: number[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSimilarArtistsByFormatData;
  }

  /**
   * No description
   * @tags subscription
   * @name GetSkipsRemaining
   * @request GET:/api/v1/subscription/skips
   * @deprecated
   * @response `200` `GetSkipsRemainingData`
   * @response `400` `void` 2: user.logged.out
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetSkipsRemaining {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @format int64 */
      profileId: number;
      /** @default "" */
      radioStationId?: string;
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSkipsRemainingData;
  }

  /**
   * @description Find track by identifier <br/>
   * @tags catalog
   * @name GetSlider
   * @request GET:/api/v1/catalog/getSlider
   * @deprecated
   * @response `200` `GetSliderData` track details
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetSlider {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSliderData;
  }

  /**
   * @description Used by the third party to see if the code has been entered by the user. Status is false till the user enters the code.
   * @tags account
   * @name GetStatus
   * @request GET:/api/v1/account/getStatus
   * @response `101` `void` 400: invalid.user
   * @response `200` `GetStatusData`
   * @response `500` `void` 1: service.unavailable
   * @response `802` `void` 400: invalid.code.exception
   */
  export namespace GetStatus {
    export type RequestParams = {};
    export type RequestQuery = {
      code?: string;
      externalUuid?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStatusData;
  }

  /**
   * @description Used by XBOX client to see if the code has been entered by the user.
   * @tags account
   * @name GetStatusForXbox
   * @request POST:/api/v1/account/getStatus
   * @response `201` `GetStatusForXboxData`
   * @response `801` `void` 401: xbox.invalid.saml.exception
   * @response `802` `void` 401: xbox.invalid.user.exception
   */
  export namespace GetStatusForXbox {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GetStatusForXboxPayload;
    export type RequestHeaders = {
      /** XBL2.0 or XBL3.0 custom auth header from XBOX */
      Authorization?: string;
    };
    export type ResponseBody = GetStatusForXboxData;
  }

  /**
   * @description <p> Creates a stream URL for a song. <p/> <p> This API replaces stream-url. It generates the necessary key and removes the need for the client to construct a stream URL </p> <p> If there is a user interaction to start the stream(click play button, click next button,etc...) set userClicked to be true.<br/> Only one user device is eligible to stream at a time. By setting userClicked to true, it will make the current device the active streamer. <br/> If userClicked is false, and the device is not the active streamer, a 199 exception will be thrown. When this happens the user should be notified, and if they click play, this call should be made again with userClicked=true. <br/> <br> playedFrom should be an integer. If the value is between 100 and 199 it will be treated as a free(radio) stream). Values between 200 and 299 will be considered premium streams and only users with premium access will be able to play them.
   * @tags subscription
   * @name GetStreamUrl
   * @request POST:/api/v1/subscription/getStreamUrl
   * @deprecated
   * @response `201` `GetStreamUrlData` A response containing the URL for the content stream and the next player key
   * @response `400` `void` 207: invalid.playedfrom.range
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStreamUrl {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GetStreamUrlPayload;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamUrlData;
  }

  /**
   * No description
   * @tags subscription
   * @name GetStreamUrl2
   * @request GET:/api/v1/subscription/getStreamUrlV2
   * @deprecated
   * @response `200` `GetStreamUrl2Data`
   * @response `400` `void` 207: invalid.playedfrom.range
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStreamUrl2 {
    export type RequestParams = {};
    export type RequestQuery = {
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id': number;
      playerKey?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStreamUrl2Data;
  }

  /**
   * @description Returns Station details saved by the specified user </br></br>
   * @tags talk radio
   * @name GetTalkStationById
   * @request GET:/api/v1/talk/{ownerProfileId}/getTalkStationById
   * @deprecated
   * @response `200` `GetTalkStationByIdData` an object representing the results of the operation
   * @response `400` `void` 2: user.logged.out
   * @response `401` `void` 7: operation.not.allowed
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetTalkStationById {
    export type RequestParams = {
      /**
       * Required.
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * - Include shows in response? Defaults to false if not passed by clients.
       * @default "false"
       */
      includeShows?: boolean;
      /**
       * Required.
       * @format int64
       */
      profileId: number;
      /** Required. */
      sessionId?: string;
      /** Required. */
      talkStationId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTalkStationByIdData;
  }

  /**
   * @description Returns a list of all track stations saved by the specified user </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table>
   * @tags talk radio
   * @name GetTalkStations
   * @request GET:/api/v1/talk/{ownerProfileId}/all
   * @deprecated
   * @response `200` `GetTalkStationsData` an object representing the results of the operation
   */
  export namespace GetTalkStations {
    export type RequestParams = {
      /**
       * required
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * - Include shows in response? Defaults to false if not passed by clients. - True, False; This will
       * include all added and removed complete shows in response
       * @default "false"
       */
      includeShows?: boolean;
      /**
       * default is 200
       * @format int32
       */
      limit?: number;
      /**
       * default is 0
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** - NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE required */
      orderBy?: 'LAST_PLAYED' | 'NAME' | 'PLAYCOUNT' | 'REGISTERED_DATE';
      /**
       * required
       * @format int64
       */
      profileId: number;
      /** required */
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTalkStationsData;
  }

  /**
   * @description Gets talk theme by slug.</br> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> </table>
   * @tags talk radio
   * @name GetTalkThemeBySlug
   * @request GET:/api/v1/talk/getThemeBySlug
   * @deprecated
   * @response `200` `GetTalkThemeBySlugData` an object representing the results of the operation
   */
  export namespace GetTalkThemeBySlug {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @default "true" */
      includeShows?: boolean;
      /** #required# */
      slug?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTalkThemeBySlugData;
  }

  /**
   * @description Gets the list of talk themes for given themeIds. </br><br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags talk radio
   * @name GetTheme
   * @request GET:/api/v1/talk/getTheme
   * @deprecated
   * @response `200` `GetThemeData` an object representing the results of the operation
   */
  export namespace GetTheme {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * - Include shows in response? Defaults to true if not passed by clients.
       * @default "true"
       */
      includeShows?: boolean;
      /** - List of Theme ids #required# */
      themeId?: number[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThemeData;
  }

  /**
   * @description Gets the list of talk themes. </br><br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags talk radio
   * @name GetThemes
   * @request GET:/api/v1/talk/getThemes
   * @deprecated
   * @response `200` `GetThemesData` an object representing the results of the operation
   */
  export namespace GetThemes {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * - Deprecated: Defaults to false.
       * @default "false"
       */
      includeShows?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThemesData;
  }

  /**
   * @description Get thumbs down tracks </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table>
   * @tags live radio
   * @name GetThumbsDown
   * @request GET:/api/v1/liveRadio/{ownerProfileId}/getThumbsDownTracks
   * @deprecated
   * @response `200` `GetThumbsDownData`
   */
  export namespace GetThumbsDown {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** @format int64 */
      profileId: number;
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThumbsDownData;
  }

  /**
   * @description Get thumbs down tracks
   * @tags custom radio
   * @name GetThumbsDown2
   * @request GET:/api/v1/radio/{ownerProfileId}/getThumbsDownTracks
   * @deprecated
   * @response `200` `GetThumbsDown2Data`
   */
  export namespace GetThumbsDown2 {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** @format int64 */
      profileId: number;
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThumbsDown2Data;
  }

  /**
   * @description Get thumbs down episodes <p> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table>
   * @tags talk radio
   * @name GetThumbsDown3
   * @request GET:/api/v1/talk/{ownerProfileId}/getThumbsDownEpisodes
   * @deprecated
   * @response `200` `GetThumbsDown3Data`
   */
  export namespace GetThumbsDown3 {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** #required# */
      sessionId?: string;
      /**
       * #required#
       * @format int64
       */
      userProfileId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThumbsDown3Data;
  }

  /**
   * @description Get thumbs up tracks</br></br> Error Codes / Throws <p/>
   * @tags live radio
   * @name GetThumbsUp
   * @request GET:/api/v1/liveRadio/{ownerProfileId}/getThumbsUpTracks
   * @deprecated
   * @response `200` `GetThumbsUpData`
   * @response `400` `void` 2: user.logged.out
   * @response `401` `void` 7: operation.not.allowed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetThumbsUp {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * #required#
       * @format int64
       */
      profileId: number;
      /** #required# */
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThumbsUpData;
  }

  /**
   * @description Get thumbs up tracks
   * @tags custom radio
   * @name GetThumbsUp2
   * @request GET:/api/v1/radio/{ownerProfileId}/getThumbsUpTracks
   * @deprecated
   * @response `200` `GetThumbsUp2Data`
   */
  export namespace GetThumbsUp2 {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** @format int64 */
      profileId: number;
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThumbsUp2Data;
  }

  /**
   * @description Get thumbs up episodes <p> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table>
   * @tags talk radio
   * @name GetThumbsUp3
   * @request GET:/api/v1/talk/{ownerProfileId}/getThumbsUpEpisodes
   * @deprecated
   * @response `200` `GetThumbsUp3Data`
   */
  export namespace GetThumbsUp3 {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** #required# */
      sessionId?: string;
      /**
       * #required#
       * @format int64
       */
      userProfileId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetThumbsUp3Data;
  }

  /**
   * @description Finds all top artists.  The default query with no custom parameters will return the top 10 formats with the top artist of each format.
   * @tags recs
   * @name GetTopArtists
   * @request GET:/api/v1/recs/getTopArtists
   * @deprecated
   * @response `200` `GetTopArtistsData`
   * @response `400` `void` 305: bad.param.rank.start
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetTopArtists {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * The number of artists to return per format.
       * Optional, default is 10
       * @format int32
       * @default "10"
       */
      formatSize?: number;
      /**
       * the worst rank to return.
       * Optional, default is 1
       * @format int32
       * @default "1"
       */
      rankEnd?: number;
      /**
       * the best ranked to return.  1 is the best top rank.
       * Optional, default is 1
       * @format int32
       * @default "1"
       */
      rankStart?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTopArtistsData;
  }

  /**
   * @description Get trackbundle details for specified trackbundles </br> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>303</td> <td>400</td> <td>missing.param.rule.criterias</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name GetTrackBundles
   * @request GET:/api/v1/catalog/getAlbumsByAlbumIds
   * @deprecated
   * @response `200` `GetTrackBundlesData` trackbundle details
   */
  export namespace GetTrackBundles {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ?categoryId=1&categoryId=2&... #required# */
      albumId?: number[];
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /**
       * max number of records to return (default MAX_ROWS)
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTrackBundlesData;
  }

  /**
   * @description Get trackbundles (albums) for the specified Categories (Merch'd Lists) <br/> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>301</td> <td>400</td> <td>missing.param.ids</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>303</td> <td>400</td> <td>missing.param.rule.criterias</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name GetTrackBundlesFromCategories
   * @request GET:/api/v1/catalog/getAlbumsByCategories
   * @deprecated
   * @response `200` `GetTrackBundlesFromCategoriesData` category trackbundles
   */
  export namespace GetTrackBundlesFromCategories {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ?categoryId=1&categoryId=2&... #required# */
      categoryId?: number[];
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /**
       * max number of records to return (default MAX_ROWS)
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * start index (zero based)
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTrackBundlesFromCategoriesData;
  }

  /**
   * @description Returns a list of all the tracks and playback context for a user.
   * @tags history
   * @name GetTrackHistoryEvents
   * @request GET:/api/v1/history/{ownerProfileId}/getTrackEvents
   * @response `200` `GetTrackHistoryEventsData`
   * @response `400` `void` 2: user.logged.out
   * @response `401` `void` 7: operation.not.allowed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetTrackHistoryEvents {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      campaignId?: string;
      /**
       * @format int32
       * @default "10"
       */
      numResults?: number;
      /** @format int64 */
      profileId: number;
      sessionId?: string;
      /**
       * @format int64
       * @default "0"
       */
      startTime?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTrackHistoryEventsData;
  }

  /**
   * @description This is the API flow that is required for continues playback of radio. Each call to the API will return 5 tracks. You should only call the API once you have depleted the 5 tracks. Logic across most clients will call the API after the 4 song is being played (in the background) and it will preload the track in background thread.
   * @tags custom radio
   * @name GetTracks
   * @request GET:/api/v1/radio/{ownerProfileId}/{radioStationId}/getTracks
   * @deprecated
   * @response `200` `GetTracksData`
   */
  export namespace GetTracks {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
      /** #required# */
      radioStationId: string;
    };
    export type RequestQuery = {
      /**
       * This will allow the user to listen to a track on the specified album ID if the station is on its first play
       * @format int32
       */
      albumToPlay?: number;
      /**
       * - playedFrom decides what the parent station type is. <br/>
       * Following are the valid playedFrom ranges: <li>100 to 199 = Custom Radio</li> <li>400 to 499 = Custom
       * Radio Anonymous</li> <li>500 to 599 = Talk Radio</li>
       * @format int32
       */
      playedFrom?: number;
      /**
       * #required#
       * @format int64
       */
      profileId: number;
      /**
       * - # of tracks you want per request to this API. Optional,
       * defaults to 5 and capped at 10. #required#
       * @format int32
       * @default "5"
       */
      reqTracks?: number;
      /** #required# */
      sessionId?: string;
      /**
       * #required#
       * @format int32
       */
      variety?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTracksData;
  }

  /**
   * @description Get tracks for the specified Categories (Merch'd Lists) <p/> <br/> </br>Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>301</td> <td>400</td> <td>missing.param.ids</td> </tr> <tr> <td>302</td> <td>400</td> <td>bad.param.ids</td> </tr> <tr> <td>303</td> <td>400</td> <td>missing.param.rule.criterias</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name GetTracksFromCategories
   * @request GET:/api/v1/catalog/getTracksByCategories
   * @deprecated
   * @response `200` `GetTracksFromCategoriesData` category tracks
   */
  export namespace GetTracksFromCategories {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ?categoryId=1&categoryId=2&... #required# */
      categoryId?: number[];
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /**
       * max number of records to return (default MAX_ROWS)
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * start index (zero based)
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTracksFromCategoriesData;
  }

  /**
   * @description Returns user's profile. You can have this return the users fb friends as well. It also has the option of returning the friends most recent play. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags profile
   * @name GetUserProfile
   * @request GET:/api/v1/profile/{ownerProfileId}/getProfile
   * @response `200` `GetUserProfileData` User's Profile
   */
  export namespace GetUserProfile {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * if true will return any favorites, false returns none.
       * @default "false"
       */
      includeFavorites?: boolean;
      /** @default "false" */
      includeFriends?: boolean;
      /** @default "false" */
      includeFriendsPlays?: boolean;
      /** @default "false" */
      includePreferences?: boolean;
      /** @default "false" */
      includeSubscriptions?: boolean;
      /**
       * - Logged in users's profileId. #required#
       * @format int64
       */
      profileId: number;
      /** - Logged in users sessionId. #required# */
      sessionId?: string;
      /** @default "true" */
      usePeriodDelimiterInPrefKeys?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserProfileData;
  }

  /**
   * No description
   * @tags customer care
   * @name GetUserProfileById
   * @request GET:/api/v1/secure/cc/getUserProfileById
   * @response `200` `GetUserProfileByIdData`
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetUserProfileById {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserProfileByIdData;
  }

  /**
   * @description Retrieve WhiteList Api urls.
   * @tags bootstrap
   * @name GetWhiteListApiUrls
   * @request GET:/api/v1/bootstrap/getWhiteListApiUrls
   * @deprecated
   * @response `200` `GetWhiteListApiUrlsData` White List Api Urls
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetWhiteListApiUrls {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetWhiteListApiUrlsData;
  }

  /**
   * @description Logs in a user <p> setCurrentStreamer should be set to false. This means that when you log in, your other device will still be able to stream. This device will become eligible to stream when getStreamUrl is called. <br> In a future release, setCurrentStreamer will be removed, and false will be the default. </p>
   * @tags account
   * @name Login
   * @request POST:/api/v1/account/login
   * @response `201` `LoginData` a login response
   * @response `400` `void` 6: invalid.host
   * @response `403` `void` 789: max.login.exceeded
   * @response `500` `void` 1: service.unavailable
   */
  export namespace Login {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginPayload;
    export type RequestHeaders = {
      'Fastly-Client-IP'?: string;
      'X-GEO-COUNTRY'?: string;
    };
    export type ResponseBody = LoginData;
  }

  /**
   * @description Logs in a user from a 3rd party device<br/> Requires a sha-1 hash of salt + external uuid + timestamp <p> First must link the external device to an iheart account. This can be done using the getCode flow. </br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>115</td> <td>400</td> <td>empty.device</td> </tr> <tr> <td>101</td> <td>400</td> <td>invalid.user</td> </tr> <tr> <td>6</td> <td>400</td> <td>invalid.host</td> </tr> <tr> <td>123</td> <td>400</td> <td>invalid.hash</td> </tr> <tr> <td>107</td> <td>400</td> <td>invalid.date</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>116</td> <td>400</td> <td>invalid.device</td> </tr> </table>
   * @tags account
   * @name Login3rdParty
   * @request POST:/api/v1/account/login3rdParty
   * @response `201` `Login3rdPartyData`
   */
  export namespace Login3rdParty {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Login3rdPartyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = Login3rdPartyData;
  }

  /**
   * @description Logs in a user with oauth credentials.
   * @tags account
   * @name LoginAdv
   * @request POST:/api/v1/account/loginOauth
   * @deprecated
   * @response `201` `LoginAdvData` a login response
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 114: service.fb.unavailable
   */
  export namespace LoginAdv {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginAdvPayload;
    export type RequestHeaders = {
      'User-Agent'?: string;
    };
    export type ResponseBody = LoginAdvData;
  }

  /**
   * No description
   * @tags account
   * @name LoginOAuthDevice
   * @request POST:/api/v1/account/loginOAuthDevice
   * @response `201` `LoginOAuthDeviceData`
   * @response `400` `void` 115: empty.device
   * @response `500` `void` 1: service.unavailable
   */
  export namespace LoginOAuthDevice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginOAuthDeviceRequest;
    export type RequestHeaders = {};
    export type ResponseBody = LoginOAuthDeviceData;
  }

  /**
   * @description Log in  or create user. Try to login the user based on given information. If user is not found in our system, create a new account. <p> This call is used to create Anonymous accounts.
   * @tags account
   * @name LoginOrCreateOauthUser
   * @request POST:/api/v1/account/loginOrCreateOauthUser{trackingParams}
   * @response `201` `LoginOrCreateOauthUserData`
   * @response `400` `void` 102: account.creation.error
   * @response `500` `void` 114: service.fb.unavailable
   */
  export namespace LoginOrCreateOauthUser {
    export type RequestParams = {
      trackingParams: string;
    };
    export type RequestQuery = {};
    export type RequestBody = LoginOrCreateOauthUserPayload;
    export type RequestHeaders = {
      'Fastly-Client-IP'?: string;
      'User-Agent'?: string;
      'X-GEO-COUNTRY'?: string;
    };
    export type ResponseBody = LoginOrCreateOauthUserData;
  }

  /**
   * @description Creates a user with the default subscription for the host. <br/> Trial accounts aren't started till the user is logged in for the first time<br/> If deviceId and deviceName are present, it will login the user. <br/>
   * @tags account
   * @name LoginOrCreateUser
   * @request POST:/api/v1/account/loginOrCreateUser{trackingParams}
   * @response `201` `LoginOrCreateUserData`
   * @response `400` `void` 6: invalid.host
   * @response `403` `void` 118: country.not.supported
   * @response `500` `void` 1: service.unavailable
   */
  export namespace LoginOrCreateUser {
    export type RequestParams = {
      trackingParams: string;
    };
    export type RequestQuery = {};
    export type RequestBody = LoginOrCreateUserPayload;
    export type RequestHeaders = {
      'Fastly-Client-IP'?: string;
      'User-Agent'?: string;
      'X-GEO-COUNTRY'?: string;
    };
    export type ResponseBody = LoginOrCreateUserData;
  }

  /**
   * No description
   * @tags account
   * @name LoginSaml
   * @request POST:/api/v1/account/loginSaml
   * @response `6` `void` 400: invalid.host
   * @response `101` `void` 400: invalid.user
   * @response `115` `void` 400: empty.device
   * @response `201` `LoginSamlData`
   * @response `500` `void` 1: service.unavailable
   * @response `801` `void` 400: invalid.saml.exception
   */
  export namespace LoginSaml {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginSamlPayload;
    export type RequestHeaders = {
      Authorization?: string;
    };
    export type ResponseBody = LoginSamlData;
  }

  /**
   * No description
   * @tags account
   * @name LoginWithShortLivedToken
   * @request POST:/api/v1/account/loginWithShortLivedToken
   * @response `201` `LoginWithShortLivedTokenData`
   * @response `400` `void` 115: empty.device
   * @response `401` `void` 803: expired.token.exception
   * @response `500` `void` 1: service.unavailable
   */
  export namespace LoginWithShortLivedToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginWithShortLivedTokenPayload;
    export type RequestHeaders = {};
    export type ResponseBody = LoginWithShortLivedTokenData;
  }

  /**
   * @description Logs in a user with a token generated by amp
   * @tags account
   * @name LoginWithToken
   * @request POST:/api/v1/account/loginWithToken
   * @response `201` `LoginWithTokenData` a login response
   * @response `400` `void` 2: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace LoginWithToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginWithTokenPayload;
    export type RequestHeaders = {};
    export type ResponseBody = LoginWithTokenData;
  }

  /**
   * @description Query for tracks, trackbundles, artist and stations It is configurable which you want to search for. <br/> Note: possible object types returned in bestMatch field are: STATION, ARTIST, TRACK, FEATUREDSTATION, <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name QueryAll
   * @request GET:/api/v1/catalog/searchAll
   * @deprecated
   * @response `200` `QueryAllData` query results
   */
  export namespace QueryAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /** marketId id of the market to boost */
      boostMarketId?: string;
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /** #required# */
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * true to return artists; false otherwise
       * @default "true"
       */
      queryArtist?: boolean;
      /**
       * true to return bundles; false otherwise
       * @default "true"
       */
      queryBundle?: boolean;
      /**
       * true to return featured stations; false otherwise
       * @default "false"
       */
      queryFeaturedStation?: boolean;
      /** @default "false" */
      queryKeyword?: boolean;
      /**
       * true to return stations; false otherwise
       * @default "true"
       */
      queryStation?: boolean;
      /**
       * true to return talk shows; false otherwise
       * @default "false"
       */
      queryTalkShow?: boolean;
      /**
       * true to return talk themes; false otherwise
       * @default "false"
       */
      queryTalkTheme?: boolean;
      /**
       * true to return tracks; false otherwise
       * @default "true"
       */
      queryTrack?: boolean;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
      trackBundleId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryAllData;
  }

  /**
   * @description Query artists by keywords <br/> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags catalog
   * @name QueryArtist
   * @request GET:/api/v1/catalog/searchArtist
   * @deprecated
   * @response `200` `QueryArtistData` artist results
   */
  export namespace QueryArtist {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /** @format int32 */
      genreId?: number;
      /** #required# */
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
      /** @format int32 */
      vendorGenreId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryArtistData;
  }

  /**
   * @description Query keywords<br/> <p/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags catalog
   * @name QueryKeyword
   * @request GET:/api/v1/catalog/searchKeyword
   * @deprecated
   * @response `200` `QueryKeywordData` search results
   */
  export namespace QueryKeyword {
    export type RequestParams = {};
    export type RequestQuery = {
      countryCode?: string;
      /** #required# */
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryKeywordData;
  }

  /**
   * @description Query PRNs by keywords <br/> <p/>
   * @tags catalog
   * @name QueryPrnEpisode
   * @request GET:/api/v1/catalog/searchPrnEpisode
   * @response `200` `QueryPrnEpisodeData` prnEpisodes
   */
  export namespace QueryPrnEpisode {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      /** @format int32 */
      groupId?: number;
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /** @format int32 */
      showId?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryPrnEpisodeData;
  }

  /**
   * @description Query Talk Shows by keywords <br/> <p/>
   * @tags catalog
   * @name QueryShow
   * @request GET:/api/v1/catalog/searchShow
   * @deprecated
   * @response `200` `QueryShowData` shows
   */
  export namespace QueryShow {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryShowData;
  }

  /**
   * @description Query artists by keyowrds <br/> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags catalog
   * @name QueryStation
   * @request GET:/api/v1/catalog/searchStation
   * @deprecated
   * @response `200` `QueryStationData` artist results
   */
  export namespace QueryStation {
    export type RequestParams = {};
    export type RequestQuery = {
      /** id of the market you want the boost */
      boostMarketId?: string;
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /** #required# */
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryStationData;
  }

  /**
   * @description Query Talk Themes by keywords <br/> <p/>
   * @tags catalog
   * @name QueryTheme
   * @request GET:/api/v1/catalog/searchTheme
   * @deprecated
   * @response `200` `QueryThemeData` themes
   */
  export namespace QueryTheme {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       */
      countryCode?: string;
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryThemeData;
  }

  /**
   * @description Query TRacks by keywords <br/> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags catalog
   * @name QueryTrack
   * @request GET:/api/v1/catalog/searchTrack
   * @deprecated
   * @response `200` `QueryTrackData` tracks
   */
  export namespace QueryTrack {
    export type RequestParams = {};
    export type RequestQuery = {
      artistId?: string;
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /** @format int32 */
      genreId?: number;
      /** #required# */
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
      trackBundleId?: string;
      /** @format int32 */
      vendorGenreId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryTrackData;
  }

  /**
   * @description Query trackbundles by keyowrd <br/> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name QueryTrackBundle
   * @request GET:/api/v1/catalog/searchAlbum
   * @deprecated
   * @response `200` `QueryTrackBundleData` trackbundle results
   */
  export namespace QueryTrackBundle {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /** @format int32 */
      genreId?: number;
      /** #required# */
      keywords?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
      /** @format int32 */
      vendorGenreId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryTrackBundleData;
  }

  /**
   * @description <title>EnrichmentSerivce</title> <p> Retrieves CC-IHR internal Track ID and Artist ID provided a track title, artist name, and optionally track duration. In some cases, CC-IHR Tracks may have been pre-matched to end user track identifiers. Providing the additional cartId and sku parameters will take advantage of pre matched tracks if they exist. </p> <p> If no matching tracks are found a secondary artist <i>only</i> lookup will be performed based on the artist query parameter. In this case, the response will contain artist level data. <p> <B>Response Format (XML / JSON)</b></br> Responses are available in both XML and JSON formats. Responses default to xml. JSON responses can be requested by setting the HTTP request header <b>"accepts"</b> to <b>"application/json"</b> <p> <b>Example Request:</b> <br/> /api/v1/enrichment/query/track?track=katmandu&artist=bob seger&duration=04:17&cartId=123&sku=ABC123&maxRows=1&startIndex=0 </p> <p> <b>XML Response (Track Found): </b><br/> <textArea rows="15" cols="94"> <ns2:enrichmentTrackQueryResponse totalTracks="2" xmlns:ns2="http://api.thumbplay.com"> <duration>123</duration> <request> <param value="" name="duration"/> <param value="0" name="startIndex"/> <param value="1" name="maxRows"/> <param value="katmandu" name="track"/> <param value="" name="cartId"/> <param value="Bob Seger" name="artist"/> </request> <tracks> <track> <field name="product_id"><value>14733142</value></field> <field name="isrc"><value>BeautifulLoser03</value></field> <field name="score"><value>510</value></field> <field name="record_label_name"><value>EMI</value></field> <field name="artist_id"><value>86960</value></field> <field name="track_bundle_product_id"><value>14733139</value></field> <field name="track_number"><value>3</value></field> <field name="volume_number"><value>1</value></field> <field name="title"><value>Katmandu</value></field> <field name="duration"><value>369.0</value></field> <field name="artist_name"><value>Bob Seger</value></field> <field name="album_title"><value>Beautiful Loser</value></field> <field name="explicit_lyrics"><value>false</value></field> </track> ... </tracks> </ns2:enrichmentTrackQueryResponse> </textArea> <b>JSPN Response (Track Found): </b><br/> <textArea rows="15" cols="94"> { "errors":null, "duration":120, "parameters":[ {"name":"duration", "value":}, {"name":"startIndex", "value":"0"}, {"name":"maxRows", "value":"1"}, {"name":"track", "value":"katmandu"}, {"name":"cartId","value": }, {"name":"artist","value":"bob seger"}, {"name":"sku","value": } ], "totalTracks":2, "totalArtists":null, "tracks":[ { "document":[ {"name":"product_id","value":"14733142"}, {"name":"isrc","value":"BeautifulLoser03"}, {"name":"score","value":"510"}, {"name":"record_label_name","value":"EMI"}, {"name":"artist_id","value":"86960"}, {"name":"track_bundle_product_id","value":"14733139"}, {"name":"track_number", "value":"3"}, {"name":"volume_number", "value":"1"}, {"name":"title", "value":"Katmandu"}, {"name":"duration","value":"369.0"}, {"name":"artist_name", "value":"Bob Seger"}, {"name":"album_title", "value":"Beautiful Loser"}, {"name":"explicit_lyrics","value":"false"} ] } ], "artists":null, "firstError":null } </textArea> <p> <b>Example Request:</b> <br/> /api/v1/enrichment/query/track?track=NotASongTitle&artist=adele&duration= 04:17&cartId=123&sku=ABC123&maxRows=5&startIndex=0 </p> <p> <b>Example Response (Track NOT Found - Artist Only): </b><br/> <textArea rows="15" cols="94"> <ns2:enrichmentTrackQueryResponse totalArtists="25" totalTracks="0" xmlns:ns2="http://api.thumbplay.com"> <duration>355</duration> <request> <param value="" name="duration"/> <param value="0" name="startIndex"/> <param value="100" name="maxRows"/> <param value="NotASongTitle" name="track"/> <param value="" name="cartId"/> <param value="adele" name="artist"/> <param value="" name="sku"/> </request> <tracks/> <artists> <artist><field name="title"><value>Adele</value></field> <field name="artist_name"><value>Adele</value></field> <field name="score"><value>1028</value></field> <field name="artist_id"><value>126564</value></field> <field name="explicit_lyrics"><value>false</value></field> </artist> </artists> </ns2:enrichmentTrackQueryResponse> </textArea> <p> </p>
   * @tags enrichment
   * @name QueryTrackExternal
   * @request GET:/api/v1/enrichment/query/track
   * @deprecated
   * @response `200` `QueryTrackExternalData`
   */
  export namespace QueryTrackExternal {
    export type RequestParams = {};
    export type RequestQuery = {
      artist?: string;
      cartId?: string;
      duration?: string;
      /**
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /**
       * @format int32
       * @default "0"
       */
      startIndex?: number;
      track?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = QueryTrackExternalData;
  }

  /**
   * @description Register client config properties.
   * @tags bootstrap
   * @name RegisterClient
   * @request GET:/api/v1/bootstrap/registerClient{trackingParams}
   * @response `200` `RegisterClientData`
   */
  export namespace RegisterClient {
    export type RequestParams = {
      trackingParams: string;
    };
    export type RequestQuery = {
      /** #required# */
      deviceId?: string;
      /** #required# */
      deviceName?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterClientData;
  }

  /**
   * @description Register a listening event to a live radio station to the backend </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> </table>
   * @tags live radio
   * @name RegisterListen
   * @request POST:/api/v1/liveRadio/{ownerProfileId}/{liveRadioStationId}/registerListen
   * @response `201` `RegisterListenData`
   */
  export namespace RegisterListen {
    export type RequestParams = {
      /** @format int32 */
      liveRadioStationId: number;
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = RegisterListenPayload;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
    };
    export type ResponseBody = RegisterListenData;
  }

  /**
   * @description Register play.</br></br> Error Codes / Throws
   * @tags prn
   * @name RegisterPlay
   * @request POST:/api/v1/prn/{episodeId}/registerPlay
   * @response `201` `RegisterPlayData`
   * @response `400` `void` 302: bad.param.ids
   * @response `500` `void` 1: service.unavailable
   */
  export namespace RegisterPlay {
    export type RequestParams = {
      /** @format int32 */
      episodeId: number;
    };
    export type RequestQuery = {
      /** @format int32 */
      groupId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterPlayData;
  }

  /**
   * @description Dis-associates a user from a token
   * @tags account
   * @name RemoveLongLastingToken
   * @request POST:/api/v1/account/removeLoginToken
   * @response `201` `RemoveLongLastingTokenData` the token response
   * @response `400` `void` 2: user.logged.out
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace RemoveLongLastingToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /**
       * the profile id
       * @format int64
       */
      profileId: number;
      /** the session id */
      sessionId?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = RemoveLongLastingTokenData;
  }

  /**
   * @description Dis-associates a user from a token
   * @tags customer care
   * @name RemoveLongLastingToken2
   * @request POST:/api/v1/secure/cc/removeLoginToken
   * @response `201` `RemoveLongLastingToken2Data`
   * @response `400` `void` 2: user.logged.out
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace RemoveLongLastingToken2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /** @format int64 */
      profileId: number;
      sessionId?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = RemoveLongLastingToken2Data;
  }

  /**
   * @description remove a users oauth credentials
   * @tags account
   * @name RemoveOauthCred
   * @request POST:/api/v1/account/removeOauthCred
   * @response `201` `RemoveOauthCredData` Success message
   * @response `300` `void` 129: invalid.oauth.operation
   * @response `400` `void` 2: user.logged.out
   * @response `500` `void` 1: service.unavailable
   */
  export namespace RemoveOauthCred {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RemoveOauthCredPayload;
    export type RequestHeaders = {};
    export type ResponseBody = RemoveOauthCredData;
  }

  /**
   * @description Removes a user's preset preference. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>119</td> <td>400</td> <td>preference.key.not.allowed</td> </tr> <tr> <td>128</td> <td>400</td> <td>invalid.profile</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags profile
   * @name RemovePresetPreference
   * @request POST:/api/v1/profile/removePresetPreference
   * @deprecated
   * @response `201` `RemovePresetPreferenceData` User's Preset preferences
   */
  export namespace RemovePresetPreference {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RemovePresetPreferencePayload;
    export type RequestHeaders = {};
    export type ResponseBody = RemovePresetPreferenceData;
  }

  /**
   * @description Removes a show to a stored custom talk station. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>601</td> <td>400</td> <td>Show doesn't exist</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> </table>
   * @tags talk radio
   * @name RemoveShowFromStation
   * @request POST:/api/v1/talk/{ownerProfileId}/{talkStationId}/{showId}/removeShowFromStation
   * @deprecated
   * @response `201` `RemoveShowFromStationData` an object representing the results of the operation
   */
  export namespace RemoveShowFromStation {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      /**
       * #required#
       * @format int32
       */
      showId: number;
      /** #required# */
      talkStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RemoveShowFromStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = RemoveShowFromStationData;
  }

  /**
   * @description Renames a custom radio stations that the user has saved. Users can override the default Radio Station naming convention.
   * @tags custom radio
   * @name RenameRadioStation
   * @request POST:/api/v1/radio/{ownerProfileId}/{radioStationId}/rename
   * @deprecated
   * @response `201` `RenameRadioStationData`
   */
  export namespace RenameRadioStation {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      /** #required# */
      radioStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RenameRadioStationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = RenameRadioStationData;
  }

  /**
   * @description Rename a custom station. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>5</td> <td>404</td> <td>Station not found</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> </table>
   * @tags talk radio
   * @name RenameRadioStation2
   * @request POST:/api/v1/talk/{profileId}/{talkStationId}/rename
   * @deprecated
   * @response `201` `RenameRadioStation2Data` an object representing the results of the operation
   */
  export namespace RenameRadioStation2 {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /** #required# */
      talkStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RenameRadioStation2Payload;
    export type RequestHeaders = {};
    export type ResponseBody = RenameRadioStation2Data;
  }

  /**
   * @description <p> Called immediately at playback stop, generates STREAM_ZERO playlog event. <p/> </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>210</td> <td>400</td> <td>missing.reason.description</td> </tr> <tr> <td>206</td> <td>400</td> <td>missing.playedfrom</td> </tr> </table>
   * @tags subscription
   * @name ReportStreamDone
   * @request POST:/api/v1/subscription/reportStreamDone
   * @deprecated
   * @response `201` `ReportStreamDoneData` A response containing boolean status
   */
  export namespace ReportStreamDone {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStreamDonePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamDoneData;
  }

  /**
   * @description <p> Called immediately at playback, generates STREAM_ZERO playlog event. <p/> </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags subscription
   * @name ReportStreamOne
   * @request POST:/api/v1/subscription/reportStreamOne
   * @deprecated
   * @response `201` `ReportStreamOneData` A response containing boolean status
   */
  export namespace ReportStreamOne {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStreamOnePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamOneData;
  }

  /**
   * No description
   * @tags live radio
   * @name ReportStreamStarted
   * @request POST:/api/v1/liveRadio/reportStreamStarted
   * @response `201` `ReportStreamStartedData` A response containing the URL for the content stream and the next player key
   * @response `400` `void` 401: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ReportStreamStarted {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStreamStartedPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamStartedData;
  }

  /**
   * No description
   * @tags subscription
   * @name ReportStreamStarted2
   * @request POST:/api/v1/subscription/reportStreamStarted
   * @deprecated
   * @response `201` `ReportStreamStarted2Data`
   */
  export namespace ReportStreamStarted2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStreamStarted2Payload;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamStarted2Data;
  }

  /**
   * @description <p> Called 15s into playback, generates Cassandra History, Facebook Scrobble, and STREAM_START playlog event. <p/> </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags subscription
   * @name ReportStreamTwo
   * @request POST:/api/v1/subscription/reportStreamTwo
   * @deprecated
   * @response `201` `ReportStreamTwoData` A response containing the URL for the content stream and the next player key
   */
  export namespace ReportStreamTwo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStreamTwoPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamTwoData;
  }

  /**
   * @description <p> Called for the purpose of reporting skip (mixintype) to vast. <p/> </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>210</td> <td>400</td> <td>missing.reason.description</td> </tr> <tr> <td>206</td> <td>400</td> <td>missing.playedfrom</td> </tr> </table>
   * @tags subscription
   * @name ReportStreamVast
   * @request GET:/api/v1/subscription/reportStreamVast
   * @deprecated
   * @response `200` `ReportStreamVastData` A response containing boolean status
   */
  export namespace ReportStreamVast {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * - Track Id of currently playing track, or the episode id if this is a talk event
       * @format int32
       */
      contentId?: number;
      /**
       * - Elapsed Time in seconds.
       * @format int32
       */
      elapsedTime?: number;
      /** - not used for talk */
      host?: string;
      /** - mixinType (AD, SWEEPER, PRODUCTION) . */
      mixinType?:
        | 'AD'
        | 'NEWS'
        | 'PRODUCTION'
        | 'SWEEPER'
        | 'TRAFFIC'
        | 'WEATHER';
      /**
       * - this is the ID of the context it was played in, either a Live Station, Custom Station, etc
       * @default ""
       */
      parentId?: string;
      /**
       * - playDate in time format (long), milliseconds
       * @format int64
       * @default "0"
       */
      playedDate?: number;
      /**
       * - integer where 100-199 is CR, 200-299 is Premium, 300-399 is LR, 400-499 is CR Anon, 500-599 is CT
       * (custom talk)
       * @format int32
       */
      playedFrom?: number;
      playerKey?: string;
      /**
       * Logged in users profile Id. #required#
       * @format int64
       */
      profileId: number;
      /**
       * - the radio station id
       * @default ""
       */
      radiostationId?: string;
      /** - reason string should be one of "completed", "skipped", "stopped", "stationchange", or "appclose" */
      reason?: string;
      /** session id #required# */
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamVastData;
  }

  /**
   * @description Reset a user's password (user will receive an email)<br/>
   * @tags account
   * @name ResetPw
   * @request POST:/api/v1/account/resetPw
   * @response `201` `ResetPwData` Success message
   */
  export namespace ResetPw {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /** @default "false" */
      includeLogin?: boolean;
      redirectUrl?: string;
      /** Request user name. */
      userName?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = ResetPwData;
  }

  /**
   * No description
   * @tags customer care
   * @name ResetRadioSession
   * @request POST:/api/v1/secure/cc/resetRadioSession
   * @response `201` `ResetRadioSessionData`
   * @response `400` `void` 101: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ResetRadioSession {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @format int64 */
      profileId?: number;
      radioStationId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResetRadioSessionData;
  }

  /**
   * @description Save a single preference to user's profile. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>120</td> <td>400</td> <td>preference.value.size.exceeded</td> </tr> <tr> <td>119</td> <td>400</td> <td>preference.key.not.allowed</td> </tr> <tr> <td>771</td> <td>500</td> <td>appboy.error</td> </tr> </table>
   * @tags profile
   * @name SavePreference
   * @request POST:/api/v1/profile/savePreference
   * @response `201` `SavePreferenceData` User's preferences
   */
  export namespace SavePreference {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SavePreferencePayload;
    export type RequestHeaders = {};
    export type ResponseBody = SavePreferenceData;
  }

  /**
   * @description Save user's preferences. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>120</td> <td>400</td> <td>preference.value.size.exceeded</td> </tr> <tr> <td>119</td> <td>400</td> <td>preference.key.not.allowed</td> </tr> <tr> <td>771</td> <td>500</td> <td>appboy.error</td> </tr> </table>
   * @tags profile
   * @name SavePreferences
   * @request POST:/api/v1/profile/savePreferences
   * @response `201` `SavePreferencesData` User's preferences
   */
  export namespace SavePreferences {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SavePreferencesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = SavePreferencesData;
  }

  /**
   * @description Saves user's preset preferences. Preferences can be added and updated but not removed. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>128</td> <td>400</td> <td>invalid.profile</td> </tr> <tr> <td>119</td> <td>400</td> <td>preference.key.not.allowed</td> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> </table>
   * @tags profile
   * @name SavePresetPreferences
   * @request POST:/api/v1/profile/savePresetPreferences
   * @deprecated
   * @response `201` `SavePresetPreferencesData` User's Preset preferences
   */
  export namespace SavePresetPreferences {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SavePresetPreferencesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = SavePresetPreferencesData;
  }

  /**
   * @description Sets a username and password for a given user (by profile id and session id)
   * @tags account
   * @name SetEmailCredentials
   * @request POST:/api/v1/account/setEmailCred
   * @response `201` `SetEmailCredentialsData` an 200 response on success; another code otherwise
   * @response `400` `void` 103 : duplicate.user, 139: ineligible.set.credentials, 109 : invalid.email, 106 : invalid.password, 101: invalid.user, 106 : invalid.password, 131 : password.policy.error, 143 : password.policy.invalid.chars.error,141 : password.policy.common.error, 140 : password.policy.weak.error
   * @response `500` `void` 1: service.unavailable
   */
  export namespace SetEmailCredentials {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SetEmailCredentialsPayload;
    export type RequestHeaders = {
      'User-Agent'?: string;
      'X-hostName'?: string;
    };
    export type ResponseBody = SetEmailCredentialsData;
  }

  /**
   * @description Updates user's password provided active access token is passed to this api
   * @tags account
   * @name SetNewPassword
   * @request POST:/api/v1/account/setNewPw
   * @response `201` `SetNewPasswordData` Success message
   * @response `400` `void` 121: invalid.ihr.access.token, invalid.new.password, 106 : invalid.password, 131 : password.policy.error, 143 : password.policy.invalid.chars.error,141 : password.policy.common.error, 140 : password.policy.weak.error
   * @response `500` `void` 1: service.unavailable
   */
  export namespace SetNewPassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SetNewPasswordPayload;
    export type RequestHeaders = {
      'User-Agent'?: string;
      'X-hostName'?: string;
    };
    export type ResponseBody = SetNewPasswordData;
  }

  /**
   * @description Sets a user's location using a zipcode. </br> </br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>127</td> <td>400</td> <td>invalid.zipcode</td> </tr> </table>
   * @tags profile
   * @name SetUserLocation
   * @request POST:/api/v1/profile/{ownerProfileId}/zipcode
   * @response `201` `SetUserLocationData` the user's market and whether that market has mixins or not.
   */
  export namespace SetUserLocation {
    export type RequestParams = {
      /**
       * Logged in users's profile id. #required#
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = SetUserLocationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = SetUserLocationData;
  }

  /**
   * @description Test API for FB connect * </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>112</td> <td>400</td> <td>invalid.fbAccessToken</td> </tr> <tr> <td>114</td> <td>500</td> <td>service.fb.unavailable</td> </tr> <tr> <td>111</td> <td>400</td> <td>incorrect.fbCred</td> </tr> <tr> <td>117</td> <td>400</td> <td>invalidtype.oauth</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table> </form>
   * @tags account
   * @name TestFbOauth
   * @request POST:/api/v1/account/testFBOauthCred
   * @response `201` `TestFbOauthData` Success message
   */
  export namespace TestFbOauth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TestFbOauthPayload;
    export type RequestHeaders = {};
    export type ResponseBody = TestFbOauthData;
  }

  /**
   * @description Thumb down an episode.</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>605</td> <td>400</td> <td>talk.bad.episode</td> </tr> <tr> <td>606</td> <td>400</td> <td>talk.bad.station</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table>
   * @tags talk radio
   * @name ThumbDownEpisode
   * @request POST:/api/v1/talk/{ownerProfileId}/{stationId}/thumbsDownEpisode
   * @deprecated
   * @response `201` `ThumbDownEpisodeData` an object representing the results of the operation
   */
  export namespace ThumbDownEpisode {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
      /** the station Id #required# */
      stationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbDownEpisodePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbDownEpisodeData;
  }

  /**
   * @description This is the API flow that should be called when the user Thumb down a track in the custom radio. Multiple 'trackId' fields can be specified.
   * @tags custom radio
   * @name ThumbDownTrack
   * @request POST:/api/v1/radio/{ownerProfileId}/{radioStationId}/thumbsDownTrack
   * @deprecated
   * @response `201` `ThumbDownTrackData` an object representing the results of the operation
   * @response `400` `void` 2: user.logged.out
   * @response `404` `void` 4: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ThumbDownTrack {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      /** #required# */
      radioStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbDownTrackPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbDownTrackData;
  }

  /**
   * @description Thumb down a track played in Live radio. </br></br> Multiple 'trackId' fields can be specified.</br></br> <p/>
   * @tags live radio
   * @name ThumbsDownTrack
   * @request POST:/api/v1/liveRadio/{ownerProfileId}/{liveRadioStationId}/thumbsDownTrack
   * @deprecated
   * @response `201` `ThumbsDownTrackData` an object representing the results of the operation
   * @response `400` `void` 2: user.logged.out
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ThumbsDownTrack {
    export type RequestParams = {
      /**
       * #required#
       * @format int32
       */
      liveRadioStationId: number;
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbsDownTrackPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbsDownTrackData;
  }

  /**
   * @description To reset thumbs tracks.</br></br> Multiple 'trackId' fields can be specified.</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>5</td> <td>404</td> <td>not.found</td> </tr> </table>
   * @tags live radio
   * @name ThumbsResetTrack
   * @request POST:/api/v1/liveRadio/{ownerProfileId}/{liveRadioStationId}/thumbsResetTrack
   * @deprecated
   * @response `201` `ThumbsResetTrackData` an object representing the results of the operation
   */
  export namespace ThumbsResetTrack {
    export type RequestParams = {
      /** @format int32 */
      liveRadioStationId: number;
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbsResetTrackPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbsResetTrackData;
  }

  /**
   * @description To reset thumps tracks.</br></br> Multiple 'trackId' fields can be specified.
   * @tags custom radio
   * @name ThumbsResetTrack2
   * @request POST:/api/v1/radio/{ownerProfileId}/{radioStationId}/thumbsResetTrack
   * @deprecated
   * @response `201` `ThumbsResetTrack2Data`
   * @response `400` `void` 2: user.logged.out
   * @response `404` `void` 4: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ThumbsResetTrack2 {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      radioStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbsResetTrack2Payload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbsResetTrack2Data;
  }

  /**
   * @description Thumb up a track played in Live radio. </br></br> Multiple 'trackId' fields can be specified.</br></br> <p/>
   * @tags live radio
   * @name ThumbsUpTrack
   * @request POST:/api/v1/liveRadio/{ownerProfileId}/{liveRadioStationId}/thumbsUpTrack
   * @deprecated
   * @response `201` `ThumbsUpTrackData` an object representing the results of the operation
   * @response `400` `void` 2: user.logged.out
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ThumbsUpTrack {
    export type RequestParams = {
      /** @format int32 */
      liveRadioStationId: number;
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbsUpTrackPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbsUpTrackData;
  }

  /**
   * @description This is the API flow that should be called when the user Thumb up a track in the custom radio. Multiple 'trackId' fields can be specified.
   * @tags custom radio
   * @name ThumbsUpTrack2
   * @request POST:/api/v1/radio/{ownerProfileId}/{radioStationId}/thumbsUpTrack
   * @deprecated
   * @response `201` `ThumbsUpTrack2Data` an object representing the results of the operation
   * @response `400` `void` 2: user.logged.out
   * @response `404` `void` 4: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ThumbsUpTrack2 {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
      /** #required# */
      radioStationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbsUpTrack2Payload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbsUpTrack2Data;
  }

  /**
   * @description Thumb up an episode.</br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>605</td> <td>400</td> <td>talk.bad.episode</td> </tr> <tr> <td>606</td> <td>400</td> <td>talk.bad.station</td> </tr> <tr> <td>7</td> <td>401</td> <td>operation.not.allowed</td> </tr> </table>
   * @tags talk radio
   * @name ThumbUpEpisode
   * @request POST:/api/v1/talk/{ownerProfileId}/{stationId}/thumbsUpEpisode
   * @deprecated
   * @response `201` `ThumbUpEpisodeData` an object representing the results of the operation
   */
  export namespace ThumbUpEpisode {
    export type RequestParams = {
      /**
       * #required#
       * @format int64
       */
      ownerProfileId: number;
      /** the station Id #required# */
      stationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbUpEpisodePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ThumbUpEpisodeData;
  }

  /**
   * @description Get top X tracks by genre <br/> <br/> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> <tr> <td>307</td> <td>500</td> <td>error.price.retrieve</td> </tr> </table>
   * @tags catalog
   * @name TopSongs
   * @request GET:/api/v1/catalog/getTopSongsByGenre
   * @deprecated
   * @response `200` `TopSongsData` list of tracks sorted by popularity
   */
  export namespace TopSongs {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * ISO Country code. This should be the country code that is
       * returned from the login call.
       * @default "US"
       */
      countryCode?: string;
      /**
       * filter by genre id
       * @format int32
       */
      genreId?: number;
      /**
       * max number of tracks to return
       * @format int32
       * @default "10"
       */
      maxRows?: number;
      /** @format int32 */
      vendorGenreId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TopSongsData;
  }

  /**
   * @description Transfer a user's OAuth credentials
   * @tags customer care
   * @name TransferAccessToken
   * @request POST:/api/v1/secure/cc/transferOauthCred
   * @response `201` `TransferAccessTokenData`
   * @response `400` `void` 101: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace TransferAccessToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TransferAccessTokenPayload;
    export type RequestHeaders = {};
    export type ResponseBody = TransferAccessTokenData;
  }

  /**
   * @description Update a users access token <br/> </br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>112</td> <td>400</td> <td>invalid.fbAccessToken</td> </tr> <tr> <td>114</td> <td>500</td> <td>service.fb.unavailable</td> </tr> <tr> <td>2</td> <td>400</td> <td>user.logged.out</td> </tr> <tr> <td>111</td> <td>400</td> <td>incorrect.fbCred</td> </tr> <tr> <td>117</td> <td>400</td> <td>invalidtype.oauth</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags account
   * @name UpdateAccessToken
   * @request POST:/api/v1/account/updateOauthCred
   * @response `201` `UpdateAccessTokenData` Success message
   */
  export namespace UpdateAccessToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateAccessTokenPayload;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateAccessTokenData;
  }

  /**
   * @description Update user's profile. fields include First Name,Last Name,Phone Number, Birth Month,Birth Day,Birth Year,Gender,Street Address,City, State, Zip Code,User Image for only email Users not Facebook users </br></br>
   * @tags profile
   * @name UpdateProfile
   * @request POST:/api/v1/profile/updateProfile
   * @response `201` `UpdateProfileData` Success message
   * @response `400` `void` 2: user.logged.out
   * @response `500` `void` 1: service.unavailable
   */
  export namespace UpdateProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateProfilePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateProfileData;
  }

  /**
   * @description Set a new password for a user associated w/ the valid profile/session id combo.
   * @tags account
   * @name UpdatePw
   * @request POST:/api/v1/account/updatePw
   * @response `201` `UpdatePwData` Success message
   * @response `400` `void` 2: user.logged.out, 106 : invalid.password, 131 : password.policy.error, 143 : password.policy.invalid.chars.error,141 : password.policy.common.error, 140 : password.policy.weak.error, 142 : password.policy.reuse.error
   * @response `500` `void` 1: service.unavailable
   */
  export namespace UpdatePw {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdatePwPayload;
    export type RequestHeaders = {
      'User-Agent'?: string;
      'X-hostName'?: string;
    };
    export type ResponseBody = UpdatePwData;
  }

  /**
   * @description Update user's password and also dis-associate a user from a token
   * @tags customer care
   * @name UpdatePw2
   * @request POST:/api/v1/secure/cc/updatePw
   * @response `201` `UpdatePw2Data`
   * @response `400` `void` 109 : invalid.email
   * @response `500` `void` 1: service.unavailable
   */
  export namespace UpdatePw2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdatePw2Payload;
    export type RequestHeaders = {
      'User-Agent'?: string;
      'X-hostName'?: string;
    };
    export type ResponseBody = UpdatePw2Data;
  }

  /**
   * @description Upgrades an anonymous account to a registered account (email or oauth)
   * @tags account
   * @name UpgradeAnonAccount
   * @request POST:/api/v1/account/upgradeAnonAccount{trackingParams}
   * @response `201` `UpgradeAnonAccountData` a create user response
   * @response `400` `void` 102: account.creation.error
   * @response `403` `void` 118: country.not.supported
   * @response `500` `void` 114: service.fb.unavailable
   */
  export namespace UpgradeAnonAccount {
    export type RequestParams = {
      /** tracking parameters */
      trackingParams: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpgradeAnonAccountPayload;
    export type RequestHeaders = {
      'Fastly-Client-IP'?: string;
      'User-Agent'?: string;
      'X-GEO-COUNTRY'?: string;
    };
    export type ResponseBody = UpgradeAnonAccountData;
  }

  /**
   * @description Checks to see if a user exists in the system based on either email or oauth ID. <br/> If the accessTokenType parameter is passed in then the oauthUuid will be checked, otherwise the email will be checked. <br/> </br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>109</td> <td>400</td> <td>invalid.email</td> </tr> <tr> <td>6</td> <td>400</td> <td>invalid.host</td> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table> </form>
   * @tags account
   * @name UserExists
   * @request GET:/api/v1/account/userExists
   * @response `200` `UserExistsData`
   */
  export namespace UserExists {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Access Token Type */
      accessTokenType?: string;
      host?: string;
      /** OAuth UUID */
      oauthUuid?: string;
      /** Users email address */
      userName?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UserExistsData;
  }

  /**
   * @description Gets user's country based on the IP address. </br></br> Error Codes / Throws <table border="1"> <tr> <th>ampCode</th> <th>httpCode</th> <th>Description</th> </tr> <tr> <td>1</td> <td>500</td> <td>service.unavailable</td> </tr> </table>
   * @tags account
   * @name ValidateIp
   * @request GET:/api/v1/account/getCountry
   * @response `200` `ValidateIpData` ValidateIPRestValue
   */
  export namespace ValidateIp {
    export type RequestParams = {};
    export type RequestQuery = {
      /** User's IP address #required# */
      ip?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** User's city(extracted from the fastly header) */
      'X-GEO-CITY'?: string;
      /** User's country code(extracted from the fastly header) */
      'X-GEO-COUNTRY'?: string;
      /** User's state(extracted from the fastly header) */
      'X-GEO-DMA'?: string;
      /** User's latitude(extracted from the fastly header) */
      'X-GEO-LAT'?: string;
      /** User's longtitude(extracted from the fastly header) */
      'X-GEO-LNG'?: string;
      /** User's zipcode(extracted from the fastly header) */
      'X-GEO-POSTCODE'?: string;
    };
    export type ResponseBody = ValidateIpData;
  }
}

export namespace V2 {
  /**
   * @description Adds genres to the taste profile genre list.  This will preserve any pre-existing genreIds.  This method takes in as the POST body the list of genres to add in the form of: <code> {"genreIds" : [1,2,3]} </code>
   * @tags taste profile
   * @name AddGenres
   * @request POST:/api/v2/taste/{ownerProfileId}/genre/add
   * @response `201` `AddGenresData` HTTP response code
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 413: Illegal operation
   * @response `409` `void` 4: not.modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace AddGenres {
    export type RequestParams = {
      /**
       * id of taste profile to add genres to
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = GenreRestValueInput;
    export type RequestHeaders = {
      /** session */
      'X-Session-Id'?: string;
      /**
       * id of WS client
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = AddGenresData;
  }

  /**
   * @description Playlist station add For followed stations, please use updated paths: PUT '/api/v3/profiles/follows/artist' , '/api/v3/profiles/follows/live' , '/api/v3/collection/user/{userId}/collection/{id}/followers' and '/api/v3/podcast/follows/{podcastId}' <br/> For N4U, add the following to the accept header: <pre> application/vnd.iheart+json;version=2.1 </pre>
   * @tags playlist - custom
   * @name AddStation
   * @request POST:/api/v2/playlists/{profileId}/{type}/{contentId}
   * @response `101` `void` 400: invalid.user
   * @response `201` `AddStationData`
   * @response `400` `void` 400: size.exceeded
   * @response `403` `void` 751: favorites.add.noname
   * @response `404` `void` 501: radio.nodata
   * @response `409` `void` 750: favorites.limit.reached
   * @response `500` `void` 1: service.unavailable
   */
  export namespace AddStation {
    export type RequestParams = {
      /** content to seed the station */
      contentId: string;
      /** @format int64 */
      profileId: number;
      /** options: TRACK,ARTIST,FEATUREDSTATION,TALKSHOW,TALKTHEME,LIVE,CLIP */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = AddStationPayload;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * id of the user it will be added to
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = AddStationData;
  }

  /**
   * @description Adds suppressed stations to the taste profile.  This will preserve any pre-existing stations.  This method takes in as the POST body the list of SuppressedStationRV to add in the form of: <code> {"stations":[{"id":"1","type":"CR"},{"id":"2","type":"LR"},{"id":"3","type":"DL","dlType":"CURATED"}]} </code> FOR DL types, pass in the property subtype from the RECS response using the parameter dlType in the json post.
   * @tags taste profile
   * @name AddSuppressedStations
   * @request POST:/api/v2/taste/{ownerProfileId}/suppress/stations/add
   * @response `201` `AddSuppressedStationsData` HTTP response code
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `409` `void` 419: Not Modifed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace AddSuppressedStations {
    export type RequestParams = {
      /**
       * id of taste profile to add genres to
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = SuppressedStationRVList;
    export type RequestHeaders = {
      /** session */
      'X-Session-Id'?: string;
      /**
       * id of WS client
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = AddSuppressedStationsData;
  }

  /**
   * @description Add a user favorite to the user's profile. This is deprecated. See updated paths: PUT '/api/v3/profiles/follows/artist' and '/api/v3/profiles/follows/live'
   * @tags favorite
   * @name AddUserFavorite
   * @request POST:/api/v2/profile/{profileId}/favorites/station/{stationType}/{stationId}
   * @deprecated
   * @response `201` `AddUserFavoriteData` Success or failure of operation and optionally fully populated station.
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 12: forbidden.operation
   * @response `404` `void` 1: not found
   * @response `409` `void` 1: not modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace AddUserFavorite {
    export type RequestParams = {
      /**
       * owner profile id
       * @format int64
       */
      profileId: number;
      /** id of the station to add */
      stationId: string;
      /** LR = Live Radio, CR = Custom Radio, CT = Custom Talk */
      stationType: 'CR' | 'CRA' | 'CT' | 'LR' | 'P' | 'PC';
    };
    export type RequestQuery = {};
    export type RequestBody = AddUserFavoritePayload;
    export type RequestHeaders = {
      /** user session id */
      'X-Session-Id'?: string;
      /**
       * user profile id
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = AddUserFavoriteData;
  }

  /**
   * @description Clear all user favorites.
   * @tags favorite
   * @name ClearUserFavorites
   * @request POST:/api/v2/profile/{profileId}/favorites/delete
   * @response `201` `ClearUserFavoritesData` success or failure of operation.
   * @response `401` `void` 1: invalid user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ClearUserFavorites {
    export type RequestParams = {
      /**
       * owner profile id
       * @format int64
       */
      profileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** user session id */
      'X-Session-Id'?: string;
      /**
       * user profile id
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = ClearUserFavoritesData;
  }

  /**
   * @description Delete a station This is deprecated. See updated paths: DELETE '/api/v3/profiles/follows/artist/{artistId}' , '/api/v3/profiles/follows/live/{stationId}' , '/api/v3/collection/user/{userId}/collection/{id}' and '/api/v3/podcast/follows/{podcastId}'
   * @tags playlist - custom
   * @name DeleteStation
   * @request POST:/api/v2/playlists/{profileId}/{type}/{stationId}/delete
   * @deprecated
   * @response `201` `DeleteStationData`
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 1: forbidden.operation
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace DeleteStation {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /** ID of the station to delete */
      stationId: string;
      /** the type of station they are trying to delete */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * The user to call delete on
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = DeleteStationData;
  }

  /**
   * @description Delete a favorite from the users list.  May cause the position of other favorites to change depending on order. This is deprecated. See updated paths: DELETE '/api/v3/profiles/follows/artist/{artistId}' and '/api/v3/profiles/follows/live/{stationId}'
   * @tags favorite
   * @name DeleteUserFavorite
   * @request POST:/api/v2/profile/{profileId}/favorites/station/{stationType}/{stationId}/delete
   * @deprecated
   * @response `101` `void` 1: invalid user
   * @response `201` `DeleteUserFavoriteData` Success or failure of operation.
   * @response `400` `void` 6: bad parameter
   * @response `403` `void` 12: forbidden.operation
   * @response `409` `void` 1: not modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace DeleteUserFavorite {
    export type RequestParams = {
      /**
       * owner profile id
       * @format int64
       */
      profileId: number;
      /** station id */
      stationId: string;
      /** station type */
      stationType: 'CR' | 'CRA' | 'CT' | 'LR' | 'P' | 'PC';
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** user session id */
      'X-Session-Id'?: string;
      /**
       * user profile id
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = DeleteUserFavoriteData;
  }

  /**
   * @description Get Ads to play
   * @tags playback
   * @name GetAds
   * @request POST:/api/v2/playback/ads
   * @response `201` `GetAdsData`
   * @response `400` `void` 123: bad.request
   * @response `401` `void` 101: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetAds {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AdRequest;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
    };
    export type ResponseBody = GetAdsData;
  }

  /**
   * @description If both hostName and countryCode are not passed, then it will default to countryCode defined in config.
   * @tags content
   * @name GetCities
   * @request GET:/api/v2/content/cities
   * @response `200` `GetCitiesData`
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetCities {
    export type RequestParams = {};
    export type RequestQuery = {
      /** If this is passed, it will return all cities within that country. */
      countryCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** If this is passed, it will return all cities that country is ALLOWED to see. */
      'X-hostName'?: string;
    };
    export type ResponseBody = GetCitiesData;
  }

  /**
   * No description
   * @tags playlist - custom
   * @name GetContent
   * @request POST:/api/v2/playlists/{profileId}/{stationType}/{stationId}/content
   * @response `201` `GetContentData`
   * @response `400` `void` 6: invalid.host
   * @response `401` `void` 7: operation.not.allowed
   * @response `404` `void` 404: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetContent {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /** id of the station */
      stationId: string;
      /** stationTypes options: TRACK,ARTIST,FEATUREDSTATION,TALKSHOW,TALKTHEME,LIVE,RADIO,TALK,FAVORITES */
      stationType:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = GetContentPayload;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
      /** hostName for the user */
      'X-hostName'?: string;
    };
    export type ResponseBody = GetContentData;
  }

  /**
   * No description
   * @tags content
   * @name GetCountries
   * @request GET:/api/v2/content/countries
   * @response `200` `GetCountriesData`
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetCountries {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-hostName'?: string;
    };
    export type ResponseBody = GetCountriesData;
  }

  /**
   * @description Get a specific genre.
   * @tags content
   * @name GetGenre
   * @request GET:/api/v2/content/genre/{id}
   * @response `200` `GetGenreData` genre data or 404 if doesn't exist.
   * @response `400` `void` 123: bad.request
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetGenre {
    export type RequestParams = {
      /** @format int32 */
      id: number;
    };
    export type RequestQuery = {
      /** Optional list of fields to return.  Legal elements: 'name', 'logo' */
      fields?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** @format int32 */
      ETag?: number;
    };
    export type ResponseBody = GetGenreData;
  }

  /**
   * @description Get genres.  This endpoint is new as of AMP release 2.22.  The pre-existing genre endpoint has been removed. Any old clients using existing WS will need to be updated to use new endpoint. NOTE: header parameter 'hostName' declared but unused intentionally by directive.
   * @tags content
   * @name GetGenres
   * @request GET:/api/v2/content/genre
   * @response `200` `GetGenresData` genres
   * @response `400` `void` 123: bad.request
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetGenres {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Optional list of fields to return.  Legal elements: 'name', 'logo' */
      fields?: string;
      /**
       * returns all genres if unspecified.
       * @format int32
       */
      limit?: number;
      /**
       * 0 if unspecified.
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * show invisible genres.  Default is false.
       * @default "false"
       */
      showHidden?: boolean;
      /**
       * Optional, can be 'sort' or 'name'.  Default is 'sort'.
       * @default "sort"
       */
      sortBy?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Unused */
      'X-hostName'?: string;
      /** @format int32 */
      ETag?: number;
    };
    export type ResponseBody = GetGenresData;
  }

  /**
   * @description Returns a list of all the tracks for a user, including live.
   * @tags history
   * @name GetHistoryWithLiveEvents
   * @request GET:/api/v2/history/{ownerProfileId}/getAll
   * @response `200` `GetHistoryWithLiveEventsData`
   * @response `400` `void` 2: user.logged.out
   * @response `401` `void` 7: operation.not.allowed
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetHistoryWithLiveEvents {
    export type RequestParams = {
      /** @format int64 */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * @format int32
       * @default "10"
       */
      numResults?: number;
      /** @format int64 */
      profileId: number;
      sessionId?: string;
      /**
       * @format int64
       * @default "0"
       */
      startTime?: number;
      types?: string[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHistoryWithLiveEventsData;
  }

  /**
   * @description Get LiveStation By Id. This v2 endpoint shouldn't be used in the future because ElasticSearch's use will be deprecated. We recommend using the v3 /livemeta/getStation in the livemeta service instead.
   * @tags content
   * @name GetLiveStationById
   * @request GET:/api/v2/content/liveStations/{id}
   * @deprecated
   * @response `200` `GetLiveStationByIdData`
   * @response `400` `void` 6: invalid.host
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetLiveStationById {
    export type RequestParams = {
      /** To search across multiple ids, please use a comma separate list. IE: 1,2,3,4 */
      id: string;
    };
    export type RequestQuery = {
      /**
       * If false, it will only return the primary market. If true, it will return all the markets with the live station.
       * @default "false"
       */
      allMarkets?: boolean;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-hostName'?: string;
    };
    export type ResponseBody = GetLiveStationByIdData;
  }

  /**
   * No description
   * @tags content
   * @name GetLiveStationGenres
   * @request GET:/api/v2/content/liveStationGenres
   * @response `200` `GetLiveStationGenresData`
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetLiveStationGenres {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Name of the city to search for */
      city?: string;
      /**
       * City ID is the same as Market ID
       * @format int32
       */
      cityId: number;
      /** Country Code to search for. US, AU, etc */
      countryCode?: string;
      /**
       * Country ID to search for
       * @format int32
       */
      countryId: number;
      /**
       * Lat/Lng will search for a market with the specific radius
       * @format double
       */
      lat?: number;
      /**
       * Lat/Lng will search for a market with the specific radius
       * @format double
       */
      lng?: number;
      /** State abbreviation to search for. FL, AL, MT, etc */
      stateAbbr?: string;
      /**
       * State ID to search for
       * @format int32
       */
      stateId: number;
      /** Will find your Lat/Lng based on this IP and get the market within a specific radius */
      useIP: boolean;
      /** Zipcode to search for */
      zipCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /**
       * Lat/Lng(extracted from fastly headers) will search for a market with the specific radius
       * @format double
       */
      'X-GEO-LAT'?: number;
      /**
       * Lat/Lng(extracted from fastly headers) will search for a market with the specific radius
       * @format double
       */
      'X-GEO-LNG'?: number;
      /** Used to get the users providers */
      'X-hostName'?: string;
    };
    export type ResponseBody = GetLiveStationGenresData;
  }

  /**
   * No description
   * @tags content
   * @name GetLiveStations
   * @request GET:/api/v2/content/liveStations
   * @response `200` `GetLiveStationsData`
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetLiveStations {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * If false, it will only return the primary market. If true, it will return all the markets with the live station.
       * @default "false"
       */
      allMarkets?: boolean;
      /** market to apply boost */
      boostMarketId?: string;
      /** The Live Stations call letters */
      callLetters?: string;
      changedSince?: string;
      /** City of the markets for the station */
      city?: string;
      /** The countryCode of the station */
      countryCode?: string;
      /**
       * Country ID for the markets for the station
       * @format int32
       * @default "0"
       */
      countryId?: number;
      fccFacilityId?: string;
      /** List of fields to be returned. */
      fields?: string;
      /** @default "false" */
      forceNewImpl?: boolean;
      /**
       * Genre Id of the live stations to search on.
       * @format int32
       * @default "0"
       */
      genreId?: number;
      /** To search across multiple ids, please use a comma separate list. IE: 1,2,3,4 */
      id?: string;
      /**
       * lat of the markets associated with the station.
       * @format double
       */
      lat?: number;
      /**
       * limit of results to come back from each type requests.
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * lng of the markets associated with the station.
       * @format double
       */
      lng?: number;
      /** id of the market */
      marketId?: string;
      /**
       * offset value
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** the primary market */
      primaryMarket?: string;
      /**
       * Query to search on
       * @default ""
       */
      q?: string;
      rdsPiCode?: string;
      returnNonActive?: string;
      /** Which value to sort on. use the prefix + on the field to change order of the sort. */
      sort?: string;
      /** State of the markets for the station */
      stateAbbr?: string;
      /**
       * State ID for the markets for the station
       * @format int32
       * @default "0"
       */
      stateId?: number;
      /** comma separated list of stream types */
      streamType?: string;
      /** @default "false" */
      useIP?: boolean;
      /** zipCode of the markets for the station */
      zipCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /**
       * lat(extracted from fastly header) of the markets associated with the station.
       * @format double
       */
      'X-GEO-LAT'?: number;
      /**
       * lng(extracted from fastly header) of the markets associated with the station.
       * @format double
       */
      'X-GEO-LNG'?: number;
      /**
       * @format int64
       * @default "0"
       */
      'X-User-Id'?: number;
      /** Hostname of the user. */
      'X-hostName'?: string;
    };
    export type ResponseBody = GetLiveStationsData;
  }

  /**
   * No description
   * @tags content
   * @name GetMarkets
   * @request GET:/api/v2/content/markets
   * @response `200` `GetMarketsData`
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetMarkets {
    export type RequestParams = {};
    export type RequestQuery = {
      city?: string;
      /** @format int32 */
      cityId: number;
      countryCode?: string;
      /** @format int32 */
      countryId: number;
      /** @format double */
      lat?: number;
      /**
       * @format int32
       * @default "10"
       */
      limit?: number;
      /** @format double */
      lng?: number;
      /**
       * @format int32
       * @default "0"
       */
      offset?: number;
      sortBy?: string;
      stateAbbr?: string;
      /** @format int32 */
      stateId: number;
      /** @default "false" */
      useIP?: boolean;
      zipCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /**
       * lat extracted from fastly header
       * @format double
       */
      'X-GEO-LAT'?: number;
      /**
       * lng extracted from fastly header
       * @format double
       */
      'X-GEO-LNG'?: number;
      'X-hostName'?: string;
    };
    export type ResponseBody = GetMarketsData;
  }

  /**
   * No description
   * @tags content
   * @name GetMarketsById
   * @request GET:/api/v2/content/markets/{id}
   * @response `200` `GetMarketsByIdData`
   * @response `404` `void` 5 not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetMarketsById {
    export type RequestParams = {
      /**
       * To search across multiple ids, please use a comma separate list. IE: 1,2,3,4
       * @format int32
       */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMarketsByIdData;
  }

  /**
   * @description Delete user privacy data.  This method takes in request via JSON in the form of: <code> { "profileId": 123, "requestId": "string", "receiptPath": "string", "requestType": "Deletes", "presignedURL": "string", "responsibility": "string", "complianceType": ["CCPA"] } </code>
   * @tags playlist - custom
   * @name GetPrivacyDelete
   * @request DELETE:/api/v2/playlists/privacy/delete
   * @response `204` `GetPrivacyDeleteData` HTTP response code
   * @response `400` `void` 123: bad.request
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetPrivacyDelete {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = string;
    export type RequestHeaders = {};
    export type ResponseBody = GetPrivacyDeleteData;
  }

  /**
   * @description Request user privacy data.  This method takes in request via JSON in the form of: <code> { "profileId": 123, "requestId": "string", "receiptPath": "string", "requestType": "Request", "presignedURL": "string", "responsibility": "string", "complianceType": ["CCPA"] } </code>
   * @tags playlist - custom
   * @name GetPrivacyRequest
   * @request POST:/api/v2/playlists/privacy/request
   * @response `201` `GetPrivacyRequestData` HTTP response code
   * @response `400` `void` 400: playlist.jsonparsing
   * @response `403` `void` 1: service.unavailable
   * @response `500` `void` 123: bad.request
   */
  export namespace GetPrivacyRequest {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = string;
    export type RequestHeaders = {};
    export type ResponseBody = GetPrivacyRequestData;
  }

  /**
   * @description Get recommendations based on genres.
   * @tags recs
   * @name GetRecommendationsForGenres
   * @request GET:/api/v2/recs/genre
   * @response `200` `GetRecommendationsForGenresData`
   * @response `400` `void` 3: bad parameter
   * @response `401` `void` 1: invalid user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetRecommendationsForGenres {
    export type RequestParams = {};
    export type RequestQuery = {
      fields?: string;
      /** genre ids */
      genreId?: string[];
      /**
       * the latitude of the client
       * @format double
       */
      lat?: number;
      /**
       * total number to return. (Required)
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * the longitude of the client
       * @format double
       */
      lng?: number;
      /**
       * offset from start of list (0 is first)
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * LRRM - Live Radio in Recommended Market
       * CR - Artist Station
       * DL - content
       */
      template?: string;
      /** the zipcode of the client */
      zipCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /**
       * the latitude of the client extarcted from the fastly header
       * @format double
       */
      'X-GEO-LAT'?: number;
      /**
       * the longtitude of the client extarcted from the fastly header
       * @format double
       */
      'X-GEO-LNG'?: number;
      'X-hostName'?: string;
      /** @format int32 */
      ETag?: number;
    };
    export type ResponseBody = GetRecommendationsForGenresData;
  }

  /**
   * @description If both hostName and countryCode are not passed, then it will default to countryCode = US.
   * @tags content
   * @name GetStates
   * @request GET:/api/v2/content/states
   * @response `200` `GetStatesData`
   * @response `400` `void` 6: invalid.host
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStates {
    export type RequestParams = {};
    export type RequestQuery = {
      /** If this is passed, it will return all cities within that country. */
      countryCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** If this is passed, it will return all cities that country is ALLOWED to see. */
      'X-hostName'?: string;
    };
    export type ResponseBody = GetStatesData;
  }

  /**
   * @description This is deprecated. See updated paths: GET '/api/v3/profiles/follows/artist/{artistId}' and '/api/v3/profiles/follows/live/{liveStationId}'
   * @tags playlist - custom
   * @name GetStationBySeedId
   * @request GET:/api/v2/playlists/{profileId}/{type}/seedId/{seedId}
   * @deprecated
   * @response `200` `GetStationBySeedIdData`
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStationBySeedId {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /**
       * seed id to check against
       * @format int64
       */
      seedId: number;
      /** options: TRACK,ARTIST,FEATUREDSTATION,TALKSHOW,TALKTHEME,LIVE,RADIO,TALK,FAVORITES */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * the profile id of the person making the request
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = GetStationBySeedIdData;
  }

  /**
   * @description Get Stations by type For followed stations, please use updated paths: GET '/api/v3/profiles/follows/artist' , '/api/v3/profiles/follows/live' , '/api/v3/collection/user/{userId}/collection' and '/api/v3/podcast/follows' <br/> For N4U, add the following to the accept header: <pre> application/vnd.iheart+json;version=2.1 </pre>
   * @tags playlist - custom
   * @name GetStations
   * @request GET:/api/v2/playlists/{profileId}
   * @response `200` `GetStationsData`
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 1: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStations {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
    };
    export type RequestQuery = {
      /** @default "" */
      campaignId?: string;
      /** fields you want returned. not yet implemented. */
      fields?: string;
      /** @default "false" */
      includePersonalized?: boolean;
      /**
       * limit
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * offset
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * NAME, LAST_PLAYED, PLAYCOUNT, REGISTERED_DATE, LAST_MODIFIED_DATE,TYPE
       * @default "NAME"
       */
      sortBy?:
        | 'LAST_MODIFIED_DATE'
        | 'LAST_PLAYED'
        | 'NAME'
        | 'PLAYCOUNT'
        | 'REGISTERED_DATE'
        | 'TYPE';
      /**
       * options: TRACK,ARTIST,FEATUREDSTATION,COLLECTION,TALKSHOW,TALKTHEME,LIVE,RADIO,TALK,FAVORITES.<br><br>
       * RADIO is a parent of TRACK,ARTIST,FEATUREDSTATION,FAVORITES<br><br>
       * TALK is a parent of TALKSHOW and TALKTHEME<br><br>
       * There is never a need to request RADIO and TRACK. Doing so will only return TRACKS since you are asking for a subset of radio.<br>
       * Same for TALK and TALKSHOW. <br><br>
       * @default ""
       */
      stationTypes?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      'Accept-Language'?: string;
      'X-Session-Id'?: string;
      /**
       * user of the person you are looking up
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = GetStationsData;
  }

  /**
   * @description Get station by type and ID For followed stations, please use updated paths: GET '/api/v3/profiles/follows/artist/{artistId}' , '/api/v3/profiles/follows/live/{liveStationId}' , '/api/v3/collection/follows/user/{userId}/collection/{id}' and '/api/v3/podcast/follows/{podcastId}'
   * @tags playlist - custom
   * @name GetStationsById
   * @request GET:/api/v2/playlists/{profileId}/{type}/{stationId}
   * @response `200` `GetStationsByIdData`
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 1: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStationsById {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /** id of the station */
      stationId: string;
      /**
       * stationTypes options: TRACK,ARTIST,FEATUREDSTATION,TALKSHOW,TALKTHEME,LIVE,RADIO,TALK,FAVORITES
       * @default ""
       */
      type: string;
    };
    export type RequestQuery = {
      /** use this to limit the response fields */
      fields?: string;
      /**
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * NAME
       * @default "NAME"
       */
      sortBy?:
        | 'LAST_MODIFIED_DATE'
        | 'LAST_PLAYED'
        | 'NAME'
        | 'PLAYCOUNT'
        | 'REGISTERED_DATE'
        | 'TYPE';
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * profile id of the user performing the search
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = GetStationsByIdData;
  }

  /**
   * @description Gets streams and metadata for custom radio and on demand types. <br/>This is the generic method for all streaming needs. <pre> { "contentIds": [],            // Array of contentIds in case you know what you want to play "stationId": "string-id",    // Id of the container (radio station, collection, mymusic, album or live station id) "stationType": "string",     // Possible values: RADIO/COLLECTION/MYMUSIC/ALBUM/LIVE "hostName": "string",        // hostname for the client "playedFrom": int,           // From where the track is being played "limit": int,                // Optional parameter. Its only used for RADIO and will default to 3 if not provided "startStream": {             // Only used for RADIO, when a specific track is needed to play first "contentId": 1,          // Id of the track that you want amp to generate in case of SONG2START "reason": "SONG2START"   // Possible values: SONG2START/ARTIST2START } } </pre>
   * @tags playback
   * @name GetStreams
   * @request POST:/api/v2/playback/streams
   * @response `201` `GetStreamsData`
   * @response `400` `void` 123: bad.request
   * @response `401` `void` 101: invalid.user
   * @response `403` `void` 403 : forbidden.operation
   * @response `404` `void` 617: station.no.content
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetStreams {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GetStreamsPayload;
    export type RequestHeaders = {
      'Fastly-Client-IP'?: string;
      'User-Agent'?: string;
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
      'X-hostName'?: string;
    };
    export type ResponseBody = GetStreamsData;
  }

  /**
   * @description For a given user's station, return the suppressed artist ids.
   * @tags taste profile
   * @name GetSuppressedArtists
   * @request GET:/api/v2/taste/{ownerProfileId}/station/{stationId}/suppress/artists
   * @response `200` `GetSuppressedArtistsData`
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetSuppressedArtists {
    export type RequestParams = {
      /**
       * authenticated user
       * @format int64
       */
      ownerProfileId: number;
      /** id of station */
      stationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** authenticated user session */
      'X-Session-Id'?: string;
      /**
       * target user
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = GetSuppressedArtistsData;
  }

  /**
   * @description For a given user, return the suppressed stations.
   * @tags taste profile
   * @name GetSuppressedStations
   * @request GET:/api/v2/taste/{ownerProfileId}/suppress/stations
   * @response `200` `GetSuppressedStationsData`
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetSuppressedStations {
    export type RequestParams = {
      /**
       * authenticated user
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** authenticated user session */
      'X-Session-Id'?: string;
      /**
       * target user
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = GetSuppressedStationsData;
  }

  /**
   * @description Get a user's taste profile.
   * @tags taste profile
   * @name GetTasteProfile
   * @request GET:/api/v2/taste/{ownerProfileId}
   * @response `200` `GetTasteProfileData` users taste profile
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetTasteProfile {
    export type RequestParams = {
      /**
       * profile of account data to be retrieved from
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /**
       * list of fields to retrieve, no value interpreted as all fields requested.  Possible values:
       * profileId
       * fbLiveStationLikes
       * fbArtistLikes
       * suppressedArtists
       * stationThumbs
       * genreIds
       * @default ""
       */
      fields?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** session */
      'X-Session-Id'?: string;
      /**
       * client user
       * @format int64
       */
      'X-User-Id': number;
      /** @format int32 */
      ETag?: number;
    };
    export type ResponseBody = GetTasteProfileData;
  }

  /**
   * @description Playlist Get users thumbs This is deprecated. See updated path: GET '/api/v3/profiles/thumbs'
   * @tags playlist - custom
   * @name GetThumbs
   * @request GET:/api/v2/playlists/{profileId}/thumbs
   * @deprecated
   * @response `200` `GetThumbsData`
   * @response `401` `void` 101: invalid.user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetThumbs {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
    };
    export type RequestQuery = {
      /** what fields to return */
      fields?: string;
      /**
       * how many to return
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * the offset of the list
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** RADIOSTATION,STATION_TYPE,LAST_MODIFIED_DATE */
      sortBy?: 'ID' | 'LAST_MODIFIED_DATE' | 'RADIOSTATION' | 'STATION_TYPE';
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * id of the profile to search on
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = GetThumbsData;
  }

  /**
   * @description Playlist Get users thumbs by type This is deprecated. See updated path: GET '/api/v3/profiles/thumbs'
   * @tags playlist - custom
   * @name GetThumbsByType
   * @request GET:/api/v2/playlists/{profileId}/{type}/thumbs
   * @deprecated
   * @response `200` `GetThumbsByTypeData`
   * @response `401` `void` 101: invalid.user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetThumbsByType {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /** RADIO, TALK or LIVE */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {
      /** what fields to return */
      fields?: string;
      /**
       * how many to return
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * the offset of the list
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** RADIOSTATION,STATION_TYPE,LAST_MODIFIED_DATE */
      sortBy?: 'ID' | 'LAST_MODIFIED_DATE' | 'RADIOSTATION' | 'STATION_TYPE';
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * id of the profile to search on
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = GetThumbsByTypeData;
  }

  /**
   * @description Playlist Get users thumbs by type and station This is deprecated. See updated path: GET '/api/v3/profiles/thumbs/station/{stationId}'
   * @tags playlist - custom
   * @name GetThumbsByTypeAndStation
   * @request GET:/api/v2/playlists/{profileId}/{type}/{stationId}/thumbs
   * @deprecated
   * @response `200` `GetThumbsByTypeAndStationData` List of ThumbResponse
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetThumbsByTypeAndStation {
    export type RequestParams = {
      /**
       * id of the profile to search on
       * @format int64
       */
      profileId: number;
      /** id of the station to get the thumbs for */
      stationId: string;
      /** RADIO, TALK or LIVE */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {
      /** what fields to return */
      fields?: string;
      /**
       * how many to return
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * the offset of the list
       * @format int32
       * @default "0"
       */
      offset?: number;
      /** RADIOSTATION,STATION_TYPE,LAST_MODIFIED_DATE */
      sortBy?: 'ID' | 'LAST_MODIFIED_DATE' | 'RADIOSTATION' | 'STATION_TYPE';
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** session id of the user */
      'X-Session-Id'?: string;
      /**
       * profile id of the user
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = GetThumbsByTypeAndStationData;
  }

  /**
   * @description Return User Favorites.  See https://jira.ccrd.clearchannel.com/browse/AMP-1064 This is deprecated. See updated paths: GET '/api/v3/profiles/follows/artist' and '/api/v3/profiles/follows/live'
   * @tags favorite
   * @name GetUserFavorites
   * @request GET:/api/v2/profile/{profileId}/favorites
   * @deprecated
   * @response `101` `void` 1: invalid user
   * @response `200` `GetUserFavoritesData` the ordered list of favorites for the given user.
   * @response `400` `void` 3: bad parameter
   * @response `403` `void` 12: forbidden.operation
   * @response `404` `void` 5 : not.found
   * @response `409` `void` 4: not.modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetUserFavorites {
    export type RequestParams = {
      /**
       * id of profile owner
       * @format int64
       */
      profileId: number;
    };
    export type RequestQuery = {
      campaignId?: string;
      /**
       * if greater than 0, endpoint will attempt to fill any missing favorites from recommendations.
       * @format int32
       * @default "0"
       */
      hardFill?: number;
      /**
       * number of items to return
       * @format int32
       */
      limit: number;
      /**
       * offset of favorites to return from beginning (0 based)
       * @format int32
       * @default "0"
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /** session id */
      'X-Session-Id'?: string;
      /**
       * id of user
       * @format int64
       */
      'X-User-Id': number;
      /** @format int64 */
      ETag?: number;
    };
    export type ResponseBody = GetUserFavoritesData;
  }

  /**
   * @description Get recommendations based on user profile.
   * @tags recs
   * @name GetUserRecommendations
   * @request GET:/api/v2/recs/{ownerProfileId}
   * @response `200` `GetUserRecommendationsData`
   * @response `400` `void` 3: bad parameter
   * @response `401` `void` 1: invalid user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetUserRecommendations {
    export type RequestParams = {
      /**
       * profile id for user associated with recs
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      /** Use the campaignId to enable additional features. 'foryou_favorites' enables favorites radio and 'foryou_collections' enables both favorites radio and collections to be returned */
      campaignId?: string;
      fields?: string;
      /**
       * the latitude of the client
       * @format double
       */
      lat?: number;
      /**
       * total number to return. (Required)
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * the longitude of the client
       * @format double
       */
      lng?: number;
      /**
       * offset from start of list (0 is first)
       * @format int32
       * @default "0"
       */
      offset?: number;
      /**
       * Comma separated list of structure of returned recs. (Optional)
       * LR - Most Popular Live Radio
       * CR - Recent Live Radio
       * LN - Live stations nearby
       * LRRM - Live Radio Recommended in Market
       * DL - Merch or Slider content
       * Example: LR,LR,CR,LN
       */
      template?: string;
      /** the zipcode of the client */
      zipCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /**
       * the latitude of the client extracted from the fastly header
       * @format double
       */
      'X-GEO-LAT'?: number;
      /**
       * the longitude of the client extracted from the fastly header
       * @format double
       */
      'X-GEO-LNG'?: number;
      /** session id */
      'X-Session-Id'?: string;
      /**
       * profile id of the client
       * @format int64
       */
      'X-User-Id': number;
      'X-hostName'?: string;
      /**
       * optional ETag value.  If passed, server evaluates data and only returns it if new.  Otherwise returns 304.
       * @format int32
       */
      ETag?: number;
    };
    export type ResponseBody = GetUserRecommendationsData;
  }

  /**
   * @description Get recommendations based on user profile for the new Recs carousel.
   * @tags recs
   * @name GetUserRecommendationsForNewView
   * @request GET:/api/v2/recs/new/{ownerProfileId}
   * @response `200` `GetUserRecommendationsForNewViewData`
   * @response `400` `void` 3: bad parameter
   * @response `401` `void` 1: invalid user
   * @response `403` `void` 12: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace GetUserRecommendationsForNewView {
    export type RequestParams = {
      /**
       * profile id for user associated with recs
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {
      fields?: string;
      /**
       * the latitude of the client
       * @format double
       */
      lat?: number;
      /**
       * @format int32
       * @default "10"
       */
      limit?: number;
      /**
       * the longitude of the client
       * @format double
       */
      lng?: number;
      /** the container to show the ordering and offset of the next request. Leave empty on first call */
      pageKey?: string;
      /** the zipcode of the client */
      zipCode?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {
      /**
       * the latitude of the client extracted from the fastly header
       * @format double
       */
      'X-GEO-LAT'?: number;
      /**
       * the longitude of the client extracted from the fastly header
       * @format double
       */
      'X-GEO-LNG'?: number;
      /** session id */
      'X-Session-Id'?: string;
      /**
       * profile id of the client
       * @format int64
       */
      'X-User-Id': number;
      'X-hostName'?: string;
    };
    export type ResponseBody = GetUserRecommendationsForNewViewData;
  }

  /**
   * @description Move a favorite to a new position in favorite list.
   * @tags favorite
   * @name MoveUserFavorite
   * @request POST:/api/v2/profile/{profileId}/favorites/{position}/station/{stationType}/{stationId}
   * @response `101` `void` 2: invalid user
   * @response `201` `MoveUserFavoriteData` success or failure of operation.
   * @response `403` `void` 12: forbidden.operation
   * @response `404` `void` 1: favorite not found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace MoveUserFavorite {
    export type RequestParams = {
      position: string;
      /**
       * owner profile id
       * @format int64
       */
      profileId: number;
      stationId: string;
      stationType: string;
    };
    export type RequestQuery = {};
    export type RequestBody = MoveUserFavoritePayload;
    export type RequestHeaders = {
      /** user session id */
      'X-Session-Id'?: string;
      /**
       * user profile id
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = MoveUserFavoriteData;
  }

  /**
   * @description Rename a station
   * @tags playlist - custom
   * @name RenameStation
   * @request POST:/api/v2/playlists/{profileId}/{type}/{stationId}/rename
   * @response `201` `RenameStationData`
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 1: forbidden.operation
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace RenameStation {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
      /** ID of the station to rename */
      stationId: string;
      /** the type of station they are trying to rename. For favorites radio, type should be set to FAVORITES. */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = RenameStationPayload;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * The user to call rename on
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = RenameStationData;
  }

  /**
   * No description
   * @tags reporting
   * @name ReportStatus
   * @request POST:/api/v2/reporting
   * @deprecated
   * @response `201` `ReportStatusData`
   * @response `400` `void` 6: invalid.host
   * @response `401` `void` 401: invalid.user
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ReportStatus {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStatusPayload;
    export type RequestHeaders = {
      /** session Id for the user. */
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
    };
    export type ResponseBody = ReportStatusData;
  }

  /**
   * No description
   * @tags reporting
   * @name ReportStreamStarted3
   * @request POST:/api/v2/reporting/reportStreamStarted
   * @deprecated
   * @response `201` `ReportStreamStarted3Data`
   */
  export namespace ReportStreamStarted3 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReportStreamStarted3Payload;
    export type RequestHeaders = {};
    export type ResponseBody = ReportStreamStarted3Data;
  }

  /**
   * @description Playlist reset thumbs This is deprecated. See updated path: DELETE '/api/v3/profiles/thumbs'
   * @tags playlist - custom
   * @name ResetThumb
   * @request POST:/api/v2/playlists/{profileId}/{type}/{stationId}/{contentId}/thumbs/reset
   * @deprecated
   * @response `201` `ResetThumbData` boolean
   * @response `401` `void` 101: invalid.user
   * @response `403` `void` 12: forbidden.operation
   * @response `404` `void` 5 : not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ResetThumb {
    export type RequestParams = {
      /**
       * the id of the piece of content
       * @format int32
       */
      contentId: number;
      /** @format int64 */
      profileId: number;
      /** the id of the station that the content is playing on */
      stationId: string;
      /** RADIO or LIVE */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /**
       * profile id of the user
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = ResetThumbData;
  }

  /**
   * @description Set the taste profile genre list.  This will erase any pre-existing genreIds.  This method takes in as the POST body the list of genres to add in the form of: <code> {"genreIds" : [1,2,3]} </code>
   * @tags taste profile
   * @name SetGenres
   * @request POST:/api/v2/taste/{ownerProfileId}/genre
   * @response `201` `SetGenresData` HTTP response code
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `409` `void` 4: not.modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace SetGenres {
    export type RequestParams = {
      /**
       * id of taste profile to add genres to
       * @format int64
       */
      ownerProfileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = GenreRestValueInput;
    export type RequestHeaders = {
      /** session */
      'X-Session-Id'?: string;
      /**
       * id of WS client
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = SetGenresData;
  }

  /**
   * @description Set all user favorites.  Overwrites any pre-existing favorites with passed values.  Favorites are passed in content body.  If one or more favorite IDs is invalid, an error is returned to the client and the user favorites are not changed.
   * @tags favorite
   * @name SetUserFavorites
   * @request POST:/api/v2/profile/{profileId}/favorites
   * @response `201` `SetUserFavoritesData` Success or failure of operation.
   * @response `400` `void` 3: size.exceeded
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `404` `void` 5: not.found
   * @response `500` `void` 1: service.unavailable
   */
  export namespace SetUserFavorites {
    export type RequestParams = {
      /**
       * owner profile id
       * @format int64
       */
      profileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UserFavoritesRestValueInput;
    export type RequestHeaders = {
      /** user session id */
      'X-Session-Id'?: string;
      /**
       * user profile id
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = SetUserFavoritesData;
  }

  /**
   * @description Sets the variety for a station.  Valid values in order of increasing variety are TOP_HITS, MIX and VARIETY.
   * @tags playlist - custom
   * @name SetVariety
   * @request POST:/api/v2/playlists/{profileId}/{type}/{stationId}/variety
   * @response `201` `SetVarietyData` true if successful; false otherwise
   * @response `400` `void` bad.request
   * @response `401` `void` 401: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `500` `void` 1: service.unavailable
   */
  export namespace SetVariety {
    export type RequestParams = {
      /**
       * the user id of the user owning the station
       * @format int64
       */
      profileId: number;
      /** the station id */
      stationId: string;
      /** the type of station */
      type:
        | 'ARTIST'
        | 'CLIP'
        | 'COLLECTION'
        | 'FAVORITES'
        | 'LIVE'
        | 'N4U'
        | 'PODCAST'
        | 'RADIO'
        | 'TALK'
        | 'TALKSHOW'
        | 'TALKTHEME'
        | 'TRACK';
    };
    export type RequestQuery = {};
    export type RequestBody = SetVarietyPayload;
    export type RequestHeaders = {
      /** the session id of the person making the request */
      'X-Session-Id'?: string;
      /**
       * the profile id of the person making the request
       * @format int64
       */
      'X-User-Id'?: number;
    };
    export type ResponseBody = SetVarietyData;
  }

  /**
   * @description Playlist Thumb up or down content
   * @tags playlist - custom
   * @name Thumb
   * @request POST:/api/v2/playlists/{profileId}/thumbs
   * @response `201` `ThumbData`
   * @response `400` `void` 123: bad.request
   * @response `401` `void` 101: invalid.user
   * @response `403` `void` 12: forbidden.operation
   * @response `404` `void` 5 : not.found
   * @response `409` `void` size.exceeded
   * @response `500` `void` 1: service.unavailable
   */
  export namespace Thumb {
    export type RequestParams = {
      /** @format int64 */
      profileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ThumbPayload;
    export type RequestHeaders = {
      'X-Session-Id'?: string;
      /** @format int64 */
      'X-User-Id'?: number;
    };
    export type ResponseBody = ThumbData;
  }

  /**
   * @description For a given user's station, suppress or reset an artist.  Setting an artist id to the same state twice will result in an error on the second call.
   * @tags taste profile
   * @name ToggleSuppressArtistForStation
   * @request POST:/api/v2/taste/{ownerProfileId}/station/{stationId}/suppress/artists/{artistId}
   * @response `201` `ToggleSuppressArtistForStationData` status of operation.
   * @response `400` `void` 101: invalid.user
   * @response `403` `void` 403: forbidden.operation
   * @response `404` `void` 5: not found
   * @response `409` `void` 419: not modified
   * @response `500` `void` 1: service.unavailable
   */
  export namespace ToggleSuppressArtistForStation {
    export type RequestParams = {
      /**
       * id of artist
       * @format int32
       */
      artistId: number;
      /**
       * authenticated user
       * @format int64
       */
      ownerProfileId: number;
      /** id of station */
      stationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ToggleSuppressArtistForStationPayload;
    export type RequestHeaders = {
      /** authenticated user session */
      'X-Session-Id'?: string;
      /**
       * target user
       * @format int64
       */
      'X-User-Id': number;
    };
    export type ResponseBody = ToggleSuppressArtistForStationData;
  }
}
