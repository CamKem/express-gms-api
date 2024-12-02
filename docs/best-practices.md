# Best Practices

## Introduction
[//]: # (TODO: do all of this)

We will introce the following best practices to ensure that our codebase is clean, maintainable, and scalable.

## Best Practices
| Best Practice | Description |
| --- | --- |
| Resource naming | Use plural nouns (e.g. /users) |
| HTTP methods | GET (read), POST (create), PUT (update), DELETE (remove) |
| Authentication | Implement OAuth 2.0 or JWT |
| Versioning | Use semantic versioning (e.g. v1.2.3) |
| Documentation | Provide OpenAPI/Swagger docs |
| Security | Use HTTPS, input validation, CORS |
| Performance | Implement caching, compression, async processing |

## Article on Best Practices in Express.js
https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/

- [] Use cache-control headers to cache responses. work out a strategy for cache invalidation.
- [] Use gzip compression to reduce response size.
- [] Use async processing for long-running tasks.
- [] Use pagination for large datasets.
- [] Use webhooks for event-driven architecture.
- [] Setup monitoring and alerting for critical issues. (Sentry, Rollbar, etc.)
- [] Setup analytics to track API usage. (Google Analytics, etc.)
- [] Ensure full coverage with unit and integration tests. (Jest, Mocha, etc.)
- [] Follow the twelve-factor app methodology. (https://12factor.net/)
- [] Use a linter to enforce code style. (ESLint, Prettier, etc.)
- [] Fully typed with JSDoc comments for documentation.
- [x] Use rate limiting to prevent abuse.
- [x] Use environment variables for configuration. (dotenv, etc.)

## Advanced Concepts Practices

### Understanding HATEOAS
HATEOAS helps APIs work better by using links. It lets clients find their way through the API without knowing all the details beforehand. Here's how it works:

|Feature | Description |
| --- | --- |
| Hypermedia | API uses links to related resources |
| Links in responses | API sends links to related resources |
| Client navigation | Clients use links to move through the API |
| Flexibility | API can change without breaking client apps |

To use HATEOAS, put links in your API responses. This shows clients what they can do next.