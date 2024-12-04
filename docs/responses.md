# Responses

Need to be to document based on the error codes in the codebase

### Standard Error Responses (4xx and 5xx)
- BAD_REQUEST: The request was malformed. (400)
- UNAUTHORIZED: The request was unauthorized. (401)
- FORBIDDEN: The request was forbidden. (403)
- NOT_FOUND: The requested resource was not found. (404)
- METHOD_NOT_ALLOWED: The request method was not allowed. (405)
- NOT_ACCEPTABLE: The request was not acceptable. (406)
- CONFLICT: The request conflicted with the current state of the server. (409)
- UNSUPPORTED_MEDIA_TYPE: The request media type was unsupported. (415)
- UNPROCESSABLE_ENTITY: The request was unprocessable. (422)
- INTERNAL_SERVER_ERROR: An internal server error occurred. (500)

### Nuanced Custom Error Responses (4xx)
- VERSION_NOT_SPECIFIED: The API version was not specified. (404)
- INVALID_API_VERSION: The provided API version was invalid. (422)
- INVALID_ACCEPT_HEADER: The provided accept header was invalid. (406)
- RESOURCE_NOT_FOUND: The requested resource was not found. (404)
- RESOURCE_RETRIEVED: The resource was retrieved successfully. (200)
- RESOURCE_CREATED: The resource was created successfully. (201)
- RESOURCE_NOT_CREATED: The resource was not created. (500) [//]: # (we will use a 500 because it is a general server error)
- RESOURCE_ALREADY_EXISTS: The resource already exists. (409)
- UPDATE_FIELDS_REQUIRED: The fields required to update the 
- RESOURCE_UPDATED: The resource was updated successfully. (200)
- RESOURCE_NOT_UPDATED: The resource was not updated. (500) [//]: # (we will use a 500 because it is a general server error)
- RESOURCE_REPLACED: The resource was replaced successfully. (200)
- RESOURCE_NOT_REPLACED: The resource was not replaced. (500) [//]: # (we will use a 500 because it is a general server error)
- RESOURCE_DELETED: The resource was deleted successfully. (200)
- RESOURCE_NOT_DELETED: The resource was not deleted. (500) [//]: # (we will use a 500 because it is a general server error)
- INVALID_JSON: The provided JSON was invalid. (400)
- INVALID_FIELDS: The provided fields were invalid. (422)
- VALIDATION_ERROR: The provided data was invalid. (422)
- RESOURCE_NOT_UPDATED: The resource was not updated. (400)
- INVALID_FIELDS: The provided fields were invalid. (422) // we are using this for our validation of the payload

- AUTH_SUCCESS: The user was authenticated successfully. (200)
- AUTH_FAILURE: The user was not authenticated. (401)
- AUTH_ERROR: An error occurred during authentication. (500)
- INVALID_CREDENTIALS: The provided credentials were invalid. (401)
- INVALID_TOKEN: The provided token was invalid. (401)

-------------------------------------
### Custom Error Responses (5xx)
[//]: # (TODO: list all of the custom error codes here)
[//]: # (TODO: we will set up automatic docs linking &#40;HATEOAS&#41; for each endpoint and error code)

### For successful responses;
[//]: # (TODO: decide if we want to offer custom response codes for each endpoint or just use the generic "OK" code)
[//]: # (TODO: also decide if we want to pass a message in the response for successful requests)
[//]: # (TODO: include dynamic links to the documentation for each endpoint, error & nuanced response code)
[//]: # (TODO: work out of we want to include the name of the resource in the structure, eg. "user" or "product")