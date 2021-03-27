#  Royce Technology Test

Be sure to read **all** of this document carefully, and follow the guidelines within.

## User Model
```
{
  "id": "xxx",                  // unique user ID
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "updatedAt": ""               // user updated date
}
```
## Installation
```
git clone https://github.com/sbuttigieg/royce-tech-test

docker-compose up
```
## Start the app
```
# development mode (watch mode + see logger messages)
npm run start:dev

# production mode
npm run start
```
## Test
```
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
## Endpoints
```
# Get all users
GET http://localhost:3000/users

# Get a use by user ID
GET     http://localhost:3000/users/:id

# Delete user by user ID
DELETE  http://localhost:3000/users/:id

# Get address coordinates by user ID
GET     http://localhost:3000/users/address/:id/

# Create a new user
POST    http://localhost:3000/users
        Body name:  dob:    address:    description:
        
# Update user
PATCH   http://localhost:3000/users/:id
        Body name:  dob:    address:    description:
```