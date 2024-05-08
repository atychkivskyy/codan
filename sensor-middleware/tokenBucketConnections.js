const redis = require('redis');

let redisClient = undefined;

async function initializeRedisClient() {
  // read the Redis connection URL from the envs
  let redisURL = process.env.REDIS_URI || 'redis://token-bucket:6379'

    // create the Redis client object
    redisClient = redis.createClient({ url: redisURL }).on("error", (e) => {
      console.error(`Failed to create the Redis client with error:`);
      console.error(e);
    });

    try {
      // connect to the Redis server
      await redisClient.connect();
      console.log(`Connected to Redis successfully!`);
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
}

async function readData(key) {
  let value = undefined;
  value = await redisClient.get(key);
  return value;
}

async function takeToken() {
  const out = await redisClient.DECR('tokens');;
  
  console.log('Token taken',out );
  
}

async function addToken() {
  const out = await redisClient.INCRBY('tokens', 1);
  
  console.log('Token added',out );
  
}

module.exports = {
    initializeRedisClient,
    readData,
    addToken,
    takeToken
};

//https://stackoverflow.com/questions/73253638/how-to-export-redis-in-nodejs-to-different-routes
//https://semaphoreci.com/blog/nodejs-caching-layer-redis