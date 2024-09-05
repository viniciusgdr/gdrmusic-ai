export interface SoundCloudSearch {
  collection: Collection[]
  total_results: number
  next_href: string
  query_urn: string
}

export interface Collection {
  artwork_url: null | string
  caption?: null
  commentable?: boolean
  comment_count?: number
  created_at: string
  description: null | string
  downloadable?: boolean
  download_count?: number
  duration: number
  full_duration?: number
  embeddable_by: EmbeddableBy
  genre: null | string
  has_downloads_left?: boolean
  id: number
  kind: CollectionKind
  label_name: null | string
  last_modified: string
  license: License
  likes_count: number
  permalink: string
  permalink_url: string
  playback_count?: number
  public: boolean
  publisher_metadata?: CollectionPublisherMetadata | null
  purchase_title: null
  purchase_url: null
  release_date: null | string
  reposts_count: number
  secret_token: null
  sharing: Sharing
  state?: State
  streamable?: boolean
  tag_list: string
  title: string
  track_format?: TrackFormat
  uri: string
  urn?: string
  user_id: number
  visuals?: null
  waveform_url?: string
  display_date: string
  media?: Media
  station_urn?: string
  station_permalink?: string
  track_authorization?: string
  monetization_model?: MonetizationModel
  policy?: Policy
  user: CollectionUser
  managed_by_feeds?: boolean
  set_type?: string
  is_album?: boolean
  published_at?: string
  tracks?: Track[]
  track_count?: number
}

export enum EmbeddableBy {
  All = 'all',
}

export enum CollectionKind {
  Playlist = 'playlist',
  Track = 'track',
}

export enum License {
  AllRightsReserved = 'all-rights-reserved',
}

export interface Media {
  transcodings: Transcoding[]
}

export interface Transcoding {
  url: string
  preset: Preset
  duration: number
  snipped: boolean
  format: Format
  quality: Quality
}

export interface Format {
  protocol: Protocol
  mime_type: MIMEType
}

export enum MIMEType {
  AudioMPEG = 'audio/mpeg',
  AudioOggCodecsOpus = "audio/ogg; codecs='opus'",
}

export enum Protocol {
  HLS = 'hls',
  Progressive = 'progressive',
}

export enum Preset {
  Mp30_0 = 'mp3_0_0',
  Mp30_1 = 'mp3_0_1',
  Mp31_0 = 'mp3_1_0',
  Opus0_0 = 'opus_0_0',
}

export enum Quality {
  Sq = 'sq',
}

export enum MonetizationModel {
  NotApplicable = 'NOT_APPLICABLE',
}

export enum Policy {
  Allow = 'ALLOW',
  Snip = 'SNIP',
}

export interface CollectionPublisherMetadata {
  id: number
  urn: string
  contains_music: boolean
  artist?: string
  explicit?: boolean
  album_title?: string
  upc_or_ean?: string
  isrc?: string
  p_line?: string
  p_line_for_display?: string
  c_line?: string
  c_line_for_display?: string
  release_title?: string
}

export enum Sharing {
  Public = 'public',
}

export enum State {
  Finished = 'finished',
}

export enum TrackFormat {
  SingleTrack = 'single-track',
}

export interface Track {
  artwork_url: string
  caption: null
  commentable: boolean
  comment_count: number
  created_at: string
  description: string
  downloadable: boolean
  download_count: number
  duration: number
  full_duration: number
  embeddable_by: EmbeddableBy
  genre: string
  has_downloads_left: boolean
  id: number
  kind: CollectionKind
  label_name: null
  last_modified: string
  license: License
  likes_count: number
  permalink: string
  permalink_url: string
  playback_count: number
  public: boolean
  publisher_metadata: TrackPublisherMetadata
  purchase_title: null
  purchase_url: null
  release_date: null
  reposts_count: number
  secret_token: null
  sharing: Sharing
  state: State
  streamable: boolean
  tag_list: string
  title: string
  track_format: TrackFormat
  uri: string
  urn: string
  user_id: number
  visuals: null
  waveform_url: string
  display_date: string
  media: Media
  station_urn: string
  station_permalink: string
  track_authorization: string
  monetization_model: MonetizationModel
  policy: Policy
  user: TrackUser
}

export interface TrackPublisherMetadata {
  id: number
  urn: string
  contains_music: boolean
}

export interface TrackUser {
  avatar_url: string
  first_name: string
  followers_count: number
  full_name: string
  id: number
  kind: UserKind
  last_modified: string
  last_name: string
  permalink: string
  permalink_url: string
  uri: string
  urn: string
  username: string
  verified: boolean
  city: string
  country_code: CountryCode
  badges: Badges
  station_urn: string
  station_permalink: string
}

export interface Badges {
  pro: boolean
  pro_unlimited: boolean
  verified: boolean
}

export enum CountryCode {
  Br = 'BR',
}

export enum UserKind {
  User = 'user',
}

export interface CollectionUser {
  avatar_url: string
  city: null | string
  comments_count: number
  country_code: CountryCode | null
  created_at: string
  creator_subscriptions: CreatorSubscription[]
  creator_subscription: CreatorSubscription
  description: null | string
  followers_count: number
  followings_count: number
  first_name: string
  full_name: string
  groups_count: number
  id: number
  kind: UserKind
  last_modified: string
  last_name: string
  likes_count: number
  playlist_likes_count: number
  permalink: string
  permalink_url: string
  playlist_count: number
  reposts_count: null
  track_count: number
  uri: string
  urn: string
  username: string
  verified: boolean
  visuals: Visuals | null
  badges: Badges
  station_urn: string
  station_permalink: string
}

export interface CreatorSubscription {
  product: Product
}

export interface Product {
  id: ID
}

export enum ID {
  CreatorProUnlimited = 'creator-pro-unlimited',
  Free = 'free',
}

export interface Visuals {
  urn: string
  enabled: boolean
  visuals: Visual[]
  tracking: null
}

export interface Visual {
  urn: string
  entry_time: number
  visual_url: string
}
