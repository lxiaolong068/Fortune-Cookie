# Notes: Auth Session 401 Fix

## Sources

### Source 1: docs/backend-auth-api.md
- Key point: Missing token should return 401 for auth/session endpoint.

## Findings
- Need to locate session route and adjust missing Authorization behavior.
