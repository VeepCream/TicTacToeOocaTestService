import express from 'express'

export const userRouter = express.Router()

import userController from './user.controller'

userRouter.route('/login').get(userController.login)

