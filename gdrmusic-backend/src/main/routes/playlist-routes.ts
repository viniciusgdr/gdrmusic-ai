import { type Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters/express-route-adapter'
import { makePlaylistListController } from '../factories/playlist-list'
import { makeAuthorizationMiddleware } from '../factories/make-authorization'
import { makeCreatePlaylistController } from '../factories/create-playlist'
import { makeGetPlaylistController } from '../factories/get-playlist'

const playlistRoutes = (router: Router): void => {
  router.get(
    '/playlists',
    adaptMiddleware(makeAuthorizationMiddleware()),
    adaptRoute(makePlaylistListController()))

  router.post(
    '/playlist',
    adaptMiddleware(makeAuthorizationMiddleware()),
    adaptRoute(makeCreatePlaylistController())
  )

  router.get(
    '/playlist/:id',
    adaptMiddleware(makeAuthorizationMiddleware()),
    adaptRoute(makeGetPlaylistController())
  )
}

export default playlistRoutes
