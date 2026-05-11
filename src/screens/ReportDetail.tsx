import {
  Button,
  GlobalNav,
  BarChartInteractive,
  LineChartInteractive,
  PieChartInteractive,
  KPIChart,
  TableChart,
} from '@assetpandallc/pioneer-design-system'
import {
  ListFilter,
  ArrowUpNarrowWide,
  ArrowLeft,
  ChevronDown,
  Search,
  PanelLeft,
  Share2,
  FileInput,
  Bot,
  Pencil,
  Play,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type ReportType = 'bar' | 'line' | 'donut' | 'table' | 'kpi' | 'horizontal-bar'

interface ReportDetailProps {
  name: string
  reportType: ReportType
  source: string
  onBack: () => void
  onNavigateToReports: () => void
}

// ── Chart renderer ────────────────────────────────────────────────────────────

function ReportChart({ reportType, name, source }: { reportType: ReportType; name: string; source: string }) {
  const common = { title: name, subtitle: source, showLegend: true, showXAxis: true, showYAxis: true }
  switch (reportType) {
    case 'bar':
      return <BarChartInteractive type="vertical" {...common} />
    case 'horizontal-bar':
      return <BarChartInteractive type="horizontal" {...common} />
    case 'line':
      return <LineChartInteractive type="interactive" {...common} />
    case 'donut':
      return <PieChartInteractive type="donut" title={name} subtitle={source} showLegend />
    case 'kpi':
      return <KPIChart type="up" title={name} subtitle={source} />
    case 'table':
      return <TableChart type="count" title={name} subtitle={source} />
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function ReportDetail({ name, reportType, source, onBack, onNavigateToReports }: ReportDetailProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Global Navigation Sidebar */}
      <GlobalNav
        onToggleAI={() => {}}
        aiOpen={false}
        userName="John Smith"
        userEmail="john@assetpanda.com"
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top Nav */}
        <div className="h-[56px] flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2">
            {/* Collapse button */}
            <button className="flex items-center justify-center w-9 h-8 bg-white rounded-lg shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(80,68,225,0.06)]">
              <PanelLeft size={16} className="text-foreground" />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center bg-white rounded-lg shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(80,68,225,0.06)] px-2 py-1 h-8 gap-1">
              <button onClick={onNavigateToReports} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</button>
              <span className="text-[12px] font-medium text-muted-foreground">/</span>
              <button onClick={onBack} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">...</button>
              <span className="text-[12px] font-medium text-muted-foreground">/</span>
              <span className="text-[12px] font-medium text-primary max-w-[180px] truncate">{name}</span>
            </div>
          </div>
          <div className="flex-1" />
          {/* Search bar */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 bg-muted border border-border rounded-l-lg px-3 h-10 w-[146px]">
              <span className="text-[12px] text-foreground font-medium flex-1 truncate">Current page</span>
              <ChevronDown size={16} className="text-muted-foreground shrink-0" />
            </div>
            <div className="flex items-center gap-2 bg-muted border border-border border-l-0 rounded-r-lg px-3 h-10 w-[288px]">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <span className="text-[14px] text-muted-foreground">Search...</span>
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className="flex-1 mx-6 rounded-lg border border-border bg-card overflow-hidden flex flex-col mb-6">

          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-border shrink-0">
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              {/* Back button */}
              <button
                onClick={onBack}
                className="flex items-center gap-1 w-fit text-[14px] font-medium text-tertiary hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              {/* Title + subtitle inline */}
              <div className="flex items-baseline gap-2 min-w-0">
                <h1 className="text-[18px] font-bold text-foreground leading-7 shrink-0">{name}</h1>
                <span className="text-[14px] text-muted-foreground leading-5 truncate">{source}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="icon">
                <ListFilter size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpNarrowWide size={16} />
              </Button>
              <Button variant="outline">
                <Pencil size={16} />
                Edit
              </Button>
              <Button variant="default">
                <Play size={16} />
                Re-run
              </Button>
            </div>
          </div>

          {/* Info cards row */}
          <div className="px-6 py-6 border-b border-border shrink-0">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-foreground leading-6">Share with users</p>
                  <p className="text-[12px] text-muted-foreground leading-4">Create a schedule for your reports through automations</p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Share2 size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-foreground leading-6">Export report</p>
                  <p className="text-[12px] text-muted-foreground leading-4">Create a schedule for your reports through automations</p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <FileInput size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-foreground leading-6">Report schedules</p>
                  <p className="text-[12px] text-muted-foreground leading-4">Create a schedule for your reports through automations</p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Bot size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Chart area */}
          <div className="flex-1 p-6 overflow-auto hover-scrollbar-y">
            <div className="chart-full-width w-full">
              <ReportChart reportType={reportType} name={name} source={source} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
