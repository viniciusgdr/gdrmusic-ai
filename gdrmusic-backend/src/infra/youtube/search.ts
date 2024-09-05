import { type SearchRepository } from '../../data/protocols/SearchRepository'
import fetch from 'node-fetch'

export class YoutubeSearchRepository implements SearchRepository {
  private async _POST (query: string, continuationToken?: string): Promise<any> {
    const body = {
      context: {
        client: {
          hl: 'pt',
          gl: 'BR',
          clientName: 'WEB',
          clientVersion: '2.20230602.01.00'
        }
      }
    }
    const request = await fetch('https://music.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false', {
      headers: {},
      body: JSON.stringify({
        ...body,
        query
      }),
      method: 'POST'
    })
    const json = await request.json()
    return json
  }

  async search (search: SearchRepository.Params): Promise<SearchRepository.Result[]> {
    const json = await this._POST(search.query)
    const result = json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
    // const continuationCommands = json.header.searchHeaderRenderer.chipBar.chipCloudRenderer.chips.filter((item: any) => item.chipCloudChipRenderer).map((item: any) => item.chipCloudChipRenderer)
    // const continuationVideos = continuationCommands.find((item: any) => item.text.simpleText === 'Vídeos')
    // const continuation = continuationVideos.navigationEndpoint.continuationCommand.token
    // console.log(continuation)
    if (result) {
      const inVideoRenderer = result.filter((item: any) => item?.videoRenderer).map((item: any) => item.videoRenderer)
      return inVideoRenderer.map((item: any) => {
        const thumb = item.thumbnail.thumbnails[0].url
        return {
          partnerId: item.videoId,
          title: item.title.runs[0].text,
          artist: item.ownerText.runs[0].text,
          thumbnail: thumb.substring(0, thumb.indexOf('?')),
          album: '',
          genre: '',
          likes: Number(item.viewCountText.simpleText.replace(/\D/g, '')) as unknown as bigint,
          year: 0,
          partnerType: 'YOUTUBE'
        } satisfies SearchRepository.Result
      })
    }
    return []
  }
}
