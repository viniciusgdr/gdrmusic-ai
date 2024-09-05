import express, { type Express } from 'express'
import cors from 'cors'

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
]

const middlewares = (app: Express): void => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Origin not allowed by CORS'))
      }
    },
    credentials: true
  }))
}

export default middlewares
