# Expense API

This is a Cloudflare Workers API for managing expenses.

## Endpoints

### GET /expenses

Returns a list of all expenses.

### POST /expenses

Creates a new expense.

### GET /expenses/:id

Returns a single expense by ID.

### PUT /expenses/:id

Updates a single expense by ID.

### DELETE /expenses/:id

Deletes a single expense by ID.

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
