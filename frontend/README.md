# FX Replay Trading - Frontend

Frontend for the **FX Replay Trading** simulated trading application. It allows managing buy/sell orders on currency and cryptocurrency pairs with real-time business rule validations.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 19 | Main framework (Standalone Components) |
| Angular Material | 19 | UI components (Table, Forms, Dialog, Snackbar) |
| RxJS | 7.8 | Reactive data handling |
| TypeScript | 5.7 | Static typing |
| Jest | 29 | Unit testing |
| SCSS | - | Styling |

## Prerequisites

- Node.js >= 18
- npm >= 9
- Backend running at `http://localhost:3000/api` (configurable in `src/app/environments/environment.ts`)

## Installation

```bash
npm install
```

## Available Scripts

```bash
# Development server (http://localhost:4200)
npm start

# Production build
npm run build

# Unit tests
npm test

# Tests in watch mode
npm run test:watch

# Tests with coverage report
npm run test:coverage
```

## Project Structure

```
src/app/
├── components/
│   ├── confirm-dialog/              # Confirmation dialog for order deletion
│   │   └── confirm-dialog.component.ts
│   ├── trade-form/                  # Order creation/editing form
│   │   ├── trade-form.component.ts
│   │   ├── trade-form.component.html
│   │   ├── trade-form.component.scss
│   │   └── trade-form.component.spec.ts
│   └── trade-list/                  # Paginated order list table
│       ├── trade-list.component.ts
│       ├── trade-list.component.html
│       ├── trade-list.component.scss
│       └── trade-list.component.spec.ts
├── environments/
│   └── environment.ts               # Environment config (API URL)
├── models/
│   └── trade.model.ts               # Interfaces, types, and constants
├── services/
│   ├── trade.service.ts             # Order CRUD operations (HttpClient)
│   ├── trade.service.spec.ts
│   ├── notification.service.ts      # Notifications via MatSnackBar
│   ├── notification.service.spec.ts
│   └── error.interceptor.ts         # HTTP interceptor for global error handling
├── validators/
│   ├── price.validator.ts           # Custom price validator against market prices
│   └── price.validator.spec.ts
├── app.component.ts                 # Main shell (toolbar + router-outlet)
├── app.config.ts                    # Providers (HttpClient, Router, Animations, Interceptor)
└── app.routes.ts                    # Lazy-loaded routes
```

## Routes

| Route | Component | Description |
|---|---|---|
| `/trades` | `TradeListComponent` | Order list with server-side pagination |
| `/trades/new` | `TradeFormComponent` | Form to create a new order |
| `/trades/:id` | `TradeFormComponent` | Form to edit an existing order |

## Backend API

The application connects to a RESTful API with the following response structure:

```json
{
  "success": true,
  "message": "OK",
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### Consumed Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trade_orders?page=1&limit=10` | List orders (paginated) |
| `GET` | `/api/trade_orders/:id` | Get a single order by ID |
| `POST` | `/api/trade_orders` | Create a new order |
| `PUT` | `/api/trade_orders/:id` | Update an order |
| `DELETE` | `/api/trade_orders/:id` | Delete an order |

## Business Rules - Price Validation

The form implements a custom validator that checks the price against the current market price based on the order type and side (buy/sell):

**Market prices (hardcoded):**

| Pair | Price |
|---|---|
| BTCUSD | 100,150.4 |
| EURUSD | 1.035 |
| ETHUSD | 3,310 |

**Validation rules:**

| Type | Side | Rule |
|---|---|---|
| Limit | Buy | Price < Market Price |
| Limit | Sell | Price > Market Price |
| Stop | Buy | Price > Market Price |
| Stop | Sell | Price < Market Price |
| Market | - | Price field is disabled (sent as 0) |

## Testing

The project includes 32 unit tests covering happy paths:

```
 PASS  src/app/validators/price.validator.spec.ts          (6 tests)
 PASS  src/app/services/trade.service.spec.ts              (6 tests)
 PASS  src/app/services/notification.service.spec.ts       (3 tests)
 PASS  src/app/components/trade-list/trade-list.component  (7 tests)
 PASS  src/app/components/trade-form/trade-form.component  (10 tests)
```

### What is tested

- **Validator**: All valid type/side/price combinations and edge cases (market, empty pair)
- **TradeService**: All 5 CRUD methods with `HttpTestingController`, verifying HTTP method, URL, and body
- **NotificationService**: Snackbar opens with the correct CSS classes
- **TradeListComponent**: Initial load, loading state, pagination, formatting helpers
- **TradeFormComponent**: Form initialization, validations, price toggle on market type, create submission, edit mode

## Environment Configuration

To change the backend URL, edit `src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```
