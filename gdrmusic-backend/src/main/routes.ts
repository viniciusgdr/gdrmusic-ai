import { Router, type Express } from 'express'
import glob from 'fast-glob'

const routes = (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  const routes = process.env.NODE_ENV === 'production' ? glob.sync('**/build/main/routes/**-routes.js') : glob.sync('**/src/main/routes/**-routes.ts')
  void routes.map(async route => (await import(`../../${route}`)).default(router))
}

export default routes
