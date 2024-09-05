/* eslint-disable no-useless-escape */
import fetch from 'node-fetch'
import { type Collection, type SoundCloudSearch } from './models/search'
import SoundCloud from 'soundcloud-scraper'
import { type IncomingMessage } from 'http'

export const Constants = {
  SOUNDCLOUD_BASE_URL: 'https://soundcloud.com',
  SOUNDCLOUD_API_VERSION: '/version.txt',
  SOUNDCLOUD_URL_REGEX: /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/,
  SOUNDCLOUD_KEYGEN_URL_REGEX: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  SOUNDCLOUD_API_KEY_REGEX: /(https:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  REGEX_TRACK: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/?$/,
  REGEX_SET: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/sets\/([A-Za-z0-9_-]+)\/?$/,
  REGEX_ARTIST: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/?$/,
  STREAM_FETCH_HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  USER_URN_PATTERN: /soundcloud:users:(?<urn>\d+)/,
  STREAM_ERRORS: {
    401: 'Invalid ClientID',
    404: 'Track not found/requested private track'
  }
}

let apiKeyProps: string = ''
let updatedApiKeyDate: Date | null = null

export default class Client {
  apiKey: string = ''
  constructor (apiKey: string = '') {
    if (apiKey) {
      this.apiKey = apiKey
    }
    if (apiKeyProps) {
      if (updatedApiKeyDate && (new Date().getTime() - updatedApiKeyDate.getTime()) < 60 * 60 * 1000) {
        this.apiKey = apiKeyProps
      } else {
        apiKeyProps = ''
        updatedApiKeyDate = null
      }
    }
  }

  private async parseHTML (url: string): Promise<string> {
    const response = await fetch(url)
    return await response.text()
  }

  async createAPIKey (): Promise<string | null> {
    if (this.apiKey) return null
    try {
      const html = await this.parseHTML(Constants.SOUNDCLOUD_BASE_URL)
      const res = html.split('<script crossorigin src="')
      const urls: string[] = []
      let key: string = ''

      res.forEach(u => {
        const url = u.replace('"></script>', '')
        const chunk = url.split('\n')[0]
        if (Constants.SOUNDCLOUD_KEYGEN_URL_REGEX.test(chunk)) {
          urls.push(chunk)
        };
      })
      await Promise.allSettled(urls.map(async (url) => {
        const data = await this.parseHTML(url)
        if (data.includes(',client_id:"')) {
          const a = data.split(',client_id:"')
          key = a[1].split('"')[0]
        }
      }))
      this.apiKey = key
      updatedApiKeyDate = new Date()
      apiKeyProps = key
      return key || null
    } catch {
      throw new Error('Unable to create API key')
    }
  }

  async search (query: string, limit: number = 30, offset: number = 0): Promise<Collection[]> {
    if (!this.apiKey) await this.createAPIKey()
    if (!this.apiKey) throw new Error('Unable to create API key')
    const url = `https://api-v2.soundcloud.com/search?q=${encodeURIComponent(query)}&client_id=${this.apiKey}&limit=${limit}&offset=${offset}&app_version=1706267623&app_locale=pt_BR`
    const response = await fetch(url)
    const json = await response.json() as SoundCloudSearch
    return json.collection
  }

  async download (url: string): Promise<IncomingMessage> {
    if (!this.apiKey) await this.createAPIKey()
    if (!this.apiKey) throw new Error('Unable to create API key')
    const client = new SoundCloud.Client(this.apiKey)
    const track = await client.getSongInfo(url)
    const stream = await track.downloadProgressive()
    return stream
  }
}
