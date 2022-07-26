const redis = require('redis');

// const redisClient = redis.createClient({
//   url: 'redis://localhost:6379'
// });
// redisClient.on('connect', () => console.log('Connected to Redis!'));
// redisClient.on('error', (err) => console.log('Redis Client Error', err));
// redisClient.connect();
var redisClient = redis.createClient()

const connectClient = async () => {
    await redisClient.connect();
    return
}
connectClient();
module.exports = redisClient