# CMS Backend - Complete Guide

This document provides a comprehensive guide to managing content using the Global Network Finance CMS backend.

## Getting Started

### 1. Start the Backend Server

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Create Your Admin Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "securepassword"
  }'
```

### 3. Upgrade to Admin Role

Connect to MongoDB directly and run:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### 4. Login and Get Your Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword"
  }'
```

Save the returned `token` for future requests.

---

## Content Management Operations

### Create a New Article

```bash
curl -X POST http://localhost:5000/api/cms/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Blockchain Revolution in Finance",
    "description": "How blockchain is transforming the financial industry",
    "content": "Long form content here...",
    "category": "news",
    "tags": "blockchain,finance,technology",
    "imageUrl": "https://example.com/blockchain.jpg"
  }'
```

Response:
```json
{
  "message": "Content created successfully",
  "content": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Blockchain Revolution in Finance",
    "slug": "blockchain-revolution-in-finance",
    "status": "draft",
    "author": "admin",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Content ID

After creating, use the `_id` from the response. Or retrieve it:

```bash
curl http://localhost:5000/api/cms/admin/content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Publish Content

```bash
curl -X PUT http://localhost:5000/api/cms/content/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "published",
    "featured": true
  }'
```

### View Published Content

```bash
curl http://localhost:5000/api/cms/content
```

### Get Content by Slug

```bash
curl http://localhost:5000/api/cms/content/blockchain-revolution-in-finance
```

### Update Existing Content

```bash
curl -X PUT http://localhost:5000/api/cms/content/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content here...",
    "featured": false
  }'
```

### Archive Content

```bash
curl -X PUT http://localhost:5000/api/cms/content/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "archived"
  }'
```

### Delete Content

```bash
curl -X DELETE http://localhost:5000/api/cms/content/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Content Categories

Available categories for organizing your content:

- `news` - Breaking news and market updates
- `blog` - Blog posts and articles
- `announcement` - Important announcements
- `guide` - Tutorials and guides
- `other` - Miscellaneous content

---

## Content Filters

### By Category

```bash
curl "http://localhost:5000/api/cms/content?category=news"
```

### By Tag

```bash
curl "http://localhost:5000/api/cms/content?tag=blockchain"
```

### Featured Only

```bash
curl "http://localhost:5000/api/cms/content?featured=true"
```

### Pagination

```bash
curl "http://localhost:5000/api/cms/content?limit=5&skip=0"
```

### Combine Filters

```bash
curl "http://localhost:5000/api/cms/content?category=news&featured=true&limit=10&skip=0"
```

---

## User Management

### Create Editor Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "editor1",
    "email": "editor1@example.com",
    "password": "securepassword"
  }'
```

Then upgrade in MongoDB:
```javascript
db.users.updateOne(
  { email: "editor1@example.com" },
  { $set: { role: "editor" } }
)
```

### Check Current User Profile

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Content Status Workflow

1. **Draft** - Initial state when content is created
2. **Published** - Visible to all public users
3. **Archived** - Hidden from public, kept for records

---

## Best Practices

1. **Always use descriptive titles** - They're used to generate URL slugs
2. **Write compelling descriptions** - Used for previews and SEO
3. **Use relevant tags** - Help users find related content
4. **Keep tokens secure** - Never share your JWT token publicly
5. **Backup your content** - Regularly export your data
6. **Use featured flag wisely** - Highlight important articles

---

## Error Handling

### 401 Unauthorized
Missing or invalid token. Re-login to get a new token.

### 403 Forbidden
Your user role doesn't have permission for this action.

### 404 Not Found
Content with the specified ID/slug doesn't exist.

### 500 Server Error
Backend server issue. Check server logs.

---

## Integration with Frontend

The frontend dashboard automatically fetches published content:

```javascript
// Fetches from /api/cms/content
const response = await fetch('/api/cms/content')
const { content, total } = await response.json()
```

---

## Advanced: Bulk Operations

### Export All Content

```bash
curl http://localhost:5000/api/cms/admin/content?limit=1000 \
  -H "Authorization: Bearer YOUR_TOKEN" > content_backup.json
```

### Create Multiple Content Items

Create a script that calls the POST endpoint multiple times with different content.

---

## Next Steps

- Set up the frontend to display your managed content
- Create editor accounts for your team
- Develop a content calendar and publishing schedule
- Configure SSL certificates for production
- Set up database backups
