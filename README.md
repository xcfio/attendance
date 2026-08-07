# Student Attendance Management System

A fast, modern, and lightweight student attendance tracking and export application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **TanStack Table**. Designed specifically for streamlined classroom attendance taking, custom student inclusion, and one-click data export.

---

## Features

- **Student Roll & Name Directory**: Pre-configured student roster with instant search, sorting, and row selection using TanStack Table.
- **Dynamic Extra Students**: Easily add irregular or guest students on the fly by roll number and optional name.
- **Integrated Date & Subject Selector**: Date picker integrated with native [Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) and subject catalog auto-filtered by semester.
- **One-Click Export**:
    - **Copy to Clipboard**: Formats attendance header (Date, Subject, Department, Semester) and present student rolls for instant messaging or pasting.
    - **Save to Text File (`.txt`)**: Download formatted attendance records with auto-generated filenames.
- **Toast Feedback**: Interactive toast notifications for user actions via `Sonner`.
- **Modern Responsive UI**: Built with Radix UI primitives, Lucide icons, customizable themes (`next-themes`), and clean Tailwind CSS v4 styling.
- **High Performance & Tooling**: Uses `oxlint` for fast linting, `prettier` for code formatting, and `lefthook` git hooks.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Components**: [React 19](https://react.dev/), [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Table**: [@tanstack/react-table](https://tanstack.com/table/v8)
- **Date Handling**: Native [Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) or [temporal-polyfill](https://github.com/fullcalendar/temporal-polyfill)
- **Icons & Toasts**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.si/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linter & Formatter**: [oxlint](https://oxc.rs/), [Prettier](https://prettier.io/)

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v26+ required for [Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility) support) and [pnpm](https://pnpm.io/) installed. This project enforces `pnpm` as the package manager.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/xcfio/attendance.git
    cd attendance
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and set the target semester:

    ```bash
    cp .env.example .env
    ```

    In `.env`:

    ```env
    NEXT_PUBLIC_SEMESTER="4"
    ```

### Running Locally

Start the development server (runs by default on port `7700`):

```bash
node --run dev
```

Open [http://localhost:7700](http://localhost:7700) in your browser to view the application.

---

## Available Scripts

| Script                | Command                                     | Description                               |
| --------------------- | ------------------------------------------- | ----------------------------------------- |
| `node --run dev`      | `next dev --port=7700`                      | Start the development server on port 7700 |
| `node --run build`    | `next build`                                | Build the optimized production bundle     |
| `node --run start`    | `next start`                                | Start the production server               |
| `node --run lint`     | `oxlint --config=oxlint.config.mts .`       | Run oxlint code checks                    |
| `node --run lint:fix` | `oxlint --config=oxlint.config.mts --fix .` | Automatically fix lint issues             |
| `node --run fmt`      | `prettier --config=.prettierrc --write .`   | Format all codebase files using Prettier  |
| `node --run fmt:test` | `prettier --config=.prettierrc --check src` | Check formatting of source files          |
| `node --run test`     | `tsc --noEmit`                              | Check TypeScript types across the project |

---

## Project Structure

```text
attendance/
├── src/
│   ├── app/                # Next.js App Router routes & pages
│   │   ├── (page)/         # Main attendance page components & hooks
│   │   │   ├── columns.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── page.tsx
│   │   │   ├── use-attendance-export.tsx
│   │   │   └── use-extra-students.tsx
│   │   ├── globals.css     # Global styles & Tailwind v4 configuration
│   │   └── layout.tsx      # Root layout & providers
│   ├── components/         # Shared UI components & Radix wrappers
│   ├── lib/                # Utility helper functions
│   └── text/               # Student roster & subject data configs
├── .env.example            # Environment variables template
├── lefthook.yml            # Git hooks setup
├── oxlint.config.mts       # Oxlint configuration
├── package.json            # Project manifest & dependencies
└── README.md               # Project documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## Links

| Resource    | URL                                        |
| ----------- | ------------------------------------------ |
| GitHub      | https://github.com/xcfio/attendance        |
| Bug reports | https://github.com/xcfio/attendance/issues |
| Help        | https://dsc.gg/xcfio                       |

---

Made with ❤️ by [xcfio](https://github.com/xcfio)

