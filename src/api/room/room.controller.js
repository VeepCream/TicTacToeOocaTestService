import Room from './room.model'
import User from '../user/user.model'
import config from '../../config/token'
import jwt from 'jsonwebtoken';

export default {

    async create(req, res) {
        const tokenUser = req.headers['x-access-token'];
        try {
            if (tokenUser) {
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    findUser(decoded.id)
                        .then(() => findRoom(decoded.id))
                        .then(() => {
                            Room.updateOne({ owner: decoded.id }, { $set: { status: "waiting" } },
                                (err, room) => {
                                    if (err) return res.status(500).send({ status: "error", error: err })
                                    res.status(200).send({ status: 'success', channel: decoded.id })
                                })
                        })
                        .catch(() => {
                            Room.create({
                                owner: decoded.id,
                                friend: "null",
                                status: "waiting",
                            }, function (err, room) {
                                if (err) return res.status(500).send({ status: "error", error: err })
                                res.status(200).send({ status: 'success', channel: decoded.id })

                            })
                        })
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },
    async listAll(req, res) {
        const tokenUser = req.headers['x-access-token'];
        try {
            if (tokenUser) {
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    findUser(decoded.id)
                        .then(() => {
                            Room.find({}, function (err, room) {
                                if (err) return res.status(500).send({ "status": "failed" });
                                res.status(200).send({ status: 'success', data: room })
                            })
                        })
                        .catch(() => {
                            res.status(500).send({ "status": "failed" });
                        })
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },
    async list(req, res) {
        const tokenUser = req.headers['x-access-token'];
        console.log("tokenUser",tokenUser)
        try {
            if (tokenUser) {
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    console.log("decoded.id", decoded.id)
                    findUser(decoded.id)
                        .then(() => {
                            Room.find({ status: "waiting" }, function (err, room) {
                                if (err) return res.status(500).send({ "status": "failed" });
                                res.status(200).send({ status: 'success', data: room })
                            });
                        })
                        .catch(() => {
                            res.status(500).send({ "status": "failed" });
                        })
                })
            }
            else {
                res.status(500).send({ "status": "failed" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },
    async join(req, res) {
        const { channel } = req.body
        const tokenUser = req.headers['x-access-token'];
        try {
            if (tokenUser) {
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    findUser(decoded.id)
                        .then(() => findRoom(channel))
                        .then((resolve) => {
                            if (resolve.status === "waiting") {
                                Room.updateOne({ owner: channel }, { $set: { status: "playing", friend: decoded.id } },
                                    (err, room) => {
                                        if (err) return res.status(500).send({ status: "error", error: err })
                                        res.status(200).send({ status: 'success', channel: decoded.id })
                                    })
                            }
                            else{
                                res.status(500).send({ "status": "failed" });
                            }
                        })
                        .catch(() => {
                            res.status(500).send({ "status": "failed" });
                        })
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },
    async kill(req, res) {
        const { channel } = req.body
        const tokenUser = req.headers['x-access-token'];
        try {
            if (tokenUser) {
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    findUser(decoded.id)
                        .then(() => {
                            Room.updateOne({ owner: channel }, { $set: { status: "kill" } },
                                (err, room) => {
                                    if (err) return res.status(500).send({ status: "error", error: err })
                                    res.status(200).send({ status: 'success', channel: channel })
                                })
                        })
                        .catch(() => {
                            res.status(500).send({ "status": "failed" });
                        })
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },
    async exit(req, res) {
        const { channel } = req.body
        const tokenUser = req.headers['x-access-token'];
        try {
            if (tokenUser) {
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    findUser(decoded.id)
                        .then(() => {
                            Room.updateOne({ owner: channel }, { $set: { status: "waiting", friend: "null" } },
                                (err, room) => {
                                    if (err) return res.status(500).send({ status: "error", error: err })
                                    res.status(200).send({ status: 'success', channel: decoded.id })
                                })
                        })
                        .catch(() => {
                            res.status(500).send({ "status": "failed" });
                        })
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },
}

function findUser(id) {
    return new Promise((resolve, reject) => {
        User.find({ "_id": id }, function (err, result) {
            console.log("result", result)
            if (err) { reject() }
            if (result.length > 0) {
                resolve()
            }
            else {
                reject()
            }
        });
    })
}

function findRoom(id) {
    return new Promise((resolve, reject) => {
        Room.find({ "owner": id }, function (err, result) {
            if (err) { reject() }
            if (result.length > 0) {
                resolve(result[0])
            }
            else {
                reject()
            }
        });
    })
}