# Function Backend

Simple Django REST API backend for the **Function Platform** frontend.

## Features

- JWT register/login/profile
- Subjects: Mathematics, Geometry, Logic, Economy
- Courses and tests API
- Test detail API with questions/options
- Submit test answers and get score
- User attempt history
- Simple premium mock endpoint without real card processing
- SQLite by default
- No Docker
- No GitHub push needed

## Setup

```bash
cd function_backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_function_data
python manage.py runserver
```

API runs at:

```txt
http://127.0.0.1:8000/api/
```

## Auth endpoints

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Create account and return JWT tokens |
| POST | `/api/auth/login/` | Login and return JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh JWT access token |
| GET | `/api/auth/profile/` | Current user profile |

Register body:

```json
{
  "username": "ramazon",
  "email": "ramazon@example.com",
  "password": "StrongPass123",
  "password2": "StrongPass123"
}
```

Login body:

```json
{
  "username": "ramazon",
  "password": "StrongPass123"
}
```

Use JWT like this:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Learning endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/subjects/` | List subjects/categories |
| GET | `/api/courses/` | List courses |
| GET | `/api/courses/?subject=math` | Filter courses by subject slug |
| GET | `/api/tests/` | List tests |
| GET | `/api/tests/?subject=logic` | Filter tests by subject slug |
| GET | `/api/tests/<id>/` | Test detail with questions/options |
| POST | `/api/tests/<id>/submit/` | Submit answers and receive score |
| GET | `/api/attempts/` | My solved tests |
| POST | `/api/premium/mock-purchase/` | Demo premium unlock |

Submit body:

```json
{
  "answers": [
    {"question_id": 1, "option_id": 2},
    {"question_id": 2, "option_id": 5}
  ]
}
```

Premium mock body:

```json
{
  "test_id": 1,
  "amount": "5000.00"
}
```

## Frontend mapping

Your React frontend routes can map like this:

- `/test` → `GET /api/tests/`
- category filter → `GET /api/tests/?subject=math`
- test start `/card` → `GET /api/tests/<id>/`
- finish test → `POST /api/tests/<id>/submit/`
- register page → `POST /api/auth/register/`
- login page → `POST /api/auth/login/`

## Notes

This backend is intentionally simple. It does not process real card data. For production, connect Click/Payme through official payment flow and never store raw card numbers.
