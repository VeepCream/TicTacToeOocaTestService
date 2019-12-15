import express from 'express'
import bodyParser from 'body-parser'

// Config
import { connect } from './config/db'

//Router
import { restRouter } from './api'
import cors  from 'cors'

const api = express()

connect()

// api.use(express.logger('dev'));
api.use(cors());
api.use(bodyParser.json())
api.use('/api', restRouter)

api.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});

api.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message,
        },
    });
});

api.listen(2303, () => {
    console.log(' start')
})