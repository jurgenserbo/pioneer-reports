import { useState } from 'react'
import { Reports } from './screens/Reports'
import { Folders } from './screens/Folders'
import { FolderDetail } from './screens/FolderDetail'
import { ReportDetail } from './screens/ReportDetail'

type Screen = 'reports' | 'folders' | 'folder-detail' | 'report-detail'

export type ReportType = 'bar' | 'line' | 'donut' | 'table' | 'kpi' | 'horizontal-bar'

export interface FolderItem {
  id: string
  name: string
  description: string
  count: number
}

export interface Report {
  id: string
  name: string
  reportType: ReportType
  type: string
  source: string
  createdAt: string
  lastUpdated: string
  createdBy: string
  owner: 'mine' | 'shared'
}

interface SelectedReport {
  name: string
  reportType: ReportType
  source: string
}

const initialReports: Report[] = [
  { id: '1',  name: 'Assets by Status',                           reportType: 'bar',            type: 'Depreciation',   source: '{Account}/{Module}/{Collection}',  createdAt: '01-03-2026 09:14 AM', lastUpdated: '04-28-2026 11:02 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '2',  name: 'Asset condition breakdown',                  reportType: 'line',           type: 'Saved views',    source: '{Account}/{Module}/{Collection}',  createdAt: '01-05-2026 10:30 AM', lastUpdated: '04-25-2026 03:45 PM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '3',  name: 'Total Asset Value',                          reportType: 'donut',          type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '01-08-2026 08:00 AM', lastUpdated: '04-20-2026 09:17 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '4',  name: 'Asset by location',                          reportType: 'table',          type: 'Form',           source: '{Account}/{Module}/{Form}',        createdAt: '01-12-2026 02:15 PM', lastUpdated: '04-18-2026 01:33 PM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '5',  name: 'Audit completion log',                       reportType: 'kpi',            type: 'Depreciation',   source: '{Account}/{Module}/{Collection}',  createdAt: '01-15-2026 11:45 AM', lastUpdated: '04-15-2026 10:50 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '6',  name: 'Depreciation overview',                      reportType: 'horizontal-bar', type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '01-20-2026 04:00 PM', lastUpdated: '04-12-2026 08:22 AM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '7',  name: 'Inspection submissions',                     reportType: 'table',          type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '02-01-2026 07:30 AM', lastUpdated: '04-10-2026 04:05 PM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '8',  name: 'Biannual customer satisfaction survey',      reportType: 'bar',            type: 'Depreciation',   source: '{Account}/{Module}/{Collection}',  createdAt: '02-05-2026 01:10 PM', lastUpdated: '04-08-2026 11:40 AM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '9',  name: 'Fleet utilization by department',            reportType: 'horizontal-bar', type: 'Collection',     source: '{Account}/Assets/{Fleet}',         createdAt: '02-10-2026 09:00 AM', lastUpdated: '04-07-2026 02:15 PM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '10', name: 'Monthly checkout trends',                    reportType: 'line',           type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '02-14-2026 03:20 PM', lastUpdated: '04-05-2026 09:30 AM', createdBy: 'Mike Johnson', owner: 'shared' },
  { id: '11', name: 'Overdue assets KPI',                         reportType: 'kpi',            type: 'Saved views',    source: '{Account}/{Module}/{Saved view}',  createdAt: '02-18-2026 10:45 AM', lastUpdated: '04-03-2026 03:55 PM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '12', name: 'Warranty expiry summary',                    reportType: 'table',          type: 'Collection',     source: '{Account}/Assets/{Warranty}',      createdAt: '02-22-2026 08:30 AM', lastUpdated: '04-01-2026 11:10 AM', createdBy: 'Sarah Lee',    owner: 'shared' },
  { id: '13', name: 'Asset value by category',                    reportType: 'donut',          type: 'Depreciation',   source: '{Account}/{Module}/{Collection}',  createdAt: '03-01-2026 01:00 PM', lastUpdated: '03-30-2026 08:45 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '14', name: 'Procurement spend this quarter',             reportType: 'bar',            type: 'Form',           source: '{Account}/Procurement/{Form}',     createdAt: '03-05-2026 11:20 AM', lastUpdated: '03-28-2026 04:30 PM', createdBy: 'Mike Johnson', owner: 'shared' },
  { id: '15', name: 'Maintenance cost per asset class',           reportType: 'horizontal-bar', type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '03-08-2026 09:50 AM', lastUpdated: '03-25-2026 10:00 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '16', name: 'IT asset lifecycle stages',                  reportType: 'line',           type: 'Change reports', source: '{Account}/IT/{Collection}',        createdAt: '03-12-2026 02:40 PM', lastUpdated: '03-22-2026 01:15 PM', createdBy: 'Sarah Lee',    owner: 'shared' },
  { id: '17', name: 'Energy usage by facility',                   reportType: 'bar',            type: 'Collection',     source: '{Account}/Facilities/{Meter}',     createdAt: '03-15-2026 07:00 AM', lastUpdated: '03-20-2026 09:05 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '18', name: 'Reservation utilization rate',               reportType: 'kpi',            type: 'Reservations',   source: '{Account}/{Module}/{Reservation}', createdAt: '03-18-2026 03:30 PM', lastUpdated: '03-18-2026 03:30 PM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '19', name: 'Field inspection pass rate',                 reportType: 'donut',          type: 'Audit',          source: '{Account}/Field/{Inspection}',     createdAt: '03-22-2026 10:10 AM', lastUpdated: '03-22-2026 10:10 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '20', name: 'Compliance status by region',                reportType: 'table',          type: 'Saved views',    source: '{Account}/Compliance/{Region}',    createdAt: '04-01-2026 08:15 AM', lastUpdated: '04-15-2026 02:00 PM', createdBy: 'Mike Johnson', owner: 'shared' },
  { id: '21', name: 'Capital expenditure vs budget',              reportType: 'bar',            type: 'Depreciation',   source: '{Account}/Finance/{CapEx}',        createdAt: '04-05-2026 11:00 AM', lastUpdated: '04-25-2026 09:45 AM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '22', name: 'Asset write-off history',                    reportType: 'table',          type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '04-08-2026 01:30 PM', lastUpdated: '04-28-2026 12:00 PM', createdBy: 'Sarah Lee',    owner: 'shared' },
]

const initialFolders: FolderItem[] = [
  { id: '1',  name: 'Traffic and engagement statistics', description: 'Overview of site performance metrics',           count: 23 },
  { id: '2',  name: 'Monthly sales overview',            description: 'Analysis of sales trends and forecasts',        count: 23 },
  { id: '3',  name: 'User satisfaction surveys',         description: 'Insights collected from customer feedback',     count: 23 },
  { id: '4',  name: 'New product rollout',               description: 'Details and timelines for upcoming launches',   count: 23 },
  { id: '5',  name: 'Asset depreciation schedule',       description: 'Yearly depreciation values by asset class',     count: 14 },
  { id: '6',  name: 'Inventory audit results',           description: 'Audit completion data across all locations',    count: 31 },
  { id: '7',  name: 'Maintenance cost summary',          description: 'Breakdown of repair and maintenance expenses',  count: 18 },
  { id: '8',  name: 'Procurement overview',              description: 'Purchases and vendor activity this quarter',    count: 9  },
  { id: '9',  name: 'Field inspection logs',             description: 'Submitted inspection reports from field teams', count: 42 },
  { id: '10', name: 'Compliance & certifications',       description: 'Status of regulatory compliance documents',     count: 7  },
  { id: '11', name: 'Fleet utilization report',          description: 'Vehicle usage and idle time analysis',          count: 16 },
  { id: '12', name: 'IT asset lifecycle',                description: 'Hardware refresh cycles and end-of-life dates', count: 28 },
  { id: '13', name: 'Real estate portfolio',             description: 'Property locations, leases, and valuations',   count: 11 },
  { id: '14', name: 'Energy consumption tracking',       description: 'Utility usage metrics across facilities',       count: 6  },
  { id: '15', name: 'Warranty claims tracking',          description: 'Open and resolved warranty claim records',      count: 19 },
  { id: '16', name: 'Disposal and write-offs',           description: 'Assets removed from service this period',      count: 5  },
  { id: '17', name: 'Capital expenditure plan',          description: 'Approved capex projects and spending status',   count: 22 },
  { id: '18', name: 'Asset transfer history',            description: 'Record of asset moves between departments',     count: 37 },
  { id: '19', name: 'Biannual performance review',       description: 'KPIs and metrics reviewed every six months',   count: 13 },
  { id: '20', name: 'New product rollout',               description: 'Details and timelines for upcoming launches',   count: 23 },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('reports')
  const [selectedReport, setSelectedReport] = useState<SelectedReport | null>(null)
  const [previousScreen, setPreviousScreen] = useState<Screen>('reports')
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [reports, setReports] = useState<Report[]>(initialReports)

  function addFolder(name: string) {
    setFolders(prev => [
      { id: String(Date.now()), name, description: '', count: 0 },
      ...prev,
    ])
  }

  function editFolder(id: string, name: string) {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f))
  }

  function deleteFolder(id: string) {
    setFolders(prev => prev.filter(f => f.id !== id))
  }

  function addReport(report: Omit<Report, 'id' | 'createdAt' | 'lastUpdated' | 'createdBy' | 'owner'>) {
    const now = new Date()
    const formatted = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
      + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setReports(prev => [
      { ...report, id: String(Date.now()), createdAt: formatted, lastUpdated: formatted, createdBy: 'John Smith', owner: 'mine' },
      ...prev,
    ])
  }

  function editReport(id: string, name: string) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, name } : r))
  }

  function duplicateReport(id: string) {
    const report = reports.find(r => r.id === id)
    if (!report) return
    const now = new Date()
    const formatted = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
      + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setReports(prev => [
      { ...report, id: String(Date.now()), name: `Copy of ${report.name}`, createdAt: formatted, lastUpdated: formatted, owner: 'mine' },
      ...prev,
    ])
  }

  function deleteReport(id: string) {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  function openReport(report: SelectedReport, from: Screen) {
    setSelectedReport(report)
    setPreviousScreen(from)
    setScreen('report-detail')
  }

  if (screen === 'report-detail' && selectedReport) {
    return (
      <ReportDetail
        name={selectedReport.name}
        reportType={selectedReport.reportType}
        source={selectedReport.source}
        onBack={() => setScreen(previousScreen)}
        onNavigateToReports={() => setScreen('reports')}
      />
    )
  }
  if (screen === 'folder-detail') {
    return (
      <FolderDetail
        onBack={() => setScreen('folders')}
        onNavigateToReports={() => setScreen('reports')}
        onOpenReport={(report) => openReport(report, 'folder-detail')}
        onEditReport={editReport}
        onDuplicateReport={duplicateReport}
        onDeleteReport={deleteReport}
      />
    )
  }
  if (screen === 'folders') {
    return (
      <Folders
        folders={folders}
        onAddFolder={addFolder}
        onEditFolder={editFolder}
        onDeleteFolder={deleteFolder}
        onAddReport={addReport}
        onBack={() => setScreen('reports')}
        onOpenFolder={() => setScreen('folder-detail')}
      />
    )
  }
  return (
    <Reports
      folders={folders}
      reports={reports}
      onAddFolder={addFolder}
      onEditFolder={editFolder}
      onDeleteFolder={deleteFolder}
      onAddReport={addReport}
      onEditReport={editReport}
      onDuplicateReport={duplicateReport}
      onDeleteReport={deleteReport}
      onOpenFolder={() => setScreen('folder-detail')}
      onOpenReport={(report) => openReport(report, 'reports')}
    />
  )
}
