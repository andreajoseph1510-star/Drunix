# API Contract

Base URL (local): `http://<laptop-ip>:8000`
All endpoints accept and return JSON.

## Shared response shape

Every scoring endpoint returns this:

```json
{
  "risk_score": 87,
  "level": "high",
  "reasons": [
    { "code": "URGENT_LANGUAGE", "text": "Uses urgent wording like 'act now'", "weight": 0.31 },
    { "code": "LOOKALIKE_DOMAIN", "text": "Link imitates a bank's website", "weight": 0.45 }
  ]
}
```

Rules:
- `risk_score` is a number from 0 to 100.
- `level` is `low` (0-34), `medium` (35-69) or `high` (70-100).
- `reasons` is a list, sorted by `weight` from highest to lowest.

## POST /score/message

```json
{ "text": "Your KYC expires today! Click http://sbi-kyc-update.xyz", "language": "auto" }
```

The backend extracts any links from `text` itself.

## POST /score/payee

```json
{ "upi_id": "rahul.sharma@okaxis", "payee_name": "Rahul Sharma", "request_type": "collect" }
```

`request_type` is `pay` or `collect`.

## POST /score/transaction

```json
{ "amount": 49999, "hour_of_day": 2, "is_new_payee": true, "payee_upi_id": "rahul.sharma@okaxis" }
```

## POST /score/combined

```json
{
  "message": { "text": "..." },
  "payee": { "upi_id": "..." },
  "transaction": { "amount": 49999 }
}
```

Every part is optional. The response uses the shared shape and adds a `modules` object with each module's own score.

## GET /health

Returns `{ "status": "ok" }`. Used to check the server is awake.

## Errors

Bad input returns a 4xx status with:

```json
{ "error": "text is required" }
```
