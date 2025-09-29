# Mock Mart API Documentation

This document provides comprehensive documentation for the Mock Mart e-commerce platform API endpoints.

## Table of Contents

- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Product Endpoints](#product-endpoints)
  - [Comment Endpoints](#comment-endpoints)
  - [Rating Endpoints](#rating-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Category Endpoints](#category-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Response Formats](#response-formats)

## Authentication

The API uses session-based authentication with HTTP-only cookies. The session ID is stored in a cookie named `session_id` that expires after 7 days.

### Session Management
- Sessions are automatically created upon successful sign-in
- Session cookies are HTTP-only and set with `SameSite=Lax`
- Sessions expire after 7 days of inactivity
- Sessions are invalidated upon sign-out

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, must not contain emojis
- `email`: Required, must be valid email format
- `password`: Required, 6-50 characters

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-09-29T10:00:00.000Z",
    "updatedAt": "2025-09-29T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid input data
- `409`: User with email already exists
- `500`: Server error

---

#### POST /api/auth/signin
Authenticates a user and creates a session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-09-29T10:00:00.000Z",
    "updatedAt": "2025-09-29T10:00:00.000Z"
  }
}
```

**Sets Cookie:**
```
session_id=<session-uuid>; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

---

#### POST /api/auth/signout
Signs out the current user and invalidates the session.

**Authentication:** Required (session cookie)

**Response (200):**
```json
{}
```

**Cookie Action:** Deletes the `session_id` cookie

---

#### GET /api/auth/me
Returns the current authenticated user's information.

**Authentication:** Required (session cookie)

**Response (200) - Authenticated:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-09-29T10:00:00.000Z",
    "updatedAt": "2025-09-29T10:00:00.000Z"
  }
}
```

**Response (200) - Not Authenticated:**
```json
{
  "user": null
}
```

### Product Endpoints

#### GET /api/products
Retrieves products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by product category
- `query` (optional): Search products by name
- `minPrice` (optional): Minimum price filter (number)
- `maxPrice` (optional): Maximum price filter (number)
- `minRating` (optional): Minimum rating filter (0-5)

**Example Requests:**
```
GET /api/products
GET /api/products?category=electronics
GET /api/products?query=phone&minPrice=100&maxPrice=500
GET /api/products?minRating=4.0
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "iPhone 13",
    "price": 999.99,
    "description": "Latest iPhone model",
    "category": "electronics",
    "image": "https://example.com/iphone13.jpg",
    "rating": {
      "rate": 4.5,
      "count": 152
    }
  }
]
```

**Error Responses:**
- `400`: Invalid query parameters
- `500`: Server error

---

#### GET /api/products/[id]
Retrieves a specific product by ID.

**Path Parameters:**
- `id`: Product ID (number)

**Response (200):**
```json
{
  "id": 1,
  "title": "iPhone 13",
  "price": 999.99,
  "description": "Latest iPhone model",
  "category": "electronics",
  "image": "https://example.com/iphone13.jpg",
  "rating": {
    "rate": 4.5,
    "count": 152
  }
}
```

**Error Responses:**
- `404`: Product not found
- `500`: Server error

### Comment Endpoints

#### GET /api/products/[id]/comments
Retrieves all comments for a specific product.

**Path Parameters:**
- `id`: Product ID (number)

**Response (200):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "userId": 1,
    "content": "Great product!",
    "createdAt": "2025-09-29T10:00:00.000Z"
  }
]
```

**Error Responses:**
- `500`: Server error

---

#### POST /api/products/[id]/comments
Adds a new comment to a product.

**Authentication:** Required

**Path Parameters:**
- `id`: Product ID (number)

**Request Body:**
```json
{
  "content": "This is a great product!"
}
```

**Response (200):**
```json
{
  "id": 1,
  "productId": 1,
  "userId": 1,
  "content": "This is a great product!",
  "createdAt": "2025-09-29T10:00:00.000Z"
}
```

**Error Responses:**
- `401`: Authentication required
- `500`: Server error

---

#### PUT /api/comments/[id]
Updates an existing comment.

**Authentication:** Required (must be comment owner)

**Path Parameters:**
- `id`: Comment ID (number)

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response (200):**
```json
{
  "id": 1,
  "productId": 1,
  "userId": 1,
  "content": "Updated comment content",
  "createdAt": "2025-09-29T10:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid content
- `401`: Authentication required
- `404`: Comment not found or no permission
- `500`: Server error

---

#### DELETE /api/comments/[id]
Deletes a comment.

**Authentication:** Required (must be comment owner)

**Path Parameters:**
- `id`: Comment ID (number)

**Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401`: Authentication required
- `404`: Comment not found or no permission
- `500`: Server error

### Rating Endpoints

#### POST /api/products/[id]/rate
Adds a rating to a product.

**Authentication:** Required

**Path Parameters:**
- `id`: Product ID (number)

**Request Body:**
```json
{
  "rating": 5
}
```

**Validation:**
- `rating`: Must be integer between 1-5
- Users can only rate each product once

**Response (200):**
```json
{
  "rating": {
    "rate": 4.2,
    "count": 26
  }
}
```

**Error Responses:**
- `400`: Invalid rating or already rated
- `401`: Not authenticated
- `500`: Server error

---

#### GET /api/products/[id]/user-rating
Gets the current user's rating for a product.

**Authentication:** Required

**Path Parameters:**
- `id`: Product ID (number)

**Response (200) - User has rated:**
```json
{
  "rating": 5
}
```

**Response (200) - User hasn't rated:**
```json
{
  "rating": null
}
```

**Error Responses:**
- `401`: Not authenticated
- `500`: Server error

### User Endpoints

#### GET /api/users/[id]
Retrieves public user information.

**Path Parameters:**
- `id`: User ID (number)

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error Responses:**
- `404`: User not found
- `500`: Server error

### Category Endpoints

#### GET /api/categories
Retrieves all available product categories.

**Response (200):**
```json
[
  "electronics",
  "clothing",
  "books",
  "home"
]
```

**Error Responses:**
- `500`: Server error

## Data Models

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  role: string; // "user" | "admin"
  createdAt: Date | null;
  updatedAt: Date | null;
}
```

### Product
```typescript
{
  id: number;
  title: string;
  price: number;
  description: string | null;
  category: string;
  image: string | null;
  rating: {
    rate: number; // Average rating
    count: number; // Number of ratings
  };
}
```

### Comment
```typescript
{
  id: number;
  productId: number;
  userId: number;
  content: string;
  createdAt: Date | null;
}
```

### Rating
```typescript
{
  id: number;
  productId: number;
  userId: number;
  rating: number; // 1-5
  createdAt: Date | null;
  updatedAt: Date | null;
}
```

### Session
```typescript
{
  id: string; // UUID
  userId: number;
  expiresAt: Date;
  createdAt: Date | null;
}
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Resource already exists
- `500`: Internal Server Error

## Response Formats

### Success Responses
All successful responses return JSON with the requested data.

### Error Responses
All error responses include an `error` field with a descriptive message:

```json
{
  "error": "Descriptive error message"
}
```

### Pagination
Currently, the API does not implement pagination. All endpoints return complete result sets.

### Rate Limiting
The API does not currently implement rate limiting.

## Notes

### Incomplete Features
- **Entrypoint Creation**: The `/api/products/[id]/entrypoint` endpoint is not yet implemented
- **Rating Authentication**: Some rating endpoints use mock authentication (TODO: Replace with real session logic)

### Security Considerations
- Passwords are hashed using bcrypt with salt
- Sessions use secure HTTP-only cookies
- User input is validated for XSS prevention
- SQL injection protection via Drizzle ORM parameterized queries

### Database
The API uses MySQL with Drizzle ORM for database operations. All operations are performed using prepared statements for security.