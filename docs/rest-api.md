# REST API

Chuo-GPA includes a Fastify HTTP API in `apps/api`. Use it when clients cannot import the npm packages (mobile backends, other languages, etc.).

## Start the server (from this repo)

```bash
pnpm install
pnpm build
pnpm --filter @chuo-gpa/api dev
```

Default base URL: `http://localhost:3000`

Interactive docs (Swagger): [http://localhost:3000/docs](http://localhost:3000/docs)

## Endpoints

| Method | Path                       | Description            |
| ------ | -------------------------- | ---------------------- |
| `GET`  | `/api/v1/health`           | Health check           |
| `GET`  | `/api/v1/universities`     | List universities      |
| `GET`  | `/api/v1/universities/:id` | One university’s rules |
| `POST` | `/api/v1/gpa`              | Calculate GPA          |
| `POST` | `/api/v1/cgpa`             | Calculate CGPA         |
| `POST` | `/api/v1/classify`         | Classify a GPA value   |

## POST `/api/v1/gpa`

**Request**

```json
{
  "universityId": "udsm",
  "courses": [
    { "name": "Database Security", "credits": 10, "grade": "A" },
    { "name": "Software Engineering", "credits": 10, "grade": "B+" }
  ]
}
```

`universityId` is optional. `courses` must have at least one item. Each course needs `name`, `credits` (> 0), and `grade`. Optional `score` (0–100).

**curl**

```bash
curl -X POST http://localhost:3000/api/v1/gpa \
  -H "Content-Type: application/json" \
  -d "{
    \"universityId\": \"udsm\",
    \"courses\": [
      { \"name\": \"Database Security\", \"credits\": 10, \"grade\": \"A\" },
      { \"name\": \"Software Engineering\", \"credits\": 10, \"grade\": \"B+\" }
    ]
  }"
```

## POST `/api/v1/cgpa`

```json
{
  "universityId": "udsm",
  "semesters": [
    {
      "name": "Year 1 Semester 1",
      "courses": [
        { "name": "Programming I", "credits": 10, "grade": "A" },
        { "name": "Mathematics I", "credits": 10, "grade": "B+" }
      ]
    },
    {
      "name": "Year 1 Semester 2",
      "courses": [
        { "name": "Programming II", "credits": 10, "grade": "B+" },
        { "name": "Mathematics II", "credits": 10, "grade": "A" }
      ]
    }
  ]
}
```

## POST `/api/v1/classify`

```json
{
  "gpa": 4.2,
  "universityId": "udsm"
}
```

`gpa` must be between 0 and 5. `universityId` is optional.

## GET universities

```bash
curl http://localhost:3000/api/v1/universities
curl http://localhost:3000/api/v1/universities/udsm
```

## Validation

Requests are validated with Zod. Invalid bodies return HTTP error responses with messages such as:

- Course name is required
- Credits must be greater than 0
- At least one course is required

Prefer the npm packages for TypeScript frontends; use this API for language-agnostic integrations.
