# Stock App API

Express-based REST API for managing companies and notifications.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Companies

- `GET /api/companies` - Get all companies
- `GET /api/companies/observed` - Get all observed companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create a new company
- `PUT /api/companies/:id` - Update company
- `PATCH /api/companies/:id/observe` - Toggle company observation status
- `DELETE /api/companies/:id` - Delete company

### Notifications (Public Information)

- `GET /api/notifications` - Get all notifications (supports ?limit and ?offset)
- `GET /api/notifications/company/:companyId` - Get notifications for a specific company
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create a new notification
- `PUT /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Delete notification

### Health Check

- `GET /health` - API health check

## Example Requests

### Create a Company
```bash
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example Corp",
    "ticker": "EXMP",
    "observed": true
  }'
```

### Create a Notification
```bash
curl -X POST http://localhost:3001/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q4 Earnings Report",
    "content": "Company announces strong Q4 results",
    "source": "espi",
    "type": "earnings",
    "companyId": 1,
    "timestamp": "2024-01-10T10:00:00Z"
  }'
```

### Toggle Company Observation
```bash
curl -X PATCH http://localhost:3001/api/companies/1/observe \
  -H "Content-Type: application/json" \
  -d '{"observed": true}'
```
