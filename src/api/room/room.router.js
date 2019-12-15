import express from 'express'

export const roomRouter = express.Router()

import roomController from './room.controller'

roomRouter.route('/listRoom').get(roomController.list)
roomRouter.route('/listRoomAll').get(roomController.listAll)
roomRouter.route('/createRoom').get(roomController.create)
roomRouter.route('/joinRoom').post(roomController.join)
roomRouter.route('/killRoom').post(roomController.kill)
roomRouter.route('/exitRoom').post(roomController.exit)


