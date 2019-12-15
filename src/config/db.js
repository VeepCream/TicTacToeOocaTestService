import mongoose from 'mongoose';

const MODE = process.env && process.env.MONGO_URL


const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
}

function connectWithRetry() {
    mongoose.connect(MODE ? MODE : "mongodb://localhost:27017/vote", options).then(() => {
        
        console.log('MongoDB is connected')
    }).catch(err => {
        console.log(err)

        console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
        setTimeout(connectWithRetry, 5000)
    })

}


export const connect = () => connectWithRetry()