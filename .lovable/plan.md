

## Update Doctor Console API Base URL

A single-line change in `src/lib/doctorApi.ts` is needed. The file already has all 4 endpoints using `API_BASE` and already includes the `ngrok-skip-browser-warning` header. Only the base URL on line 1 needs to change:

**Change:** `const API_BASE = 'http://localhost:3001'` to `const API_BASE = 'https://presolar-tania-unsallow.ngrok-free.dev'`

This automatically fixes all 4 endpoints since they all reference `API_BASE`.

