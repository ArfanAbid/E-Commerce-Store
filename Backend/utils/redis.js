import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const redis = new Redis(process.env.UPSTASH_REDIS_URL);
// await client.set('foo', 'bar');

export default redis


// Redis works on mechanism of Key-Value pairs where key is unique and value can be any type of data.
// it stores data entirely in memory, rather than on disk like traditional databases.
