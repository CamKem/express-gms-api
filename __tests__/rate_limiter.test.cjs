const fetch = require('node-fetch');

const url = 'http://127.0.0.1:3000';

const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'request'
    }
};

const makeRequests = async () => {
    const numRequests = 20;
    const results = [];

    for (let n = 0; n < numRequests; n++) {
        for (let i = 0; i < numRequests; i++) {
            results.push(fetch(url, options));
        }
    }

    return Promise.all(results);
};

describe('Rate Limiter', () => {
    it('should handle rate limiting correctly', async () => {
        const responses = await makeRequests();

        let rateLimitedCount = 0;
        let successCount = 0;

        responses.forEach(res => {
            if (res.status === 429) {
                rateLimitedCount++;
                console.log(`Rate limited on request`);
                console.log(`Retry-After: ${res.headers.get('Retry-After')} seconds`);
                console.log(`X-RateLimit-Limit: ${res.headers.get('X-RateLimit-Limit')}`);
            } else if (res.status === 200) {
                successCount++;
                console.log(`Request successful`);
            } else {
                console.log(`Request failed`, res.status);
            }
        });

        expect(rateLimitedCount).toBeGreaterThan(0);
        expect(successCount).toBeGreaterThan(0);
    });
});