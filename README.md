# Art Gallery Management System

A full-stack app for managing and browsing artworks in a virtual gallery.
Users can view, filter and sort artworks, and also add/remove them.

**Stack:** NestJS, MongoDB (Mongoose), React, TypeScript, Vite

## Project structure

```
backend/    NestJS REST API
frontend/   React + Vite client
```

## Requirements

- Node.js 18+
- MongoDB, one of:
  - a local instance (`mongodb://localhost:27017/art-gallery-api`)
  - your own MongoDB Atlas cluster

## Running the backend

```bash
cd backend
npm install
cp .env.example .env    # set MONGO_URI if you are not using the default local database
npm run start:dev
```

The API runs on `http://localhost:3000`.

On first start, if the `artworks` collection is empty, 4 initial artworks are added automatically.

## Running the frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL must point to the backend
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment variables

| File | Variable | Example |
|---|---|---|
| `backend/.env` | `MONGO_URI` | `mongodb://localhost:27017/art-gallery-api` |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:3000` |

## API

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/artworks` | List artworks, supports filtering and sorting |
| GET | `/artworks/:id` | Get one artwork |
| POST | `/artworks` | Add an artwork |
| PUT | `/artworks/:id` | Update an artwork (optional feature, same validation as POST) |
| DELETE | `/artworks/:id` | Remove an artwork |

### Query parameters for `GET /artworks`

| Parameter | Values | Description |
|---|---|---|
| `price` | `asc`, `desc` | Sort by price |
| `artist` | string | Filter by artist name |
| `type` | `painting`, `sculpture`, `ceramics`, `digital_art` | Filter by artwork type |

Example: `GET /artworks?price=asc&type=painting`

### Validation for `POST` and `PUT`

| Field | Rules |
|---|---|
| `title` | required, max 99 characters |
| `artist` | required, max 50 characters |
| `type` | required, one of the predefined types |
| `price` | required, number greater than 0 |
| `available` | boolean, optional (defaults to `true`) |

Invalid requests return `400 Bad Request` with a list of errors. An unknown id returns `404`, a malformed id returns `400`.