# Expense API

This is a Cloudflare Workers API for managing expenses.

## Endpoints

### GET /transactions

Returns a list of all transactions.

### POST /transactions

Creates a new transaction.

### GET /transactions/:id

Returns a single transaction by ID.

### PUT /transactions/:id

Updates a single transaction by ID.

### DELETE /transactions/:id

Deletes a single transaction by ID.

### POST /auth/signup

Registers a new user with email and password.

### POST /auth/signin

Authenticates a user and returns a token.

## Development

### Prerequisites

* A Cloudflare account
* The Cloudflare CLI installed
* A Cloudflare worker created and configured

### Running Locally

1. Run `npm install` to install dependencies.
2. Run `npm run db:generate` to generate the database schema.
3. Run `npm run db:migrate-local` to migrate the local database.
4. Run `npm run dev` to start the development server.

### Deploying

1. Run `npm run build` to build the worker.
2. Run `npm run deploy` to deploy the worker to Cloudflare.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
