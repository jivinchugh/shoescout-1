const axios = require('axios');

async function retryRequest(config, maxRetries = 2, delay = 500) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await axios(config);
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  throw lastError;
}

module.exports = retryRequest;
