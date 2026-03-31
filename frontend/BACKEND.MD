# Backend API

**Base URL:** `https://aero-404.onrender.com`

## Uprawnienia

| Rola | Stala w backendzie |
|------|:---------------:|
| Administrator systemu | ADMIN |
| Osoba planująca | PLANNER |
| Osoba nadzorująca | SUPERVISOR |
| Pilot | PILOT |

---

## Endpointy

### Auth

#### POST `/api/v1/auth/register`

Rejestracja nowego użytkownika.

**Request:**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan@example.com",
  "password": "haslo123",
  "role": "PILOT"
}
```
- `firstName` (string, min 1 znak)
- `lastName` (string, min 1 znak)
- `email` (string, format email)
- `password` (string, min 8 znaków)
- `role` (enum: `ADMIN` | `PLANNER` | `SUPERVISOR` | `PILOT`)

**Response 200:**
```json
{
  "id": 1,
  "email": "jan@example.com",
  "role": "PILOT"
}
```

#### POST `/api/v1/auth/login`

Logowanie — zwraca token JWT.

**Request:**
```json
{
  "email": "jan@example.com",
  "password": "haslo123"
}
```
- `email` (string, format email)
- `password` (string, min 1 znak)

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "jan@example.com",
  "role": "PILOT"
}
```

---

### Users

#### GET `/api/v1/users`

Lista wszystkich użytkowników.

**Response 200:**
```json
[
  {
    "id": 1,
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan@example.com",
    "role": "PILOT"
  }
]
```

#### GET `/api/v1/users/{id}`

Pobranie użytkownika po ID.

**Path params:** `id` (integer, int64)

**Response 200:**
```json
{
  "id": 1,
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan@example.com",
  "role": "PILOT"
}
```

#### POST `/api/v1/users`

Utworzenie nowego użytkownika (admin).

**Request:**
```json
{
  "firstName": "Anna",
  "lastName": "Nowak",
  "email": "anna@example.com",
  "password": "haslo12345",
  "role": "PLANNER"
}
```

**Response 200:** `UserResponseDto` (jak wyżej)

#### PUT `/api/v1/users/{id}`

Aktualizacja użytkownika.

**Path params:** `id` (integer, int64)

**Request:** taki sam jak POST `/api/v1/users`

**Response 200:** `UserResponseDto`

#### DELETE `/api/v1/users/{id}`

Usunięcie użytkownika.

**Path params:** `id` (integer, int64)

**Response 200:** brak body

#### POST `/api/v1/users/{id}/assign-role`

Przypisanie roli użytkownikowi.

**Path params:** `id` (integer, int64)
**Query params:** `role` (enum: `ADMIN` | `PLANNER` | `SUPERVISOR` | `PILOT`)

Przykład: `POST /api/v1/users/1/assign-role?role=SUPERVISOR`

**Response 200:** `UserResponseDto`

---

### Utility

#### GET `/api/v1/health`

Health check.

**Response 200:** `{}` (pusty obiekt)

#### GET `/test`

Endpoint testowy.

**Response 200:** `string`

---

## Kody błędów (wspólne)

| Kod | Opis |
|-----|------|
| 200 | OK |
| 400 | Bad Request — błąd walidacji |
| 403 | Forbidden — brak uprawnień |
| 404 | Not Found |
| 500 | Internal Server Error |