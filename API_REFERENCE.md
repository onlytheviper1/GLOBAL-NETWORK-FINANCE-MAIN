# API Reference

Complete API documentation for Global Network Finance CMS Backend.

## Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (201 Created)
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "john_doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

**Status Codes**
- `201` - User created successfully
- `400` - Email or username already exists
- `500` - Server error

---

### POST /auth/login

Authenticate user and receive JWT token.

**Request**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "john_doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

**Status Codes**
- `200` - Login successful
- `401` - Invalid email or password
- `500` - Server error

---

### GET /auth/profile

Get current authenticated user's profile.

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "viewer",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes**
- `200` - Profile retrieved
- `401` - Invalid or missing token
- `500` - Server error

---

## CMS Content Endpoints

### GET /cms/content

Get all published content with optional filters.

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (news, blog, announcement, guide, other) |
| `tag` | string | Filter by tag |
| `featured` | boolean | Show only featured content |
| `limit` | number | Results per page (default: 10) |
| `skip` | number | Number of results to skip (default: 0) |

**Example Request**
```
GET /cms/content?category=news&limit=5&skip=0
```

**Response** (200 OK)
```json
{
  "content": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Breaking News",
      "slug": "breaking-news",
      "description": "Short description",
      "content": "Full article content...",
      "category": "news",
      "author": "admin",
      "featured": true,
      "status": "published",
      "tags": ["breaking", "important"],
      "imageUrl": "https://example.com/image.jpg",
      "views": 152,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 42
}
```

**Status Codes**
- `200` - Success
- `500` - Server error

---

### GET /cms/content/:slug

Get a single content item by slug.

**Example Request**
```
GET /cms/content/breaking-news
```

**Response** (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Breaking News",
  "slug": "breaking-news",
  "description": "Short description",
  "content": "Full article content...",
  "category": "news",
  "author": "admin",
  "featured": true,
  "status": "published",
  "tags": ["breaking", "important"],
  "imageUrl": "https://example.com/image.jpg",
  "views": 153,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes**
- `200` - Success
- `404` - Content not found
- `500` - Server error

---

### POST /cms/content

Create new content (requires Editor or Admin role).

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "New Article Title",
  "description": "Brief description of the article",
  "content": "Full content goes here...",
  "category": "blog",
  "tags": "finance,investment,guide",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response** (201 Created)
```json
{
  "message": "Content created successfully",
  "content": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New Article Title",
    "slug": "new-article-title",
    "description": "Brief description of the article",
    "content": "Full content goes here...",
    "category": "blog",
    "author": "john_doe",
    "featured": false,
    "status": "draft",
    "tags": ["finance", "investment", "guide"],
    "imageUrl": "https://example.com/image.jpg",
    "views": 0,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Status Codes**
- `201` - Content created
- `401` - Missing or invalid token
- `403` - Insufficient permissions
- `500` - Server error

---

### PUT /cms/content/:id

Update existing content (requires Editor or Admin role).

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (any combination of fields)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published",
  "featured": true
}
```

**Response** (200 OK)
```json
{
  "message": "Content updated successfully",
  "content": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated Title",
    "slug": "new-article-title",
    "status": "published",
    "featured": true,
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

**Status Codes**
- `200` - Content updated
- `401` - Missing or invalid token
- `403` - Insufficient permissions
- `404` - Content not found
- `500` - Server error

---

### DELETE /cms/content/:id

Delete content (Admin only).

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "message": "Content deleted successfully"
}
```

**Status Codes**
- `200` - Content deleted
- `401` - Missing or invalid token
- `403` - Admin access required
- `404` - Content not found
- `500` - Server error

---

### GET /cms/admin/content

Get all content including drafts (Admin only).

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Results per page (default: 20) |
| `skip` | number | Number of results to skip (default: 0) |

**Response** (200 OK)
```json
{
  "content": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Draft Article",
      "status": "draft",
      "views": 0
    }
  ],
  "total": 150
}
```

**Status Codes**
- `200` - Success
- `401` - Missing or invalid token
- `403` - Admin access required
- `500` - Server error

---

## Health Check

### GET /health

Check if API is running.

**Response** (200 OK)
```json
{
  "status": "API is running"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error description"
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| `400` | Bad Request | Invalid request body |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Internal server error |

---

## Rate Limiting

Not currently implemented. Add in production:

```javascript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)
```

---

## CORS Configuration

Currently allows all origins. Update for production:

```javascript
import cors from 'cors'

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
```

---

## Testing Endpoints with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Create Content
```bash
curl -X POST http://localhost:5000/api/cms/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Article",
    "description": "Test",
    "content": "Test content",
    "category": "blog"
  }'
```

### Get Published Content
```bash
curl http://localhost:5000/api/cms/content
```

### Get Content by Slug
```bash
curl http://localhost:5000/api/cms/content/test-article
```

---

## Pagination Example

Get items 10-20:
```
GET /cms/content?skip=10&limit=10
```

---

## Future API Features

- [ ] Search endpoint
- [ ] Comment system
- [ ] User analytics
- [ ] Email notifications
- [ ] File uploads
- [ ] API versioning
- [ ] GraphQL support
