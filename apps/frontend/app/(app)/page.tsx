import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { BetsSection } from '@/components/dashboard/bets-section';
import { ProjectRequestsSection } from '@/components/dashboard/project-requests-section';
import { ActiveTablesSection } from '@/components/dashboard/active-tables-section';

export default function DashboardPage() {
  // TODO: fetch real data from API
  // const bets = await fetchUserBets()
  // const tables = await fetchUserTables()
  // const requests = await fetchPendingProjectRequests()

  return (
    <div className="w-full">
      <DashboardGreeting upcomingHandsCount={0} activeTablesCount={0} />

      <StatsGrid
        activeProjectsCount={0}
        activeTablesCount={0}
        upcomingHandsCount={0}
        activeBetsCount={0}
      />

      {/* Project requests — only visible for sector leaders */}
      <ProjectRequestsSection requests={[]} />

      <BetsSection bets={[]} />

      <ActiveTablesSection tables={[]} />
    </div>
  );
}
