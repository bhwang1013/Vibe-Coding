"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  LayoutDashboard,
  LineChart,
  Map,
  Menu,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { plan } from "@/lib/finance";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Level Roadmap", icon: Map },
  { href: "/income", label: "Income Engine", icon: TrendingUp },
  { href: "/expenses", label: "Expense Engine", icon: Wallet },
  { href: "/simulator", label: "Scenario Simulator", icon: SlidersHorizontal },
  { href: "/risk", label: "Risk Analysis", icon: ShieldAlert },
  { href: "/net-worth", label: "Net Worth Tracker", icon: LineChart },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
              active
                ? "text-white"
                : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
            }`}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <Icon
              size={17}
              className={`relative z-10 ${active ? "text-emerald-400" : "group-hover:text-zinc-300"}`}
            />
            <span className="relative z-10 font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 px-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/30 bg-gradient-to-br from-gold-500/20 to-transparent shadow-glow-gold">
        <Crown size={18} className="text-gold-400" />
      </span>
      <span>
        <span className="block font-display text-[15px] font-semibold tracking-tight text-white">
          {plan.profile.appName}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          {plan.profile.ownerLabel}
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-8 border-r border-white/[0.06] bg-charcoal/70 px-4 py-7 backdrop-blur-2xl lg:flex">
        <Brand />
        <NavLinks />
        <div className="mt-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="label-caps mb-1.5">System Status</p>
          <p className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            All engines operational
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-charcoal/80 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="h-full w-64 border-r border-white/[0.06] bg-charcoal px-4 pb-6 pt-20"
              onClick={(event) => event.stopPropagation()}
            >
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1 px-4 pb-16 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
