import { type LoadPlayerPairProcessDownloadRepository } from '../../data/protocols/LoadPlayerPairProcessDownloadRepository'
import fetch from 'node-fetch'
import axios from 'axios'

export class YoutubeDownloadRepository implements LoadPlayerPairProcessDownloadRepository {
  type = 'YOUTUBE'

  async load (load: LoadPlayerPairProcessDownloadRepository.Params): Promise<LoadPlayerPairProcessDownloadRepository.Result> {
    const { id } = load
    const request = await axios.request({
      url: 'https://m.youtube.com/youtubei/v1/player',
      method: 'POST',
      maxBodyLength: Infinity,
      headers: {
        'content-type': 'application/json'
      },
      data: JSON.stringify({
        videoId: id,
        context: {
          client: {
            clientName: 'ANDROID_CREATOR',
            clientVersion: '22.36.102'
          }
        }
      }),
      // enable proxy if environment variables are set
      proxy: process.env.PROXY_HOST && process.env.PROXY_PORT && process.env.PROXY_PROTOCOL && process.env.PROXY_USERNAME && process.env.PROXY_PASSWORD
        ? {
            host: process.env.PROXY_HOST,
            port: Number(process.env.PROXY_PORT),
            protocol: process.env.PROXY_PROTOCOL,
            auth: {
              password: process.env.PROXY_PASSWORD,
              username: process.env.PROXY_USERNAME
            }
          }
        : undefined
    })
    const response = request.data

    const statusError = ['ERROR', 'UNPLAYABLE', 'LIVE_STREAM_OFFLINE', 'LOGIN_REQUIRED', 'LIVE_STREAM_OFFLINE']
    if (statusError.includes(response?.playabilityStatus?.status)) {
      throw new Error('Video is not playable')
    }
    const audios = response?.streamingData?.adaptiveFormats.filter((format: any) => format.mimeType.includes('audio/'))
    console.log(audios)
    if (audios.length === 0) {
      throw new Error('No audio formats found')
    }
    const audio = this.getBestAudio(audios)
    // get stream of audio
    const stream = await fetch(audio.url)
    return {
      stream: stream.body,
      size: Number(audio.contentLength)
    }
  }

  private getBestAudio (audios: any[]): any {
    const preferences = [
      'AUDIO_QUALITY_HIGH',
      'AUDIO_QUALITY_MEDIUM',
      'AUDIO_QUALITY_LOW'
    ]
    for (const preference of preferences) {
      const audio = audios.find(audio => audio.audioQuality === preference)
      if (audio) {
        return audio
      }
    }

    return audios[0]
  }
}
