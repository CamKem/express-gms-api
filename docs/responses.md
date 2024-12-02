## Response Structure / Schema

We want to provide a more structured way to handle responses in our application using the following schema:

### For errors;
```json
 {
  "status": "error", 
  "code": "RESOURCE_NOT_FOUND", 
  "data": {
    "message": "The requested resource was not found.", 
    "details": "The user with the ID '12345' does not exist in our records.", 
    "timestamp": "2023-12-08T12:30:45Z", 
    "path": "/api/v1/users/12345"
  },
  "requestId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8", 
  "docs_url": "https://api.example.com/docs/errors#resource-not-found"
}
```

### For successful responses;
[//]: # (TODO: decide if we want to offer custom response codes for each endpoint or just use the generic "OK" code)
[//]: # (TODO: also decide if we want to pass a message in the response for successful requests)
```json 
 {
  "status": "success", 
  "code": "USER_RETRIEVED", 
   "data": {
     "id": "12345",
     "name": "John Doe",
     "email": "john@doe.com",
     "role": "admin",
     "createdAt": "2023-12-08T12:30:45Z",
     "updatedAt": "2023-12-08T12:30:45Z"
   },
   "requestId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
   "docs_url": "https://api.example.com/docs/users#user-retrieved"
}
```