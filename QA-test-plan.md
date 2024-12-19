# Warehouse Manager API test plan

### Document version 1.0.1

## Introduction

The Warehouse Manager API test plan contains information on the tests that are to be carried out to establish the proper functioning of the backend implementation of the Warehouse Manager API.

## In Scope

The project's tests will be unit, integration, and API tests. They will be developed and executed in the following order:

1. Unit tests,
   - Focus will be placed on the validation rules of the Mongoose schemas.
2. Integration tests,
3. API tests.

## Out of scope

The Warehouse Manager API is a backend project, therefore any tests referring to the frontend are excluded.

## Assumptions

The backend implementation is ongoing.

## Environments + Tools

The primary tool for unit testing is the Jest testing framework:

```
"jest": "^29.7.0",
```

Jest may also be used for the smooth running of integration tests.
