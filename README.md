# CRUD API

rss-nodejs-2025q2

## Description

Your task is to implement simple CRUD API using in-memory database underneath.

## Routes

GET       /api/users
POST      /api/users
GET       /api/users/:id
PUT       /api/users/:id
DELETE    /api/users/:id

## Installation

1. Clone the repository
2. Install dependencies: npm install

## Environment Variables

Make sure to set the following environment variables in a .env file

```bash
export PORT=4000
```

## Run

Run `npm run start:dev` to run single thread in the Development mode

Run `npm run start:multi` to run load balancer in the Development mode

Run `npm run start:prod` to build single bundle js file and run in the Production mode

## Tests

Run `npm run test`
