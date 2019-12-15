import User from './user.model'
import config from '../../config/token'
import jwt from 'jsonwebtoken';

export default {

    async login(req, res) {
        const tokenUser = req.headers['x-access-token'];
        const platform = req.headers['x-mobile'];
        try {
            if (tokenUser && tokenUser !== "undefined") {
                console.log("tokenUser", typeof (tokenUser))
                jwt.verify(tokenUser, config.secret, function (err, decoded) {
                    console.log(decoded)
                    User.find({ _id: decoded.id }, { createOn: 0, updateOn: 0, __v: 0 })
                        .exec(function (err, user) {
                            console.log("user", user)
                            if (err) res.status(500).send({ status: "error", message: "This token can't login" });
                            if (user.length > 0) {
                                res.status(200).send({ status: 'success', token: tokenUser, userId: user[0]._id  })
                            }
                            else {
                                User.create({
                                    platform: platform
                                }, (err, user) => {
                                    if (err) res.status(500).send({ status: "error", message: "This token can't login" });
                                    var token = jwt.sign({ id: user._id }, config.secret, {});
                                    res.status(200).send({ status: 'success', token: token, userId: user._id })

                                })
                            }
                        })
                })
            }
            else {
                await User.create({
                    platform: platform
                }, (err, user) => {
                    if (err) res.status(500).send({ status: "error", message: "This token can't login" });
                    var token = jwt.sign({ id: user._id }, config.secret, {});
                    res.status(200).send({ status: 'success', token: token, userId: user._id })

                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ "status": "failed" });
        }
    },


}
