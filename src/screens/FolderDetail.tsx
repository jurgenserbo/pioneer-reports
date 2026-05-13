import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '../components/EmptyState'
import { MoveToFolderModal } from '../components/MoveToFolderModal'
import { CreateReportModal } from '../components/CreateReportModal'
import type { FolderItem } from '../App'
import {
  Button,
  BadgeStatus,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Checkbox,
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
  CalendarClock,
  Pencil,
  Share,
  CirclePlus,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Percent,
  BarChartHorizontal,
  EllipsisVertical,
  Copy,
  Trash2,
  FolderInput,
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


// ── Component ────────────────────────────────────────────────────────────────

interface OpenReportArgs { name: string; reportType: ReportType; source: string }

export function FolderDetail({ onBack, onNavigateToReports, source = 'folders', initialReports = [], folders = [], folderId = '', folderName = '', folderDescription = '', onEditFolder, onOpenReport, onEditReport, onDuplicateReport, onDeleteReport, onMoveToFolder, onAddReport }: {
  onBack: () => void
  onNavigateToReports: () => void
  source?: 'reports' | 'folders'
  initialReports?: Report[]
  folders?: FolderItem[]
  folderId?: string
  folderName?: string
  folderDescription?: string
  onEditFolder?: (id: string, name: string, description: string) => void
  onOpenReport: (r: OpenReportArgs) => void
  onEditReport: (id: string, name: string) => void
  onDuplicateReport: (id: string) => void
  onDeleteReport: (id: string) => void
  onMoveToFolder?: (reportId: string, folderId: string) => void
  onAddReport?: (r: { name: string; reportType: ReportType; type: string; source: string; folderId?: string }) => void
}) {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [addReportOpen, setAddReportOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [moveToFolderOpen, setMoveToFolderOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [editName, setEditName] = useState('')
  const [editNameError, setEditNameError] = useState('')
  const [deletingReport, setDeletingReport] = useState<Report | null>(null)

  // Folder edit state
  const [localFolderName, setLocalFolderName] = useState(folderName)
  const [localFolderDescription, setLocalFolderDescription] = useState(folderDescription)
  const [editFolderOpen, setEditFolderOpen] = useState(false)
  const [editFolderName, setEditFolderName] = useState('')
  const [editFolderDescription, setEditFolderDescription] = useState('')
  const [editFolderError, setEditFolderError] = useState('')

  function handleEditFolderOpen() {
    setEditFolderName(localFolderName)
    setEditFolderDescription(localFolderDescription)
    setEditFolderError('')
    setEditFolderOpen(true)
  }

  function handleEditFolderClose() {
    setEditFolderOpen(false)
    setEditFolderName('')
    setEditFolderDescription('')
    setEditFolderError('')
  }

  function handleEditFolderSave() {
    const trimmedName = editFolderName.trim()
    if (!trimmedName) { setEditFolderError('Folder name is required.'); return }
    const isDuplicate = folders.some(
      f => f.id !== folderId && f.name.trim().toLowerCase() === trimmedName.toLowerCase()
    )
    if (isDuplicate) { setEditFolderError('A folder with this name already exists.'); return }
    setLocalFolderName(trimmedName)
    setLocalFolderDescription(editFolderDescription.trim())
    onEditFolder?.(folderId, trimmedName, editFolderDescription.trim())
    toast.success('Folder updated successfully')
    handleEditFolderClose()
  }

  const allSelected = selectedRows.size === reports.length && reports.length > 0
  const someSelected = selectedRows.size > 0 && !allSelected

  function toggleRow(id: string) {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelectedRows(allSelected ? new Set() : new Set(reports.map(r => r.id)))
  }

  function handleBulkDuplicate() {
    const now = new Date()
    const formatted = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
      + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const toDuplicate = reports.filter(r => selectedRows.has(r.id))
    const duplicates = toDuplicate.map((report, i) => ({
      ...report,
      id: String(Date.now() + i),
      name: `Copy of ${report.name}`,
      createdAt: formatted,
      lastUpdated: formatted,
    }))
    toDuplicate.forEach(r => onDuplicateReport(r.id))
    setReports(prev => [...duplicates, ...prev])
    const count = toDuplicate.length
    setSelectedRows(new Set())
    toast.success(`${count} report${count > 1 ? 's' : ''} duplicated successfully`)
  }

  function handleBulkDelete() {
    const ids = Array.from(selectedRows)
    ids.forEach(id => onDeleteReport(id))
    setReports(prev => prev.filter(r => !selectedRows.has(r.id)))
    const count = ids.length
    setSelectedRows(new Set())
    toast.success(`${count} report${count > 1 ? 's' : ''} deleted successfully`)
  }

  function handleEditOpen(report: Report) {
    setEditingReport(report)
    setEditName(report.name)
    setEditNameError('')
  }

  function handleEditClose() {
    setEditingReport(null)
    setEditName('')
    setEditNameError('')
  }

  function handleEditSave() {
    const trimmed = editName.trim()
    if (!trimmed) { setEditNameError('Report name is required.'); return }
    if (!editingReport) return
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
        defaultActiveSection="reports"
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
              {source === 'folders' && (
                <>
                  <span className="text-[12px] font-medium text-muted-foreground">/</span>
                  <button onClick={onBack} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">Folders</button>
                </>
              )}
              <span className="text-[12px] font-medium text-muted-foreground">/</span>
              <span className="text-[12px] font-medium text-primary">{localFolderName}</span>
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
        <div className="flex-1 mx-6 my-4 rounded-lg border border-border bg-card overflow-hidden flex flex-col">

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
                <h1 className="text-[18px] font-bold text-foreground leading-7">{localFolderName}</h1>
                {localFolderDescription && (
                  <p className="text-[14px] text-muted-foreground leading-5">{localFolderDescription}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon"><ListFilter size={16} /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon"><ArrowUpNarrowWide size={16} /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Sort</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon"><Share size={16} /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" onClick={handleEditFolderOpen}><Pencil size={16} />Edit</Button>
              <Button variant="default" onClick={() => setAddReportOpen(true)}><CirclePlus size={16} />Add report</Button>
            </div>
          </div>


          <div className="border-t border-border shrink-0" />

          {/* Reports count / bulk actions bar */}
          {(reports.length > 0 || selectedRows.size > 0) && <div className="flex items-center px-6 h-14 shrink-0">
            {selectedRows.size > 0 ? (
              <>
                <span className="flex-1 text-[14px] font-medium text-foreground">
                  Selected {selectedRows.size} record{selectedRows.size > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="link" size="sm" onClick={() => setSelectedRows(new Set(reports.map(r => r.id)))}>Select all</Button>
                  <Button variant="link" size="sm" onClick={() => setSelectedRows(new Set())}>Deselect all</Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDuplicate}>
                    <Copy size={14} />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setMoveToFolderOpen(true)}>
                    <FolderInput size={14} />
                    Move to folder
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </>
            ) : (
              <span className="text-[14px] font-medium text-foreground">{reports.length} Reports</span>
            )}
          </div>}

          {/* Table */}
          <div className="flex-1 overflow-auto hover-scrollbar-y">
            {reports.length === 0 ? (
              <EmptyState
                icon={<BarChart3 size={24} />}
                title="No reports in this folder"
                description="Add a report to this folder to start organizing your data."
              />
            ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <th className="h-10 px-2 align-middle border-b border-border bg-muted sticky top-0 z-10 w-10 shrink-0">
                    <div className="flex items-center h-full">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                        onCheckedChange={toggleAll}
                      />
                    </div>
                  </th>
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
                {reports.map((report) => {
                  const config = reportTypeConfig[report.reportType]
                  return (
                    <TableRow
                      key={report.id}
                      className={`cursor-pointer hover:bg-accent transition-colors ${selectedRows.has(report.id) ? 'bg-primary/5' : ''}`}
                      onClick={() => onOpenReport({ name: report.name, reportType: report.reportType, source: report.source })}
                    >
                      <td className="h-14 px-2 align-middle border-b border-border" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center h-full">
                          <Checkbox
                            checked={selectedRows.has(report.id)}
                            onCheckedChange={() => toggleRow(report.id)}
                          />
                        </div>
                      </td>
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
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedRows(new Set([report.id])); setMoveToFolderOpen(true) }}>
                              <FolderInput size={14} />
                              Move to folder
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
            )}
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
                onChange={(e) => { setEditName(e.target.value); if (editNameError) setEditNameError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave() }}
                autoFocus
              />
              {editNameError && <p className="text-[12px] text-destructive">{editNameError}</p>}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditClose}>Cancel</Button>
            <Button variant="default" onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit folder modal */}
      <Dialog open={editFolderOpen} onOpenChange={(v) => { if (!v) handleEditFolderClose() }}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>Edit folder</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-folder-name">Folder name</Label>
                <Input
                  id="edit-folder-name"
                  value={editFolderName}
                  onChange={(e) => { setEditFolderName(e.target.value); if (editFolderError) setEditFolderError('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleEditFolderSave() }}
                  autoFocus
                />
                {editFolderError && <p className="text-[12px] text-destructive">{editFolderError}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-folder-description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  id="edit-folder-description"
                  value={editFolderDescription}
                  onChange={(e) => setEditFolderDescription(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleEditFolderSave() }}
                  placeholder="Add a description..."
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditFolderClose}>Cancel</Button>
            <Button variant="default" onClick={handleEditFolderSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to folder modal */}
      <MoveToFolderModal
        open={moveToFolderOpen}
        onClose={() => setMoveToFolderOpen(false)}
        folders={folders}
        onConfirm={(targetFolderId, folderName) => {
          const movedIds = new Set(selectedRows)
          movedIds.forEach(id => onMoveToFolder?.(id, targetFolderId))
          setReports(prev => prev.filter(r => !movedIds.has(r.id)))
          const count = movedIds.size
          setSelectedRows(new Set())
          setMoveToFolderOpen(false)
          toast.success(`${count} report${count > 1 ? 's' : ''} moved to "${folderName}"`)
        }}
      />

      {/* Add report modal */}
      <CreateReportModal
        open={addReportOpen}
        onClose={() => setAddReportOpen(false)}
        onAdd={(r) => {
          const now = new Date()
          const formatted = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
            + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          const newReport: Report = {
            id: String(Date.now()),
            name: r.name,
            reportType: r.reportType,
            type: r.type,
            source: r.source,
            createdAt: formatted,
            lastUpdated: formatted,
            createdBy: 'John Smith',
          }
          setReports(prev => [newReport, ...prev])
          onAddReport?.({ ...r, folderId: folderId })
          setAddReportOpen(false)
        }}
      />

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
