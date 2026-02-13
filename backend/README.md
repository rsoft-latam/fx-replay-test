# FX Replay - Backend API

API RESTful para gestión de órdenes de trading (Trade Orders) construida con Node.js, TypeScript, Express, Prisma y PostgreSQL.

## Stack Tecnológico

- **Runtime:** Node.js
- **Lenguaje:** TypeScript (strict mode)
- **Framework:** Express.js
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Validación:** Zod
- **Documentación:** Swagger (OpenAPI 3.0)

## Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## Configuración de la Base de Datos

### 1. Crear la base de datos

Conéctate a PostgreSQL y crea la base de datos `traiding`:

```sql
CREATE DATABASE traiding;
```

> Si usas la terminal de PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE traiding;
\q
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta los valores según tu entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
## Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=traiding

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

## Server
PORT=3000
NODE_ENV=development
```

| Variable      | Descripción                    | Default     |
|---------------|--------------------------------|-------------|
| `DB_USER`     | Usuario de PostgreSQL          | `postgres`  |
| `DB_PASSWORD` | Contraseña de PostgreSQL       | `postgres`  |
| `DB_HOST`     | Host de la base de datos       | `localhost` |
| `DB_PORT`     | Puerto de PostgreSQL           | `5432`      |
| `DB_NAME`     | Nombre de la base de datos     | `traiding`  |
| `PORT`        | Puerto del servidor            | `3000`      |
| `NODE_ENV`    | Entorno de ejecución           | `development` |

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Generar el cliente de Prisma
npx prisma generate

# 3. Ejecutar migraciones (crea las tablas en la BD)
npx prisma migrate dev --name init

# 4. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

## Scripts Disponibles

| Comando                | Descripción                              |
|------------------------|------------------------------------------|
| `npm run dev`          | Inicia el servidor en modo desarrollo    |
| `npm run build`        | Compila TypeScript a JavaScript          |
| `npm start`            | Ejecuta la versión compilada (producción)|
| `npm run prisma:generate` | Genera el cliente de Prisma           |
| `npm run prisma:migrate`  | Ejecuta las migraciones               |
| `npm run prisma:studio`   | Abre Prisma Studio (GUI para la BD)   |

## Endpoints de la API

Base URL: `http://localhost:3000/api`

| Método   | Endpoint              | Descripción                          |
|----------|-----------------------|--------------------------------------|
| `POST`   | `/trade_orders`       | Crear una nueva orden                |
| `GET`    | `/trade_orders`       | Listar órdenes (con paginación)      |
| `GET`    | `/trade_orders/:id`   | Obtener una orden por ID             |
| `PUT`    | `/trade_orders/:id`   | Actualizar una orden                 |
| `DELETE` | `/trade_orders/:id`   | Eliminar una orden (soft delete)     |

### Paginación

```
GET /api/trade_orders?page=1&limit=10
```

### Ejemplo: Crear una orden

```bash
curl -X POST http://localhost:3000/api/trade_orders \
  -H "Content-Type: application/json" \
  -d '{
    "side": "buy",
    "type": "limit",
    "amount": 1.5,
    "price": 99000,
    "pair": "BTCUSD"
  }'
```

### Pares disponibles y precios de referencia

| Par      | Precio de Mercado |
|----------|-------------------|
| BTCUSD   | 100150.40         |
| EURUSD   | 1.035             |
| ETHUSD   | 3310.00           |

### Reglas de validación por tipo de orden

| Tipo    | Side | Regla de precio                        |
|---------|------|----------------------------------------|
| Market  | any  | Sin validación (se ejecuta al precio de mercado) |
| Limit   | buy  | `price < precio de mercado`            |
| Limit   | sell | `price > precio de mercado`            |
| Stop    | buy  | `price > precio de mercado`            |
| Stop    | sell | `price < precio de mercado`            |

## Documentación Swagger

Disponible en: `http://localhost:3000/api-docs`

## Estructura del Proyecto

```
src/
├── config/
│   └── swagger.ts              # Configuración OpenAPI
├── controllers/
│   └── trade-order.controller.ts
├── dtos/
│   └── trade-order.dto.ts      # Esquemas de validación (Zod)
├── middlewares/
│   ├── error-handler.ts        # Manejo global de errores
│   └── validate.ts             # Middleware de validación
├── prisma/
│   └── client.ts               # Instancia de Prisma Client
├── routes/
│   └── trade-order.routes.ts
├── services/
│   └── trade-order.service.ts  # Lógica de negocio
├── utils/
│   ├── api-response.ts         # Respuestas estandarizadas
│   ├── app-error.ts            # Clase de error personalizada
│   └── serializer.ts           # Serialización de Decimal
├── app.ts                      # Configuración de Express
└── server.ts                   # Punto de entrada
```
