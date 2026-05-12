import { useState, useRef, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Field,
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  Checkbox,
  Command,
  CommandInput,
  BarChartInteractive,
  LineChartInteractive,
  PieChartInteractive,
  KPIChart,
  TableChart,
} from '@assetpandallc/pioneer-design-system'
import type { ReportType } from '../App'
import {
  LayoutGrid,
  FilePenLine,
  PackageSearch,
  Bookmark,
  Calendar,
  Timer,
  Table2,
  BarChart3,
  BarChartHorizontal,
  LineChart,
  PieChart,
  Percent,
  GripVertical,
  Eye,
  EyeOff,
  ArrowLeft,
  Trash2,
  Type,
} from 'lucide-react'

// ── Filters ───────────────────────────────────────────────────────────────────

interface FilterRow {
  id: string
  field: string
  operator: string
  value: string
}

const filterOperators = [
  { value: 'is',                    label: 'Is' },
  { value: 'is_not',                label: 'Is not' },
  { value: 'contains',              label: 'Contains' },
  { value: 'does_not_contain',      label: 'Does not contain' },
  { value: 'same_as_log',           label: 'Same as log filter' },
  { value: 'same_as_collection',    label: 'Same as collection filter' },
]

// ── Configure: mock fields ─────────────────────────────────────────────────────

const mockFields = [
  { id: 'change-field',   label: 'Change field' },
  { id: 'changed-from',  label: 'Changed from' },
  { id: 'changed-to',    label: 'Changed to' },
  { id: 'datetime',      label: 'Date&time' },
  { id: 'changed-through', label: 'Changed through' },
  { id: 'offline-change',  label: 'Offline change' },
  { id: 'collection-1',  label: '[Collection field name]' },
  { id: 'collection-2',  label: '[Collection field name]' },
]

const defaultVisibility: Record<string, boolean> = Object.fromEntries(
  mockFields.map((f, i) => [f.id, i !== 1 && i !== 7])
)

const mockPreviewRows: Record<string, string>[] = [
  { 'change-field': 'Status',      'changed-from': 'Available',   'changed-to': 'Checked Out', 'datetime': 'Jan 15, 2024', 'changed-through': 'Web App',    'offline-change': 'No',  'collection-1': 'Dell XPS 15',     'collection-2': 'IT Dept'     },
  { 'change-field': 'Location',    'changed-from': 'New York',    'changed-to': 'Boston',      'datetime': 'Jan 14, 2024', 'changed-through': 'Mobile App', 'offline-change': 'Yes', 'collection-1': 'MacBook Pro',     'collection-2': 'Engineering' },
  { 'change-field': 'Department',  'changed-from': 'Engineering', 'changed-to': 'Marketing',   'datetime': 'Jan 13, 2024', 'changed-through': 'API',        'offline-change': 'No',  'collection-1': 'HP EliteBook',    'collection-2': 'Finance'     },
  { 'change-field': 'Assigned to', 'changed-from': 'John Smith',  'changed-to': 'Jane Doe',    'datetime': 'Jan 12, 2024', 'changed-through': 'Web App',    'offline-change': 'No',  'collection-1': 'Lenovo ThinkPad', 'collection-2': 'Marketing'   },
  { 'change-field': 'Serial No.',  'changed-from': 'SN-001234',   'changed-to': 'SN-005678',   'datetime': 'Jan 11, 2024', 'changed-through': 'Mobile App', 'offline-change': 'Yes', 'collection-1': 'Surface Pro',     'collection-2': 'Sales'       },
]

const mockTableRows = [
  { field: 'Laptops',       count: 145, sum: '$217,500', avg: '$1,500' },
  { field: 'Monitors',      count: 89,  sum: '$44,500',  avg: '$500'   },
  { field: 'Desks',         count: 52,  sum: '$31,200',  avg: '$600'   },
  { field: 'Office Chairs', count: 231, sum: '$57,750',  avg: '$250'   },
  { field: 'Printers',      count: 18,  sum: '$27,000',  avg: '$1,500' },
  { field: 'Projectors',    count: 11,  sum: '$33,000',  avg: '$3,000' },
  { field: 'Servers',       count: 7,   sum: '$210,000', avg: '$30,000'},
]

// ── Source types ──────────────────────────────────────────────────────────────

const sourceTypes = [
  { id: 'collection',    icon: <LayoutGrid size={16} />,    label: 'Collection',    description: 'Report on any asset collection',                fieldLabel: 'Collection' },
  { id: 'form',          icon: <FilePenLine size={16} />,   label: 'Form',          description: 'Report on form submissions',                    fieldLabel: 'Form' },
  { id: 'audit',         icon: <PackageSearch size={16} />, label: 'Audit',         description: 'Report on audit activity',                      fieldLabel: 'Audit' },
  { id: 'saved-view',    icon: <Bookmark size={16} />,      label: 'Saved view',    description: 'Report on saved views',                         fieldLabel: 'Saved view' },
  { id: 'reservations',  icon: <Calendar size={16} />,      label: 'Reservations',  description: 'Start from an existing saved view',             fieldLabel: 'Reservation' },
  { id: 'change-report', icon: <Timer size={16} />,         label: 'Change report', description: 'View asset log information change over time',   fieldLabel: 'Change report' },
]

// ── Report types ──────────────────────────────────────────────────────────────

const reportTypes = [
  { id: 'table',          icon: <Table2 size={16} className="text-white" />,           iconBg: '#6366f1', label: 'Table',           description: 'Add description. Best used for Checkout lists, Audit records, Asset registers, Status tracking' },
  { id: 'bar',            icon: <BarChart3 size={16} className="text-white" />,         iconBg: '#d946ef', label: 'Bar chart',       description: 'Comparing categories. Asset by status, by location or by department. The base for "Show me counts across x" question.' },
  { id: 'horizontal-bar', icon: <BarChartHorizontal size={16} className="text-white" />,iconBg: '#8b5cf6', label: 'Horizontal bar',  description: 'Use for many categories with long labels. For example 10+ locations, 15+ departments. Labels stay readable on the Y axis.' },
  { id: 'line',           icon: <LineChart size={16} className="text-white" />,         iconBg: '#84cc16', label: 'Line chart',      description: 'Tracking over time. Checkout trends, depreciation curves, maintenance frequency, audit completion over months.' },
  { id: 'donut',          icon: <PieChart size={16} className="text-white" />,          iconBg: '#f97316', label: 'Donut',           description: 'Share of a field as a whole in one snapshot. Track percentages of your fleet that is available vs checked out or damaged.' },
  { id: 'kpi',            icon: <Percent size={16} className="text-white" />,           iconBg: '#6366f1', label: 'KPI / Single core', description: 'Summary of numbers for every report. The base for everything a stakeholder sees in a scheduled email. Overdue counts, audit % or total values.' },
]

// ── Sortable field row ────────────────────────────────────────────────────────

function SortableFieldRow({
  field,
  visible,
  onToggle,
  isLast,
}: {
  field: { id: string; label: string }
  visible: boolean
  onToggle: () => void
  isLast: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`flex items-center gap-2 px-3 h-11 bg-card hover:bg-accent transition-colors ${!isLast ? 'border-b border-border' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground shrink-0 touch-none"
      >
        <GripVertical size={14} />
      </button>
      <div className={`flex items-center justify-center w-5 h-5 rounded shrink-0 ${visible ? 'bg-background-green' : 'bg-muted'}`}>
        <Type size={12} className={visible ? 'text-foreground' : 'text-muted-foreground'} />
      </div>
      <span className={`flex-1 text-[13px] truncate ${visible ? 'text-foreground' : 'text-muted-foreground'}`}>{field.label}</span>
      <button onClick={onToggle} className="shrink-0 hover:opacity-70 transition-opacity">
        {visible ? <Eye size={14} className="text-tertiary" /> : <EyeOff size={14} className="text-muted-foreground" />}
      </button>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CreateReportModalProps {
  open: boolean
  onClose: () => void
  onAdd: (report: { name: string; reportType: ReportType; type: string; source: string }) => void
}

export function CreateReportModal({ open, onClose, onAdd }: CreateReportModalProps) {
  const [activeTab, setActiveTab] = useState('source')
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<ReportType | null>(null)
  const [reportName, setReportName] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [nameError, setNameError] = useState('')
  const [accountError, setAccountError] = useState('')
  const [moduleError, setModuleError] = useState('')
  const [sourceError, setSourceError] = useState('')
  const [sourceFieldError, setSourceFieldError] = useState('')
  const [sourceFieldValue, setSourceFieldValue] = useState<string | null>(null)
  const [typeError, setTypeError] = useState('')
  const sourceFieldRef = useRef<HTMLDivElement>(null)

  const scrollPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedSource) {
      setTimeout(() => {
        const el = scrollPanelRef.current
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      }, 50)
    }
  }, [selectedSource])

  // Filters step state
  const [filterRows, setFilterRows] = useState<FilterRow[]>([{ id: '1', field: '', operator: '', value: '' }])

  function addFilter() {
    setFilterRows(prev => [...prev, { id: Date.now().toString(), field: '', operator: '', value: '' }])
  }
  function removeFilter(id: string) {
    setFilterRows(prev => prev.filter(r => r.id !== id))
  }
  function clearFilters() {
    setFilterRows([])
  }
  function updateFilter(id: string, key: keyof FilterRow, val: string) {
    setFilterRows(prev => prev.map(r => r.id === id ? { ...r, [key]: val } : r))
  }

  // Configure step state
  const [changeField, setChangeField] = useState<string | null>(null)
  const [sortByField, setSortByField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState('descending')
  const [showOfflineChanges, setShowOfflineChanges] = useState(false)
  const [fieldSearch, setFieldSearch] = useState('')
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>(defaultVisibility)
  const [fields, setFields] = useState(mockFields)
  // Line chart
  const [xAxisField, setXAxisField] = useState<string | null>(null)
  const [yAxisField, setYAxisField] = useState<string | null>(null)
  const [aggregation, setAggregation] = useState('count')
  // Donut
  const [groupByField, setGroupByField] = useState<string | null>(null)
  // KPI
  const [metricField, setMetricField] = useState<string | null>(null)
  const [kpiLabel, setKpiLabel] = useState('')
  const [kpiTrend, setKpiTrend] = useState('up')

  function handleClose() {
    setActiveTab('source')
    setSelectedSource(null)
    setSelectedType(null)
    setReportName('')
    setSelectedAccount(null)
    setSelectedModule(null)
    setNameError('')
    setAccountError('')
    setModuleError('')
    setSourceError('')
    setSourceFieldError('')
    setSourceFieldValue(null)
    setTypeError('')
    setFilterRows([{ id: '1', field: '', operator: '', value: '' }])
    setChangeField(null)
    setSortByField(null)
    setSortDirection('descending')
    setShowOfflineChanges(false)
    setFieldSearch('')
    setFieldVisibility(defaultVisibility)
    setFields(mockFields)
    setXAxisField(null)
    setYAxisField(null)
    setAggregation('count')
    setGroupByField(null)
    setMetricField(null)
    setKpiLabel('')
    setKpiTrend('up')
    onClose()
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const canProceed = reportName.trim() !== '' && selectedAccount !== null && selectedModule !== null && selectedSource !== null && sourceFieldValue !== null && selectedType !== null

  function handleNextFromSource() {
    const hasName = reportName.trim() !== ''
    const hasAccount = selectedAccount !== null
    const hasModule = selectedModule !== null
    const hasSource = selectedSource !== null
    const hasSourceField = sourceFieldValue !== null
    const hasType = selectedType !== null
    if (!hasName) setNameError('Report name is required.')
    if (!hasAccount) setAccountError('Please select an account.')
    if (!hasModule) setModuleError('Please select a module.')
    if (!hasSource) setSourceError('Please select a data source.')
    if (hasSource && !hasSourceField) setSourceFieldError('This field is required.')
    if (!hasType) setTypeError('Please select a report type.')
    if (hasName && hasAccount && hasModule && hasSource && hasSourceField && hasType) setActiveTab('configure')
  }

  function toggleFieldVisibility(id: string) {
    setFieldVisibility(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleAllVisibility() {
    const allVisible = fields.every(f => fieldVisibility[f.id])
    setFieldVisibility(Object.fromEntries(fields.map(f => [f.id, !allVisible])))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFields(items => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const filteredFields = fields.filter(f =>
    f.label.toLowerCase().includes(fieldSearch.toLowerCase())
  )

  const allVisible = fields.every(f => fieldVisibility[f.id])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="w-[80vw] max-w-[1336px] h-[80vh]"
        onInteractOutside={() => {}}
        onEscapeKeyDown={() => handleClose()}
      >
        {/* Header — DS auto-adds the X close button */}
        <DialogHeader bordered>
          <DialogTitle>Create report</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <DialogBody className="p-0 flex min-h-0">
          {/* Left panel */}
          <div className={`flex flex-col min-w-0 min-h-0 ${activeTab === 'filters' ? 'w-full' : 'w-1/2 border-r border-border'}`}>

            {/* Sticky tabs */}
            <div className="shrink-0 px-6 pt-4 pb-2 bg-card">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  {[
                    { value: 'source',    label: 'Source',    step: 1 },
                    { value: 'configure', label: 'Configure', step: 2 },
                    ...(selectedType === 'table' ? [{ value: 'table', label: 'Table', step: 3 }] : []),
                    { value: 'filters',   label: 'Filters',   step: selectedType === 'table' ? 4 : 3 },
                  ].map(({ value, label, step }) => {
                    const disabled = value !== 'source' && !canProceed
                    return (
                      <TabsTrigger key={value} value={value} disabled={disabled} className={disabled ? 'opacity-40 cursor-not-allowed' : ''}>
                        {label}
                        <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold leading-none ml-1">
                          {step}
                        </span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>
            </div>

            {/* Scrollable content */}
            <div ref={scrollPanelRef} className="flex-1 flex flex-col gap-4 px-6 pt-4 pb-4 overflow-y-auto hover-scrollbar-y min-h-0">

            {activeTab === 'source' && <>
              {/* Form fields */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-6">
                  <Label htmlFor="report-name" className="text-sm font-bold w-[130px] shrink-0 pt-2">Report name</Label>
                  <div className="flex-1 flex flex-col gap-1">
                    <Field id="report-name" label={false} placeholder="" value={reportName} onChange={(e) => { setReportName(e.target.value); if (nameError) setNameError('') }} />
                    {nameError && <p className="text-[12px] text-destructive">{nameError}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0 pt-2">Account</Label>
                  <div className="flex-1 flex flex-col gap-1">
                    <Select value={selectedAccount ?? ''} onValueChange={(v) => { setSelectedAccount(v); if (accountError) setAccountError('') }}>
                      <SelectTrigger className={`w-full ${accountError ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="account1">Account 1</SelectItem>
                        <SelectItem value="account2">Account 2</SelectItem>
                      </SelectContent>
                    </Select>
                    {accountError && <p className="text-[12px] text-destructive">{accountError}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0 pt-2">Module</Label>
                  <div className="flex-1 flex flex-col gap-1">
                    <Select disabled={!selectedAccount} value={selectedModule ?? ''} onValueChange={(v) => { setSelectedModule(v); if (moduleError) setModuleError('') }}>
                      <SelectTrigger className={`w-full ${moduleError ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="module1">Module 1</SelectItem>
                        <SelectItem value="module2">Module 2</SelectItem>
                      </SelectContent>
                    </Select>
                    {moduleError && <p className="text-[12px] text-destructive">{moduleError}</p>}
                  </div>
                </div>
              </div>

              {/* Data source heading */}
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-bold text-foreground">Data source</p>
                <p className="text-[12px] text-muted-foreground">Where should this report pull data from.</p>
                {sourceError && <p className="text-[12px] text-destructive">{sourceError}</p>}
              </div>

              {/* Source type cards */}
              <div className="flex flex-col gap-2">
                {sourceTypes.map((src) => (
                  <button
                    key={src.id}
                    onClick={() => {
                      setSelectedSource(src.id)
                      setSourceFieldValue(null)
                      if (sourceError) setSourceError('')
                      if (sourceFieldError) setSourceFieldError('')
                      if (src.id === 'change-report') {
                        setSelectedType('table')
                        if (typeError) setTypeError('')
                      } else if (selectedSource === 'change-report') {
                        setSelectedType(null)
                      }
                    }}
                    className={`flex items-center gap-4 px-4 py-3 border text-left transition-colors ${
                      selectedSource === src.id
                        ? 'rounded-[14px] border-border bg-background-purple'
                        : 'rounded-[10px] border-border bg-card hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-center w-5 h-5 shrink-0 text-foreground">
                      {src.icon}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[14px] font-bold text-foreground">{src.label}</span>
                      <span className="text-[12px] text-muted-foreground">{src.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic source field */}
              {selectedSource && (() => {
                const src = sourceTypes.find(s => s.id === selectedSource)!
                return (
                  <div ref={sourceFieldRef} className="flex items-start gap-6">
                    <Label className="text-sm font-bold w-[130px] shrink-0 pt-2">{src.fieldLabel}</Label>
                    <div className="flex-1 flex flex-col gap-1">
                      <Select value={sourceFieldValue ?? ''} onValueChange={(v) => { setSourceFieldValue(v); if (sourceFieldError) setSourceFieldError('') }}>
                        <SelectTrigger className={`w-full ${sourceFieldError ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent className="[&>div:first-child]:hidden">
                          <SelectItem value="option1">{src.fieldLabel} 1</SelectItem>
                          <SelectItem value="option2">{src.fieldLabel} 2</SelectItem>
                        </SelectContent>
                      </Select>
                      {sourceFieldError && <p className="text-[12px] text-destructive">{sourceFieldError}</p>}
                    </div>
                  </div>
                )
              })()}
            </>}

            {activeTab === 'configure' && <>

              {/* ── Bar / Horizontal bar ──────────────────────────────── */}
              {(selectedType === 'bar' || selectedType === 'horizontal-bar') && <>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Change field</Label>
                  <div className="flex-1">
                    <Select value={changeField ?? ''} onValueChange={setChangeField}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Sort by</Label>
                  <div className="flex-1 flex gap-2">
                    <Select value={sortByField ?? ''} onValueChange={setSortByField}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={setSortDirection}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="descending">Descending</SelectItem>
                        <SelectItem value="ascending">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOfflineChanges(v => !v)}
                  className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors w-full ${showOfflineChanges ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                >
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-foreground">Show offline changes</span>
                    <span className="text-[12px] text-muted-foreground leading-4">Date&amp;time of offline change is different from the date&amp;time it was logged in the system when the user went online.</span>
                  </div>
                  <Checkbox checked={showOfflineChanges} onCheckedChange={(v) => setShowOfflineChanges(v === true)} onClick={(e) => e.stopPropagation()} />
                </button>
              </>}

              {/* ── Table ─────────────────────────────────────────────── */}
              {selectedType === 'table' && <>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Sort by</Label>
                  <div className="flex-1 flex gap-2">
                    <Select value={sortByField ?? ''} onValueChange={setSortByField}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={setSortDirection}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="descending">Descending</SelectItem>
                        <SelectItem value="ascending">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOfflineChanges(v => !v)}
                  className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors w-full ${showOfflineChanges ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                >
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-foreground">Show offline changes</span>
                    <span className="text-[12px] text-muted-foreground leading-4">Date&amp;time of offline change is different from the date&amp;time it was logged in the system when the user went online.</span>
                  </div>
                  <Checkbox checked={showOfflineChanges} onCheckedChange={(v) => setShowOfflineChanges(v === true)} onClick={(e) => e.stopPropagation()} />
                </button>
              </>}

              {/* ── Line chart ────────────────────────────────────────── */}
              {selectedType === 'line' && <>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">X axis</Label>
                  <div className="flex-1">
                    <Select value={xAxisField ?? ''} onValueChange={setXAxisField}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Y axis</Label>
                  <div className="flex-1">
                    <Select value={yAxisField ?? ''} onValueChange={setYAxisField}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Aggregation</Label>
                  <div className="flex-1">
                    <Select value={aggregation} onValueChange={setAggregation}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Sort by</Label>
                  <div className="flex-1 flex gap-2">
                    <Select value={sortByField ?? ''} onValueChange={setSortByField}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={setSortDirection}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="descending">Descending</SelectItem>
                        <SelectItem value="ascending">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>}

              {/* ── Donut ─────────────────────────────────────────────── */}
              {selectedType === 'donut' && <>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Group by</Label>
                  <div className="flex-1">
                    <Select value={groupByField ?? ''} onValueChange={setGroupByField}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Sort by</Label>
                  <div className="flex-1 flex gap-2">
                    <Select value={sortByField ?? ''} onValueChange={setSortByField}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={setSortDirection}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="descending">Descending</SelectItem>
                        <SelectItem value="ascending">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>}

              {/* ── KPI ───────────────────────────────────────────────── */}
              {selectedType === 'kpi' && <>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Metric</Label>
                  <div className="flex-1">
                    <Select value={metricField ?? ''} onValueChange={setMetricField}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="" /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label htmlFor="kpi-label" className="text-sm font-bold w-[130px] shrink-0">Label</Label>
                  <div className="flex-1">
                    <Field id="kpi-label" label={false} placeholder="" value={kpiLabel} onChange={(e) => setKpiLabel(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-bold w-[130px] shrink-0">Trend</Label>
                  <div className="flex-1">
                    <Select value={kpiTrend} onValueChange={setKpiTrend}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        <SelectItem value="up">Trending up</SelectItem>
                        <SelectItem value="down">Trending down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>}

            </>}

            {activeTab === 'table' && <>
              <div className="border border-border rounded-md overflow-hidden">
                <Command shouldFilter={false} className="h-auto">
                  <CommandInput
                    placeholder="Search"
                    value={fieldSearch}
                    onValueChange={setFieldSearch}
                  />
                </Command>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted">
                  <span className="flex-1 text-[13px] font-bold text-foreground">Fields</span>
                  <button onClick={toggleAllVisibility} className="text-tertiary hover:opacity-70 transition-opacity">
                    {allVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    {filteredFields.map((field, index) => (
                      <SortableFieldRow
                        key={field.id}
                        field={field}
                        visible={fieldVisibility[field.id]}
                        onToggle={() => toggleFieldVisibility(field.id)}
                        isLast={index === filteredFields.length - 1}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </>}

            {activeTab === 'filters' && <>
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-3 pb-2 border-b border-border">
                <span className="text-[13px] font-bold text-foreground">Field name</span>
                <span className="text-[13px] font-bold text-foreground">Operator</span>
                <span className="text-[13px] font-bold text-foreground">Value</span>
                <span />
              </div>

              {/* Filter rows */}
              <div className="flex flex-col gap-3">
                {filterRows.map((row) => (
                  <div key={row.id} className={`grid gap-3 items-center ${filterRows.length > 1 ? 'grid-cols-[1fr_1fr_1fr_32px]' : 'grid-cols-3'}`}>
                    <Select value={row.field} onValueChange={(v) => updateFilter(row.id, 'field', v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {mockFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={row.operator} onValueChange={(v) => updateFilter(row.id, 'operator', v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent className="[&>div:first-child]:hidden">
                        {filterOperators.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <input
                      className="h-10 rounded-md border border-border bg-input px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 w-full"
                      placeholder=""
                      value={row.value}
                      onChange={(e) => updateFilter(row.id, 'value', e.target.value)}
                    />
                    {filterRows.length > 1 && (
                      <button
                        onClick={() => removeFilter(row.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={addFilter}>Add filter</Button>
                {filterRows.length > 1 && (
                  <Button variant="destructive" onClick={clearFilters}>Clear all</Button>
                )}
              </div>
            </>}

            </div>
          </div>

          {/* Right panel */}
          <div className={`w-1/2 flex flex-col gap-3 py-4 pl-6 pr-6 overflow-y-auto hover-scrollbar-y ${activeTab === 'filters' ? 'hidden' : ''}`}>
            {activeTab === 'source' && <>
              {typeError && <p className="text-[12px] text-destructive -mb-1">{typeError}</p>}
              {reportTypes.map((rt) => {
                const isDisabled = selectedSource === 'change-report' && rt.id !== 'table'
                return (
              <button
                key={rt.id}
                disabled={isDisabled}
                onClick={() => { if (!isDisabled) { setSelectedType(rt.id as ReportType); if (typeError) setTypeError('') } }}
                className={`flex items-center gap-4 px-4 py-3 rounded-[14px] border border-border text-left transition-colors ${
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed bg-card'
                    : selectedType === rt.id
                    ? 'bg-background-purple'
                    : 'bg-card hover:bg-accent'
                }`}
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                  style={{ backgroundColor: rt.iconBg }}
                >
                  {rt.icon}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-caption-bold text-foreground">{rt.label}</span>
                  <span className="text-[14px] text-muted-foreground leading-5">{rt.description}</span>
                </div>
              </button>
              )
            })}</>}

            {activeTab === 'table' && (() => {
              const visibleFields = fields.filter(f => fieldVisibility[f.id])
              return (
                <div className="flex flex-col gap-3 min-w-0">
                  <p className="text-[12px] text-muted-foreground">Preview updates as you toggle and reorder fields.</p>
                  {visibleFields.length === 0 ? (
                    <div className="flex items-center justify-center rounded-md border border-border py-12 text-[13px] text-muted-foreground">
                      No fields selected. Enable at least one field to see a preview.
                    </div>
                  ) : (
                    <div className="overflow-x-auto hover-scrollbar rounded-md border border-border">
                      <table className="w-full text-[13px] border-collapse">
                        <thead>
                          <tr className="bg-muted border-b border-border">
                            {visibleFields.map(f => (
                              <th key={f.id} className="text-left font-semibold text-foreground px-3 py-2 whitespace-nowrap">{f.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mockPreviewRows.map((row, i) => (
                            <tr key={i} className={i < mockPreviewRows.length - 1 ? 'border-b border-border' : ''}>
                              {visibleFields.map(f => (
                                <td key={f.id} className="px-3 py-2 text-foreground whitespace-nowrap">{row[f.id] ?? '—'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })()}

            {activeTab === 'configure' && (
              <div className="flex flex-col gap-3 min-w-0">
                <p className="text-[12px] text-muted-foreground">This is a preview based on x number of records from your data source.</p>
                <div className="overflow-x-auto hover-scrollbar">
                  {selectedType === 'bar' && (
                    <BarChartInteractive type="vertical" title="Chart title" subtitle="Showing total visitors for the last 6 months" showLegend={false} showXAxis={true} showYAxis={false} />
                  )}
                  {selectedType === 'horizontal-bar' && (
                    <BarChartInteractive type="horizontal" title="Chart title" subtitle="Showing total visitors for the last 6 months" showLegend={false} showXAxis={false} showYAxis={true} />
                  )}
                  {selectedType === 'table' && (
                    <TableChart type="sum" title="Asset inventory" subtitle="Showing asset counts and values by category" rows={mockTableRows} />
                  )}
                  {selectedType === 'line' && (
                    <LineChartInteractive type="interactive" title="Chart title" subtitle="Showing trend over time" showLegend={false} showXAxis={true} showYAxis={false} />
                  )}
                  {selectedType === 'donut' && (
                    <PieChartInteractive type="donut" title="Chart title" subtitle="Distribution by field" showLegend={true} />
                  )}
                  {selectedType === 'kpi' && (
                    <KPIChart
                      type={kpiTrend as 'up' | 'down'}
                      title={kpiLabel || 'KPI title'}
                      subtitle="Compared to last period"
                      value="1,284"
                      trend="+5.2%"
                      footerLabel="Total records"
                      showChart={false}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogBody>

        {/* Footer */}
        <DialogFooter bordered>
          {(activeTab === 'configure' || activeTab === 'table' || activeTab === 'filters') && (
            <Button variant="outline" className="mr-auto" onClick={() => {
              if (activeTab === 'configure') setActiveTab('source')
              else if (activeTab === 'table') setActiveTab('configure')
              else if (activeTab === 'filters') setActiveTab(selectedType === 'table' ? 'table' : 'configure')
            }}>
              <ArrowLeft size={16} />
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          {activeTab === 'source' && (
            <Button variant="default" onClick={handleNextFromSource}>Next</Button>
          )}
          {(activeTab === 'configure' || activeTab === 'table' || activeTab === 'filters') && (
            <Button variant="default" onClick={() => {
              const src = sourceTypes.find(s => s.id === selectedSource)
              onAdd({
                name: reportName.trim(),
                reportType: selectedType ?? 'table',
                type: src?.label ?? '',
                source: `{${selectedAccount ?? 'Account'}}/{${selectedModule ?? 'Module'}}/{${src?.fieldLabel ?? 'Collection'}}`,
              })
              handleClose()
            }}>Create</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
