import express from 'express'

import { userRouter } from './user'
import { roomRouter } from './room'

export const restRouter = express.Router()

restRouter.use('/user', userRouter)
restRouter.use('/room', roomRouter)

