import DashboardShell from "./DashboardShell";

// Dashboard pages read cookies (auth) — they stream via Suspense but can't
// be statically prerendered. instant = false opts the segment out of the
// Cache Components prerender pass so the build succeeds.
export const instant = false;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
