import { useState } from 'react'
import { CreateReportModal } from '../components/CreateReportModal'
import { CreateFolderModal } from '../components/CreateFolderModal'
import { EmptyState } from '../components/EmptyState'
import {
  Button,
  BadgeStatus,
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
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { toast } from 'sonner'
import {
  ListFilter,
  ArrowUpNarrowWide,
  FolderPlus,
  CirclePlus,
  Folder,
  EllipsisVertical,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Percent,
  BarChartHorizontal,
  ChevronDown,
  Search,
  PanelLeft,
  Copy,
  FolderInput,
  Trash2,
  Pencil,
  Share2,
  CalendarClock,
} from 'lucide-react'

import type { FolderItem, Report, ReportType } from '../App'

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

export function Reports({ folders, reports, onAddFolder, onEditFolder, onDeleteFolder, onAddReport, onEditReport, onDuplicateReport, onDeleteReport, onViewAllFolders, onOpenFolder, onOpenReport }: {
  folders: FolderItem[]
  reports: Report[]
  onAddFolder: (name: string) => void
  onEditFolder: (id: string, name: string) => void
  onDeleteFolder: (id: string) => void
  onAddReport: (r: Omit<Report, 'id' | 'createdAt' | 'lastUpdated' | 'createdBy' | 'owner'>) => void
  onEditReport: (id: string, name: string) => void
  onDuplicateReport: (id: string) => void
  onDeleteReport: (id: string) => void
  onViewAllFolders?: () => void
  onOpenFolder?: () => void
  onOpenReport?: (r: OpenReportArgs) => void
}) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('all')
  const [addReportOpen, setAddReportOpen] = useState(false)
  const [addFolderOpen, setAddFolderOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState('')
  const [deletingFolder, setDeletingFolder] = useState<FolderItem | null>(null)

  function handleEditOpen(folder: FolderItem) {
    setEditingFolder(folder)
    setEditName(folder.name)
    setEditError('')
  }

  function handleEditClose() {
    setEditingFolder(null)
    setEditName('')
    setEditError('')
  }

  function handleEditSave() {
    const trimmed = editName.trim()
    if (!trimmed || !editingFolder) return
    const isDuplicate = folders.some(
      f => f.id !== editingFolder.id && f.name.trim().toLowerCase() === trimmed.toLowerCase()
    )
    if (isDuplicate) { setEditError('A folder with this name already exists.'); return }
    onEditFolder(editingFolder.id, trimmed)
    toast.success('Folder updated successfully')
    handleEditClose()
  }

  function handleDeleteConfirm() {
    if (!deletingFolder) return
    onDeleteFolder(deletingFolder.id)
    toast.success('Folder deleted successfully')
    setDeletingFolder(null)
  }

  // ── Report actions ──────────────────────────────────────────────────────────
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [editReportName, setEditReportName] = useState('')
  const [deletingReport, setDeletingReport] = useState<Report | null>(null)

  function handleEditReportOpen(report: Report) {
    setEditingReport(report)
    setEditReportName(report.name)
  }

  function handleEditReportClose() {
    setEditingReport(null)
    setEditReportName('')
  }

  function handleEditReportSave() {
    const trimmed = editReportName.trim()
    if (!trimmed || !editingReport) return
    onEditReport(editingReport.id, trimmed)
    toast.success('Report updated successfully')
    handleEditReportClose()
  }

  function handleDeleteReportConfirm() {
    if (!deletingReport) return
    onDeleteReport(deletingReport.id)
    toast.success('Report deleted successfully')
    setDeletingReport(null)
  }

  const filteredReports = activeTab === 'all' ? reports : reports.filter(r => r.owner === activeTab)

  const allSelected = selectedRows.size === filteredReports.length && filteredReports.length > 0
  const someSelected = selectedRows.size > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredReports.map(r => r.id)))
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selectedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedRows(next)
  }

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
            <div className="flex items-center bg-white rounded-lg shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(80,68,225,0.06)] px-2 py-1 h-8">
              <span className="text-[12px] font-medium text-primary">Reports</span>
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
        <div className="flex-1 mx-6 my-4 rounded-lg border border-border bg-card overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-6 shrink-0">
            <div className="flex flex-1 flex-col gap-1">
              <h1 className="text-[18px] font-bold text-foreground leading-7">Reports</h1>
              <p className="text-[14px] text-muted-foreground leading-5">Build, run, and schedule reports across your asset data.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ListFilter size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpNarrowWide size={16} />
              </Button>
              <Button variant="outline" onClick={() => setAddFolderOpen(true)}>
                <FolderPlus size={16} />
                Add folder
              </Button>
              <Button variant="default" onClick={() => setAddReportOpen(true)}>
                <CirclePlus size={16} />
                Add report
              </Button>
              <CreateFolderModal open={addFolderOpen} onClose={() => setAddFolderOpen(false)} onAdd={onAddFolder} folders={folders} />
              <CreateReportModal open={addReportOpen} onClose={() => setAddReportOpen(false)} onAdd={onAddReport} />
            </div>
          </div>

          {reports.length === 0 && folders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<BarChart3 size={24} />}
                title="No reports yet"
                description="Create your first report to start tracking and visualizing your data."
                action={{ label: 'Add report', onClick: () => setAddReportOpen(true) }}
              />
            </div>
          ) : (<>

          {/* Folders count row — only when folders exist */}
          {folders.length > 0 && (
            <div className="flex items-center gap-3 px-6 h-14 shrink-0">
              <span className="flex-1 text-[14px] font-medium text-foreground">{folders.length} folders</span>
              <Button variant="link" size="sm" onClick={onViewAllFolders}>View all</Button>
            </div>
          )}

          {/* Folder cards */}
          <div className="shrink-0 h-[142px] hover-scrollbar">
            {folders.length === 0 ? (
              <EmptyState
                icon={<Folder size={24} />}
                title="No folders yet"
                description="Create a folder to organize your reports."
                action={{ label: 'Add folder', onClick: () => setAddFolderOpen(true) }}
              />
            ) : (
            <div className="flex px-6 py-2 h-full items-center w-max">
              {folders.map((folder, i) => (
                  <div
                    key={folder.id}
                    onClick={onOpenFolder}
                    className={`shrink-0 w-[340px] h-[126px] bg-card border border-border rounded-2xl flex flex-col px-4 py-3.5 gap-4 cursor-pointer hover:border-primary/40 transition-colors ${i < folders.length - 1 ? 'mr-4' : ''}`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-background-blue shrink-0">
                          <Folder size={20} className="text-tertiary" />
                        </div>
                        <span className="text-[14px] font-medium text-muted-foreground truncate">{folder.count} Reports</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="shrink-0 p-1 rounded hover:bg-accent transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EllipsisVertical size={16} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditOpen(folder) }}>
                            <Pencil size={14} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Share2 size={14} />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => { e.stopPropagation(); setDeletingFolder(folder) }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/* Bottom row */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[16px] font-bold text-foreground leading-6 truncate">{folder.name}</p>
                      <p className="text-[12px] text-muted-foreground leading-4 truncate">{folder.description}</p>
                    </div>
                  </div>
                ))}
            </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-border shrink-0 px-6 pt-6">
            <TabsPrimitive.Root value={activeTab} onValueChange={setActiveTab}>
              <TabsPrimitive.List className="flex h-9 items-end gap-4">
                {([
                  { value: 'all', label: 'All reports' },
                  { value: 'mine', label: 'My reports' },
                  { value: 'shared', label: 'Shared with me' },
                ] as const).map(({ value, label }) => (
                  <TabsPrimitive.Trigger
                    key={value}
                    value={value}
                    className="h-9 border-b-2 border-transparent pb-2 text-sm font-medium text-muted-foreground transition-colors mb-[-1px] focus:outline-none data-[state=active]:border-foreground data-[state=active]:text-foreground"
                  >
                    {label}
                  </TabsPrimitive.Trigger>
                ))}
              </TabsPrimitive.List>
            </TabsPrimitive.Root>
          </div>

          {/* Reports count row / Bulk actions bar */}
          <div className="flex items-center px-6 h-14 shrink-0">
            {selectedRows.size > 0 ? (
              <>
                <span className="flex-1 text-[14px] font-medium text-foreground">
                  Selected {selectedRows.size} record(s)
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="link" size="sm" onClick={() => setSelectedRows(new Set(filteredReports.map(r => r.id)))}>
                    Select all
                  </Button>
                  <Button variant="link" size="sm" onClick={() => setSelectedRows(new Set())}>
                    Deselect all
                  </Button>
                  <Button variant="outline" size="sm">
                    Duplicate <Copy size={14} />
                  </Button>
                  <Button variant="outline" size="sm">
                    Move to folder <FolderInput size={14} />
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete <Trash2 size={14} />
                  </Button>
                </div>
              </>
            ) : (
              <span className="text-[14px] font-medium text-foreground">{filteredReports.length} {filteredReports.length === 1 ? 'Report' : 'Reports'}</span>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto hover-scrollbar-y">
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
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-0">
                      {reports.length === 0 ? (
                        <EmptyState
                          icon={<BarChart3 size={24} />}
                          title="No reports yet"
                          description="Create your first report to start tracking and visualizing your data."
                          action={{ label: 'Add report', onClick: () => setAddReportOpen(true) }}
                        />
                      ) : (
                        <EmptyState
                          icon={<Search size={24} />}
                          title="No reports found"
                          description="There are no reports under this tab. Try switching to a different filter."
                        />
                      )}
                    </td>
                  </tr>
                )}
                {filteredReports.map((report) => {
                  const config = reportTypeConfig[report.reportType]
                  return (
                    <TableRow
                      key={report.id}
                      className={`cursor-pointer hover:bg-accent transition-colors ${selectedRows.has(report.id) ? 'bg-primary/5' : ''}`}
                      onClick={() => onOpenReport?.({ name: report.name, reportType: report.reportType, source: report.source })}
                    >
                      <td className="h-14 px-2 align-middle border-b border-border">
                        <div className="flex items-center h-full">
                          <Checkbox
                            checked={selectedRows.has(report.id)}
                            onCheckedChange={() => toggleRow(report.id)}
                          />
                        </div>
                      </td>
                      <TableCell type="Text">{report.name}</TableCell>
                      <TableCell type="Text">
                        <BadgeStatus type={config.type} leftIcon={config.icon}>
                          {config.label}
                        </BadgeStatus>
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
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditReportOpen(report) }}>
                              <Pencil size={14} />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicateReport(report.id); toast.success('Report duplicated successfully') }}>
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
          </>)}

        </div>
      </div>

      {/* Edit folder modal */}
      <Dialog open={!!editingFolder} onOpenChange={(v) => { if (!v) handleEditClose() }}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>Edit folder</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-folder-name">Folder name</Label>
              <Input
                id="edit-folder-name"
                value={editName}
                onChange={(e) => { setEditName(e.target.value); if (editError) setEditError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave() }}
                autoFocus
              />
              {editError && <p className="text-[12px] text-destructive">{editError}</p>}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditClose}>Cancel</Button>
            <Button variant="default" disabled={!editName.trim()} onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete folder confirmation modal */}
      <Dialog open={!!deletingFolder} onOpenChange={(v) => { if (!v) setDeletingFolder(null) }}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>Delete folder</DialogTitle></DialogHeader>
          <DialogBody>
            <p className="text-[14px] text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deletingFolder?.name}"</span>? This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingFolder(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit report modal */}
      <Dialog open={!!editingReport} onOpenChange={(v) => { if (!v) handleEditReportClose() }}>
        <DialogContent className="w-[400px]">
          <DialogHeader><DialogTitle>Edit report</DialogTitle></DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-report-name">Report name</Label>
              <Input
                id="edit-report-name"
                value={editReportName}
                onChange={(e) => setEditReportName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEditReportSave() }}
                autoFocus
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditReportClose}>Cancel</Button>
            <Button variant="default" disabled={!editReportName.trim()} onClick={handleEditReportSave}>Save</Button>
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
            <Button variant="destructive" onClick={handleDeleteReportConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
