<div align="center">
  <h1>DiTz Qur'an Platform</h1>
  <p><strong>A modern full-stack Qur'an reading and learning experience.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-Full%20Stack-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Prisma-Data%20Layer-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Tailwind-Responsive%20UI-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## Overview

DiTz Qur'an Platform is a full-stack web application concept for reading, listening to, and exploring the Qur'an through a modern responsive interface.

The platform combines essential reading tools with user accounts, cloud-synced activity, Islamic utilities, and an AI-assisted question-and-answer foundation.

## Main Features

- Complete 30-juz Qur'an reader
- Audio tilawah support
- User registration and authentication
- Cloud bookmarks
- Reading history
- Tafsir endpoint integration
- Prayer-time information
- Qibla direction utility
- AI Qur'an Q&A foundation

## Technology Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,prisma,nodejs" alt="Technology stack" />
</div>

## Local Setup

```bash
git clone https://github.com/sunandarradit3-maker/ddd.git
cd ddd
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Review `.env.example` and provide the required database and service credentials before starting the application.

## Project Structure

```text
.
├── app/          # Next.js application routes and interface
├── components/   # Reusable interface components
├── lib/          # Shared application utilities
├── prisma/       # Database schema and data configuration
└── README.md     # Project documentation
```

## Recommended Repository Name

This repository should be renamed from `ddd` to:

```text
ditz-quran-platform
```

<div align="center">
  <sub>Built as part of the DiTz Store digital ecosystem.</sub>
</div>
