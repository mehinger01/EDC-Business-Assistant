# Ogemaw County EDC AI Business Assistant

## Overview

A constrained AI-assisted business guidance chatbot for the Ogemaw County Economic Development Corporation (West Branch, Michigan). Answers questions about EDC programs, resources, and services. Designed to be embedded on ogemawedc.com as an iframe.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/edc-chatbot) at `/`
- **Backend**: Express 5 API server (artifacts/api-server) at `/api`
- **AI**: Anthropic claude-sonnet-4-6 via Replit AI Integrations (no user API key needed)
- **AI SDK lib**: @workspace/integrations-anthropic-ai
- **Database**: PostgreSQL + Drizzle ORM (provisioned but not yet used — Phase 1 is stateless)

## Key Routes

- `GET /api/healthz` — health check
- `POST /api/chat` — sends messages to Anthropic, returns AI reply

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/edc-chatbot run dev` — run frontend locally

## Architecture Notes

- The frontend (edc-chatbot) calls `/api/chat` — never Anthropic directly. The API key is server-side only.
- The system prompt (EDC knowledge base) lives in `artifacts/api-server/src/routes/chat/index.ts`.
- Messages are capped at the last 10 and user input is trimmed to 1000 chars per the Phase 1 spec.
- Phase 1 spec is in `attached_assets/phase1-replit-spec_1776945363836.md` — covers scraper, admin panel, lead capture, and more for future phases.

## Phase 1 Spec Status

Implemented:
- Core chatbot UI (from attached JSX, converted to TypeScript)
- API proxy to Anthropic with system prompt / knowledge base
- Suggested questions
- Loading animation

Not yet implemented (Phase 1 remaining):
- Contact/lead capture form
- Admin panel (API key setup, announcements, lead view)
- Daily content scraper (Tier 3 dynamic content)
- Rate limiting
- Output validation layer
- Session management (KV store)
- Source links on responses
- Suggested follow-up questions from AI
