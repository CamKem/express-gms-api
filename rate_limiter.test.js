import fetch from 'node-fetch';

const url = 'http://127.0.0.1:3000';

const options = {
  method: 'GET',
  headers: {
    'User-Agent': 'request'
  }
};

const makeRequests = () => {
  const numRequests = 20;

  let count = 0;

  console.log('Making requests...');
  for (let n = 0; n < numRequests; n++) {
    for (let i = 0; i < numRequests; i++) {
      ((currentCount) => {
      fetch(url, options)
          .then(res => {
            if (res.status === 429) {
              console.log(`Rate limited on request ${currentCount}`);
              console.log(`Retry-After: ${res.headers.get('Retry-After')} seconds`);
              console.log(`X-RateLimit-Limit: ${res.headers.get('X-RateLimit-Limit')}`);
            } else if (res.status === 200) {
              console.log(`Request successful on request ${currentCount}`);
            } else {
              console.log(`Request failed on request ${currentCount}`, res.status);
            }
          })
          .catch(err => {
            console.error(err);
          });
      })(count++);
    }
  }
}

makeRequests();