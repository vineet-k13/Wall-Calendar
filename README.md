Wall Calendar Component
A pixel-faithful React/Next.js recreation of a wall calendar UI — with spiral binding, photo area, blue chevron accents, month navigation, and a notes section.

Design Decisions
Typography — Barlow Condensed
Chosen for its narrow proportions and high weight range, which closely match the bold-yet-compact month labels and the light grid numerals in the reference. Avoids generic sans-serifs.
Blue Chevron via inline SVG
The diagonal shapes at the photo/body boundary are rendered as a <svg> overlay with preserveAspectRatio="none" — this keeps them perfectly flush at every width without any CSS clip-path hacks.
Mon-first grid with dynamic offset
getFirstDayOfWeek() converts JS's Sunday-first Date.getDay() to Monday-first by shifting with (day + 6) % 7. This ensures the grid is always correct regardless of month or year.
Weekend & today highlighting
Columns 5 and 6 (SAT/SUN) are styled blue to match the reference. Today's date gets a filled circle using an inline-flex <span> — no extra libraries needed.
No external dependencies
Pure React state (useState) for month/year navigation. No date libraries (dayjs, date-fns) — the three native Date calls needed are small enough to inline.

Getting Started
Prerequisites

Node.js 18+
A Next.js 13+ project (App Router)

Installation
bash
# 1. Clone or copy the component into your project
cp WallCalendar.jsx your-project/app/components/

# 2. Install dependencies (if starting fresh)
npx create-next-app@latest my-calendar --app --tailwind --eslint
cd my-calendar

# 3. Running Locally
bashnpm install
npm run dev
Open http://localhost:3000 in your browser.

Usage

jsx// app/page.jsx

import WallCalendar from "./components/WallCalendar";

export default function Page() {
  return <WallCalendar />;
}
The component is self-contained — no props required. It initialises to the current month automatically.

# License
MIT
