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

### WebSocket

- `GET /ws/info` - Get WebSocket connection info and client count
- WebSocket endpoint: `ws://localhost:3001` - Real-time updates for data changes

## WebSocket Events

The API broadcasts the following events via WebSocket when data changes occur:

### Company Events
- `company_created` - When a new company is created
- `company_updated` - When a company is updated
- `company_observed_changed` - When a company's observation status changes
- `company_deleted` - When a company is deleted

### Notification Events
- `notification_created` - When a new notification is created
- `notification_updated` - When a notification is updated
- `notification_deleted` - When a notification is deleted

Each event includes a `type` field and a `data` field with the relevant entity.

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

### Connect to WebSocket

#### JavaScript Example
```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);

  // Handle different event types
  switch (message.type) {
    case 'company_created':
      console.log('New company:', message.data);
      break;
    case 'notification_created':
      console.log('New notification:', message.data);
      break;
    // ... handle other events
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};
```

#### Node.js Example
```javascript
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
  console.log('Connected to WebSocket');
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('Received:', message);
});
```
