# Patient Compass

Patient Compass is a lightweight clinical decision-support interface designed to capture patient context and generate structured, reviewable outputs (summary → recommendation draft → rationale → sources).  
This repository contains the front-end application (Next.js/TypeScript) built as an MVP for rapid iteration.

## Why this exists
Most clinical AI prototypes fail at the UI/workflow layer. Patient Compass focuses on:
- **Structured capture** of patient details (history, staging, preferences)
- **Consistent output format** suitable for clinician review
- **Auditability hooks** (placeholders for guideline citations / provenance)

## Current status
MVP in active development. Core UI flows are functional; integration points (RAG/guideline retrieval, database, clinician feedback loop) are being iterated.

Planned next steps:
- Connect to backend API for recommendation generation + logging
- Add structured “evidence/provenance” fields per recommendation
- Add clinician review and feedback capture

## Tech stack
- Next.js (App Router)
- TypeScript
- TailwindCSS (if applicable)
- (Optional) Supabase / Postgres integration (planned)

## Run locally
npm install
npm run dev

Then open: http://localhost:3000

## Repository structure (high level)

app/ – routes + pages

components/ – reusable UI components

lib/ – helpers (validation, formatting, API clients)

public/ – static assets

## Notes

This repo is part of a broader clinical AI workflow exploration (SPARC/Patient Compass). If you’d like context, I can share a 1-page architecture note.

## License

MIT
