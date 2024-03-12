import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    // Initialize Redis client
    this.client = createClient();
    
    // Set initial connection status to true
    this.isClientConnected = true;

    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      // Update connection status to false on error
      this.isClientConnected = false;
    });

    // Handle Redis client connection
    this.client.on('connect', () => {
      // Update connection status to true on successful connection
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if this client's connection to the Redis server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value of a given key.
   * @param {String} key The key of the item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    // Promisify the GET method of the Redis client and bind it to the client instance
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and its value along with an expiration time.
   * @param {String} key The key of the item to store.
   * @param {String | Number | Boolean} value The item to store.
   * @param {Number} duration The expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    // Promisify the SETEX method of the Redis client and bind it to the client instance
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value of a given key.
   * @param {String} key The key of the item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    // Promisify the DEL method of the Redis client and bind it to the client instance
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

// Export an instance of the RedisClient class
export const redisClient = new RedisClient();
export default redisClient;

