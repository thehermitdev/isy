import { Building2, Users, UserCheck, TrendingUp, FileText, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatCard } from '@/molecules/StatCard';
import { Header } from '@/organisms/Header';
import { useAccounts } from '@/hooks/useAccounts';
import { useContacts } from '@/hooks/useContacts';
import { useLeads } from '@/hooks/useLeads';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useQuotes } from '@/hooks/useQuotes';
import { useTickets } from '@/hooks/useSupport';
import { formatCurrency, formatDate } from '@/utils';
import { SkeletonCard } from '@/atoms/Spinner';

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Generate pipeline data from opportunity values for the NEXT 6 months
function buildRevenueData(opportunities: Array<{ value?: number; expectedClose?: string }>) {
  const months: Record<string, number> = {};
  const monthsList: string[] = [];
  const now = new Date();
  
  // Forecast: Current month + next 5 months
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const mLabel = d.toLocaleString('default', { month: 'short' });
    months[mLabel] = 0;
    monthsList.push(mLabel);
  }
  
  opportunities.forEach((op) => {
    if (op.expectedClose && op.value) {
      const d = new Date(op.expectedClose);
      const month = d.toLocaleString('default', { month: 'short' });
      if (month in months) {
        months[month] += op.value;
      }
    }
  });

  return monthsList.map((m) => ({ month: m, value: months[m] }));
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: contacts, isLoading: loadingContacts } = useContacts();
  const { data: leads, isLoading: loadingLeads } = useLeads();
  const { data: opportunities } = useOpportunities();
  const { data: quotes } = useQuotes();
  const { data: tickets } = useTickets();

  const totalRevenue = opportunities?.reduce((sum, o) => sum + (o.value ?? 0), 0) ?? 0;
  const openTickets = tickets?.filter((t) => t.status === 'open' || t.status === 'in_progress').length ?? 0;
  const revenueData = buildRevenueData(opportunities ?? []);

  const leadsByStatus = [
    { name: 'New', value: leads?.filter((l) => l.status === 'new').length ?? 0 },
    { name: 'Contacted', value: leads?.filter((l) => l.status === 'contacted').length ?? 0 },
    { name: 'Qualified', value: leads?.filter((l) => l.status === 'qualified').length ?? 0 },
    { name: 'Converted', value: leads?.filter((l) => l.status === 'converted').length ?? 0 },
    { name: 'Lost', value: leads?.filter((l) => l.status === 'lost').length ?? 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle={`Today is ${formatDate(new Date().toISOString(), 'EEEE, MMMM d, yyyy')}`}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {loadingAccounts ? (
            <SkeletonCard />
          ) : (
            <StatCard
              title="Accounts"
              value={accounts?.length ?? 0}
              icon={<Building2 className="w-full h-full" />}
              color="purple"
              className="col-span-1"
              onClick={() => navigate('/relationships?tab=accounts')}
            />
          )}
          {loadingContacts ? (
            <SkeletonCard />
          ) : (
            <StatCard
              title="Contacts"
              value={contacts?.length ?? 0}
              icon={<Users className="w-full h-full" />}
              color="cyan"
              onClick={() => navigate('/relationships?tab=contacts')}
            />
          )}
          {loadingLeads ? (
            <SkeletonCard />
          ) : (
            <StatCard
              title="Leads"
              value={leads?.length ?? 0}
              icon={<UserCheck className="w-full h-full" />}
              color="green"
              onClick={() => navigate('/relationships?tab=leads')}
            />
          )}
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(totalRevenue)}
            icon={<TrendingUp className="w-full h-full" />}
            color="yellow"
          />
          <StatCard
            title="Quotes"
            value={quotes?.length ?? 0}
            icon={<FileText className="w-full h-full" />}
            color="purple"
          />
          <StatCard
            title="Open Tickets"
            value={openTickets}
            icon={<Headphones className="w-full h-full" />}
            color={openTickets > 5 ? 'red' : 'green'}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue trend */}
          <div className="glass-card p-5 lg:col-span-2">
            <h3
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Pipeline Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    backdropFilter: 'blur(16px)',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Expected Revenue']}
                />
                <Bar
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leads by status / donut */}
          <div className="glass-card p-5">
            <h3
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Leads by Status
            </h3>
            {leadsByStatus.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={leadsByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      strokeWidth={0}
                    >
                      {leadsByStatus.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        backdropFilter: 'blur(16px)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {leadsByStatus.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-center py-12" style={{ color: 'var(--text-muted)' }}>
                No leads data yet
              </p>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass-card p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Recent Opportunities
          </h3>
          {opportunities && opportunities.length > 0 ? (
            <div className="space-y-2">
              {opportunities.slice(0, 5).map((op) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {op.name || `Opportunity #${op.id.slice(0, 8)}`}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Close: {formatDate(op.expectedClose)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: 'oklch(0.75 0.20 280)' }}>
                      {formatCurrency(op.value)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {op.probability ?? 0}% prob.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
              No opportunities yet — create one in the Pipeline tab
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
