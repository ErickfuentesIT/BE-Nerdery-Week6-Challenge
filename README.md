# Store App (GraphQL)

A GraphQL API for managing products and product images with GCP Cloud Storage integration for file uploads via signed URLs.

## Tech Stack

- **Runtime:** Node.js v18+
- **Language:** TypeScript
- **Server:** Express + Apollo Server (GraphQL)
- **Database:** PostgreSQL 17
- **ORM:** Prisma
- **Cloud Storage:** Google Cloud Storage (signed URLs)
- **Validation:** class-validator + class-transformer

## Project Structure

```
prisma/
  schema.prisma          # Database schema
  seed.ts                # Seed script (clients, API keys, sample product)
  migrations/            # Migration history
src/
  schema/                # GraphQL type definitions
  resolvers/             # GraphQL resolvers
  services/              # Business logic layer
  routes/                # REST endpoints
  middlewares/            # API key validation
  dtos/                  # Input validation DTOs
  types/                 # TypeScript type definitions
  utils/                 # Shared utilities (auth, errors, validation)
  prisma.ts              # Prisma client instance
  server.ts              # App entry point
```

## Data Model

| Model | Description |
|-------|-------------|
| **Client** | A tenant with name and email. Owns products and API keys. |
| **Product** | Belongs to a client. Has name, description, stock, price, isActive flag. |
| **ProductImage** | Image linked to a product. Stores GCS URL and publicId. |
| **ApiKey** | Auth key for a client with an expiration date. |

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd BE-Nerdery-Week6-Challenge
npm install
```

### 2. Start the database

```bash
docker-compose up -d
```

This starts a PostgreSQL 17 instance on port `5432`.

### 3. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/nerdery_db_w6c2"
PORT="4000"
GCS_KEY_FILE="gcp-credentials.json"
GCS_PROJECT_ID="your-gcp-project-id"
GCS_BUCKET_NAME="your-bucket-name"
```

### 4. GCP credentials

Place your GCP service account JSON key file at the project root as `gcp-credentials.json`. The service account needs the **Storage Object Admin** role on your bucket.

### 5. Run migrations and seed

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

This creates the tables and seeds two clients with API keys and a sample product.

### 6. Start the server

```bash
npm run dev
```

The server runs at `http://localhost:4000` with GraphQL at `/graphql`.

## Authentication

All GraphQL operations require an API key in the request header:

```
x-api-key: api_key_clientA_1
```

Each API key is scoped to a client. Products and images are isolated per client.

### Getting an API key (public endpoint)

```
GET /api/key/:clientId
```

Returns the API key and its expiration date. No authentication required.

## GraphQL API

### Queries

**Get all products for the authenticated client:**

```graphql
query {
  getProducts {
    id
    name
    description
    stock
    price
    isActive
    images {
      id
      url
    }
  }
}
```

**Get a single product by ID:**

```graphql
query {
  getProductById(id: "product-uuid") {
    id
    name
    images {
      id
      url
    }
  }
}
```

### Mutations

**Create a product:**

```graphql
mutation {
  createProduct(input: {
    name: "New Product"
    description: "A description"
    stock: 50
    price: 2999
  }) {
    id
    name
  }
}
```

**Update a product:**

```graphql
mutation {
  updateProduct(id: "product-uuid", input: {
    name: "Updated Name"
    price: 3999
    isActive: false
  }) {
    id
    name
    price
    isActive
  }
}
```

**Delete a product:**

```graphql
mutation {
  deleteProduct(id: "product-uuid") {
    id
  }
}
```

## Image Upload Flow

Uploading images uses GCP signed URLs. This is a 3-step process:

### Step 1 - Generate a signed URL

```graphql
mutation {
  generateUploadUrl(filename: "photo.png") {
    signedUrl
    publicId
  }
}
```

### Step 2 - Upload the file directly to GCS

Using the `signedUrl` from step 1, make a **PUT** request directly to Google Cloud Storage:

```bash
curl -X PUT \
  -H "Content-Type: image/png" \
  --upload-file photo.png \
  "<signedUrl>"
```

The `Content-Type` header must match the file extension used in step 1:

| Extension | Content-Type |
|-----------|-------------|
| `.png` | `image/png` |
| `.jpg` / `.jpeg` | `image/jpeg` |
| `.webp` | `image/webp` |
| other | `application/octet-stream` |

### Step 3 - Register the image

```graphql
mutation {
  createProductImage(productId: "product-uuid", publicId: "publicId-from-step-1") {
    id
    url
  }
}
```

### Delete an image

```graphql
mutation {
  deleteProductImage(id: "image-uuid") {
    id
  }
}
```

This removes the image from both the database and GCS.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:seed` | Seed the database |

## Seed Data

The seed script creates:

| Entity | Details |
|--------|---------|
| Client A | `clientA@example.com` with API key `api_key_clientA_1` |
| Client B | `clientB@example.com` with API key `api_key_clientB_1` |
| Sample Product A | Belongs to Client A |

API keys expire one year from seed date.
