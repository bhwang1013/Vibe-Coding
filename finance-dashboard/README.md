# Apex Wealth OS — Premium Personal Finance Dashboard

A dark-luxury, data-driven wealth terminal that renders an entire Level 0 → Level 6
wealth-building roadmap from a single JSON configuration file.

Built with **Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Recharts · Lucide**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Command center — KPI cards, income mix, trajectory, next-level objective |
| `/roadmap` | Expandable cards for all seven levels |
| `/income` | Income engine — category mix, stream bars, stacked growth, detail table |
| `/expenses` | Expense engine — tag donut, ranked line items, monthly/annual toggle |
| `/simulator` | Scenario simulator — six live levers, wealth timelines, 10-yr projection |
| `/risk` | Risk analysis — radar, five scored vectors, all-level heat map |
| `/net-worth` | Milestone timeline $100K → $10M with ETAs and 12-yr projection |
| `/levels/[id]` | Full brief for each level (statically generated) |

## Architecture

- **`src/data/plan.json`** — the single source of truth. Levels, income sources
  (gross × efficiency × retention × count), shared expense profiles, milestones,
  and the user profile. Edit this file and every page re-renders automatically.
- **`src/lib/types.ts`** — TypeScript contracts for the plan data.
- **`src/lib/finance.ts`** — pure calculation layer: net income, expense rollups,
  savings rate, compounding projections, time-to-target, and risk scoring.
- **`src/lib/format.ts`** — currency/percent/duration formatting.
- **`src/components`** — `layout` (shell + nav), `ui` (glass cards, KPI cards,
  animated numbers, progress bars, level switcher), `charts` (Recharts wrappers
  with a shared theme), `roadmap`, `levels`.

## Updating the plan

Everything is data-driven. To change income, expenses, levels, or milestones,
edit `src/data/plan.json` — no component changes required. To update your live
position, edit `profile.currentLevelId`, `profile.currentNetWorth`, and
`profile.currentEmergencyFund`.
