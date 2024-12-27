# Warehouse Manager API test plan

Document version 1.0.2

## Introduction

The Warehouse Manager API test plan contains information on the tests that are to be carried out to establish the proper functioning of the backend implementation of the Warehouse Manager API.

## In Scope

The project's tests will be unit, integration, and API tests. Completed tests are noted with ✔, while the pending ones are noted with ⌛.

### Unit tests

Focus will be placed on the validation rules of the Mongoose schemas. They are to be conducted per model schema:

- User model [✔] ,
- Customer model [✔],
- Product model [✔],
- Stock model [✔],
- Order model [✔]

### Integration tests

They are to be conducted per operation, involving middleware and controllers:

- User registration [⌛],
- User login [⌛],
- Customer addition [⌛],
- Customer information update [⌛],
- Customer deletion [⌛],
- Product addition [⌛],
- Product information update [⌛],
- Product deletion [⌛],
- Stock creation [⌛],
- Stock information update [⌛],
- Order addition [⌛],
- Order update [⌛],
- Order deletion [⌛]

### API tests

[To be developed]

## Out of scope

The Warehouse Manager API is a backend project, therefore any tests referring to the frontend are excluded.

## Assumptions

The backend implementation is ongoing.

## Environments + Tools

The primary tool for unit testing is the Jest testing framework:

```javascript
"jest": "^29.7.0",
```

Jest may also be used for the smooth running of integration tests.
