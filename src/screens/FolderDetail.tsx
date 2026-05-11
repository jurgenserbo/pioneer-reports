import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '../components/EmptyState'
import {
  Button,
  BadgeStatus,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  GlobalNav,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Label,
  Input,
} from '@assetpandallc/pioneer-design-system'
import {
  ListFilter,
  ArrowUpNarrowWide,
  ArrowLeft,
  ChevronDown,
  Search,
  PanelLeft,
  Share2,
  Download,
  CalendarClock,
  Pencil,
  Play,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Percent,
  BarChartHorizontal,
  EllipsisVertical,
  Copy,
  Trash2,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type ReportType = 'bar' | 'line' | 'donut' | 'table' | 'kpi' | 'horizontal-bar'

interface Report {
  id: string
  name: string
  reportType: ReportType
  type: string
  source: string
  createdAt: string
  lastUpdated: string
  createdBy: string
}

// ── Report type config ───────────────────────────────────────────────────────

const reportTypeConfig: Record<ReportType, { label: string; type: 'blue' | 'green' | 'orange' | 'neutral' | 'red' | 'purple'; icon: React.ReactNode }> = {
  'bar':            { label: 'Bar chart',            type: 'blue',    icon: <BarChart3 size={12} /> },
  'line':           { label: 'Line chart',           type: 'green',   icon: <LineChart size={12} /> },
  'donut':          { label: 'Donut chart',          type: 'orange',  icon: <PieChart size={12} /> },
  'table':          { label: 'Table',                type: 'neutral', icon: <Table2 size={12} /> },
  'kpi':            { label: 'KPI',                  type: 'red',     icon: <Percent size={12} /> },
  'horizontal-bar': { label: 'Horizontal bar chart', type: 'purple',  icon: <BarChartHorizontal size={12} /> },
}

// ── Info cards ───────────────────────────────────────────────────────────────

const infoCards = [
  {
    id: 'share',
    title: 'Share with users',
    description: 'Share this folder and its reports with specific users or teams.',
    icon: <Share2 size={16} className="text-tertiary" />,
    buttonIcon: <Share2 size={14} />,
    buttonLabel: 'Share',
  },
  {
    id: 'export',
    title: 'Export report',
    description: 'Download reports in CSV, PDF, or Excel format for external use.',
    icon: <Download size={16} className="text-tertiary" />,
    buttonIcon: <Download size={14} />,
    buttonLabel: 'Export',
  },
  {
    id: 'schedule',
    title: 'Report schedules',
    description: 'Automate report delivery on a recurring schedule via email.',
    icon: <CalendarClock size={16} className="text-tertiary" />,
    buttonIcon: <CalendarClock size={14} />,
    buttonLabel: 'Schedule',
  },
]

// ── Component ────────────────────────────────────────────────────────────────

interface OpenReportArgs { name: string; reportType: ReportType; source: string }

export function FolderDetail({ onBack, onNavigateToReports, onOpenReport, onEditReport, onDuplicateReport, onDeleteReport }: {
  onBack: () => void
  onNavigateToReports: () => void
  onOpenReport: (r: OpenReportArgs) => void
  onEditReport: (id: string, name: string) => void
  onDuplicateReport: (id: string) => void
  onDeleteReport: (id: string) => void
}) {
  const [reports, setReports] = useState<Report[]>([])
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingReport, setDeletingReport] = useState<Report | null>(null)

  function handleEditOpen(report: Report) {
    setEditingReport(report)
    setEditName(report.name)
  }

  function handleEditClose() {
    setEditingReport(null)
    setEditName('')
  }

  function handleEditSave() {
    const trimmed = editName.trim()
    if (!trimmed || !editingReport) return
    setReports(prev => prev.map(r => r.id === editingReport.id ? { ...r, name: trimmed } : r))
    onEditReport(editingReport.id, trimmed)
    toast.success('Report updated successfully')
    handleEditClose()
  }

  function handleDuplicate(report: Report) {
    const now = new Date()
    const formatted = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
      + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setReports(prev => [
      { ...report, id: String(Date.now()), name: `Copy of ${report.name}`, createdAt: formatted, lastUpdated: formatted },
      ...prev,
    ])
    onDuplicateReport(report.id)
    toast.success('Report duplicated successfully')
  }

  function handleDeleteConfirm() {
    if (!deletingReport) return
    setReports(prev => prev.filter(r => r.id !== deletingReport.id))
    onDeleteReport(deletingReport.id)
    toast.success('Report deleted successfully')
    setDeletingReport(null)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <GlobalNav
        onToggleAI={() => {}}
        aiOpen={false}
        userName="John Smith"
        userEmail="john@assetpanda.com"
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top Nav */}
        <div className="h-[56px] flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-9 h-8 bg-white rounded-lg shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(80,68,225,0.06)]">
              <PanelLeft size={16} className="text-foreground" />
            </button>
            <div className="flex items-center bg-white rounded-lg shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(80,68,225,0.06)] px-2 py-1 h-8 gap-1">
              <button onClick={onNavigateToReports} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</button>
              <span className="text-[12px] font-medium text-muted-foreground">/</span>
              <button onClick={onBack} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">Folders</button>
              <span className="text-[12px] font-medium text-muted-foreground">/</span>
              <span className="text-[12px] font-medium text-primary">Monthly sales overview</span>
            </div>
          </div>
          <div className="flex-1" />
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
          <div className="flex items-center gap-2 px-6 py-6 shrink-0">
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1 w-fit text-[14px] font-medium text-tertiary hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-bold text-foreground leading-7">Monthly sales overview</h1>
                <p className="text-[14px] text-muted-foreground leading-5">{'{Account}/{Module}/{Collection}'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="icon"><ListFilter size={16} /></Button>
              <Button variant="outline" size="icon"><ArrowUpNarrowWide size={16} /></Button>
              <Button variant="outline"><Pencil size={16} />Edit</Button>
              <Button variant="default"><Play size={16} />Re-run</Button>
            </div>
          </div>

          {/* Info cards row */}
          <div className="px-6 pb-6 shrink-0">
            <div className="grid grid-cols-3 gap-4">
              {infoCards.map((card) => (
                <div key={card.id} className="flex items-center gap-4 border border-border rounded-2xl px-4 py-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-background-blue shrink-0">
                    {card.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground leading-5">{card.title}</p>
                    <p className="text-[12px] text-muted-foreground leading-4 truncate">{card.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    {card.buttonIcon}
                    {card.buttonLabel}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Reports count row */}
          <div className="flex items-center px-6 h-10 shrink-0">
            <span className="text-[14px] font-medium text-foreground">{reports.length} Reports</span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto hover-scrollbar-y">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 z-10 bg-muted">Name</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-muted">Report type</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-muted">Type</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-muted">Source</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-muted">Created at</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-muted">Last updated at</TableHead>
                  <TableHead className="sticky top-0 z-10 bg-muted">Created by</TableHead>
                  <TableHead showText={false} className="sticky top-0 z-10 bg-muted" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <EmptyState
                        icon={<BarChart3 size={24} />}
                        title="No reports in this folder"
                        description="Add a report to this folder to start organizing your data."
                      />
                    </td>
                  </tr>
                )}
                {reports.map((report) => {
                  const config = reportTypeConfig[report.reportType]
                  return (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => onOpenReport({ name: report.name, reportType: report.reportType, source: report.source })}
                    >
                      <TableCell type="Text">{report.name}</TableCell>
                      <TableCell type="Text">
                        <BadgeStatus type={config.type} leftIcon={config.icon}>{config.label}</BadgeStatus>
                      </TableCell>
                      <TableCell type="Text">{report.type}</TableCell>
                      <TableCell type="Text">{report.source}</TableCell>
                      <TableCell type="Text">{report.createdAt}</TableCell>
                      <TableCell type="Text">{report.lastUpdated}</TableCell>
                      <TableCell type="Text">{report.createdBy}</TableCell>
                      <td className="h-14 px-2 align-middle border-b border-border w-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="flex items-center justify-center w-8 h-8 rounded hover:bg-accent transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EllipsisVertical size={16} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditOpen(report) }}>
                              <Pencil size={14} />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(report) }}>
                              <Copy size={14} />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Schedule feature coming soon') }}>
                              <CalendarClock size={14} />
                              Add schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => { e.stopPropagation(); setDeletingReport(report) }}
                            >
                              <Trash2 size={14} />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

        </div>
      </div>

      {/* Edit report modal */}
      <Dialog open={!!editingReport} onOpenChange={(v) => { if (!v) handleEditClose() }}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>Edit report</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-report-name">Report name</Label>
              <Input
                id="edit-report-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave() }}
                autoFocus
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditClose}>Cancel</Button>
            <Button variant="default" disabled={!editName.trim()} onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete report confirmation modal */}
      <Dialog open={!!deletingReport} onOpenChange={(v) => { if (!v) setDeletingReport(null) }}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>Delete report</DialogTitle></DialogHeader>
          <DialogBody>
            <p className="text-[14px] text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deletingReport?.name}"</span>? This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingReport(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
