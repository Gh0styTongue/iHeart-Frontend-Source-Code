const UserDisplayTargetingKeys = [
  'deviceType', // User device - example: desktop, mobile
  'locale', // User's locale (from browser) - example: en-US
  'profileId', // User's profile ID
  'visitNum', // The # of times a day the user has visited the site.
  'ccrmarket', // User market - example: NEWYORK-NY
] as const;

const StationDisplayTargetingKeys = [
  'aw_0_1st.playlistid', // Playlist Stations - example: 312064750_XHKaQP8C97RQ5Gn5fYPc58 (transformed playlistId, replace '::' with '_')
  'aw_0_1st.ihmgenre', // Artist & Playlist Stations - examples: genre_top-40, genre_playlist
  'aw_0_1st.playlisttype', // Playlist Stations - example: seedtype_curatedplaylist
  'ccrcontent2', // During playback, populates the type of station - examples: live, custom, podcast, playlistradio
  'pageformat', // Live Stations, the format of the live station - example: chrpop
  'pagemarket', // Live Stations - seems to be a copy of 'pageformat' TODO: check with Lorraine
  'ccrcontent3', // Station ID & Directory Pages - examples: s26940277, directory:live:home
  'ccrformat', // Live Stations, the format of the live station - example: chrpop
  'section', // Playlist Stations - example: playlist, 2010s, workout
] as const;

/**
 * Content may or may not ever live in web.listen, but these are the keys that WOULD be used in that
 * case
 */
// const ContentDisplayTargetingKeys = [
//   'campagin', // Article Pages - example: Drake%20(30026769)
//   'contentdetail', // Article Pages, article title - example: 2020-04-03-drake-teaches-you-how-to-toosie-slide-in-hot-new-music-video
//   'contenttype', // Article Pages, constant: articles
// ] as const;

const PlaybackDisplayTargetingKeys = [
  'playedFrom', // The playedFrom value, get from playback? TODO: check with Lorraine/Mark
  'provider', // Clear Channel - constant: cc
  'seed', // ID of the content playing - example: 30191482
] as const;

const GlobalDisplayTargetingKeys = [
  'ccrcontent1', // All Pages - examples: home, yourlibrary, directory:live, artist, get from the loader
  'env', // for listen, constant: listen
  'ord', // Random number
  'ts', // Timestamp in epoch milliseconds
  'CCRPOS', // Page Position (already defined in slots)
] as const;

const SpecialDisplayTargetingKeys = [
  'amznbid', // AMZ Header Bidding. TODO: determine when/where this should be applied, it may already be taken care of with Amazon Header Bidder work
  'm_mv', // Moat
  'm_gv', // Moat Viewability
  'm_data', // Moat Human targeting
  'm_safety', // Moat Brand Safety targeting
] as const;

export const DisplayTargetingKeys = [
  ...UserDisplayTargetingKeys,
  ...StationDisplayTargetingKeys,
  // ...ContentDisplayTargetingKeys,
  ...PlaybackDisplayTargetingKeys,
  ...GlobalDisplayTargetingKeys,
  ...SpecialDisplayTargetingKeys,
] as const;

export type DisplayTargetingParams = {
  [TKey in (typeof DisplayTargetingKeys)[number]]?: string;
};
