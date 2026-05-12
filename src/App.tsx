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
  folderId?: string
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
  { id: '13', name: 'Asset value by category',                    reportType: 'donut',          type: 'Depreciation',   source: '{Account}/{Module}/{Collection}',  createdAt: '03-01-2026 01:00 PM', lastUpdated: '03-30-2026 08:45 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '1' },
  { id: '14', name: 'Procurement spend this quarter',             reportType: 'bar',            type: 'Form',           source: '{Account}/Procurement/{Form}',     createdAt: '03-05-2026 11:20 AM', lastUpdated: '03-28-2026 04:30 PM', createdBy: 'Mike Johnson', owner: 'shared', folderId: '1' },
  { id: '15', name: 'Maintenance cost per asset class',           reportType: 'horizontal-bar', type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '03-08-2026 09:50 AM', lastUpdated: '03-25-2026 10:00 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '1' },
  { id: '16', name: 'IT asset lifecycle stages',                  reportType: 'line',           type: 'Change reports', source: '{Account}/IT/{Collection}',        createdAt: '03-12-2026 02:40 PM', lastUpdated: '03-22-2026 01:15 PM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '2' },
  { id: '17', name: 'Energy usage by facility',                   reportType: 'bar',            type: 'Collection',     source: '{Account}/Facilities/{Meter}',     createdAt: '03-15-2026 07:00 AM', lastUpdated: '03-20-2026 09:05 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '2' },
  { id: '18', name: 'Reservation utilization rate',               reportType: 'kpi',            type: 'Reservations',   source: '{Account}/{Module}/{Reservation}', createdAt: '03-18-2026 03:30 PM', lastUpdated: '03-18-2026 03:30 PM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '3' },
  { id: '19', name: 'Field inspection pass rate',                 reportType: 'donut',          type: 'Audit',          source: '{Account}/Field/{Inspection}',     createdAt: '03-22-2026 10:10 AM', lastUpdated: '03-22-2026 10:10 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '3' },
  { id: '20', name: 'Compliance status by region',                reportType: 'table',          type: 'Saved views',    source: '{Account}/Compliance/{Region}',    createdAt: '04-01-2026 08:15 AM', lastUpdated: '04-15-2026 02:00 PM', createdBy: 'Mike Johnson', owner: 'shared', folderId: '4' },
  { id: '21', name: 'Capital expenditure vs budget',              reportType: 'bar',            type: 'Depreciation',   source: '{Account}/Finance/{CapEx}',        createdAt: '04-05-2026 11:00 AM', lastUpdated: '04-25-2026 09:45 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '4' },
  { id: '22', name: 'Asset write-off history',                    reportType: 'table',          type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '04-08-2026 01:30 PM', lastUpdated: '04-28-2026 12:00 PM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '5' },

  // Folder 5 — Asset depreciation schedule
  { id: '23', name: 'Annual depreciation by asset type',          reportType: 'bar',            type: 'Depreciation',   source: '{Account}/Finance/{Depreciation}', createdAt: '01-10-2026 09:00 AM', lastUpdated: '04-20-2026 10:30 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '5' },
  { id: '24', name: 'Straight-line vs accelerated depreciation',  reportType: 'line',           type: 'Depreciation',   source: '{Account}/Finance/{Depreciation}', createdAt: '01-18-2026 02:00 PM', lastUpdated: '04-18-2026 09:15 AM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '5' },

  // Folder 6 — Inventory audit results
  { id: '25', name: 'Audit discrepancy summary',                  reportType: 'table',          type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '01-22-2026 11:00 AM', lastUpdated: '04-22-2026 08:45 AM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '6' },
  { id: '26', name: 'Audit pass rate by location',                reportType: 'donut',          type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '02-02-2026 03:30 PM', lastUpdated: '04-19-2026 02:10 PM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '6' },
  { id: '27', name: 'Quarterly audit completion rate',            reportType: 'kpi',            type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '02-08-2026 10:15 AM', lastUpdated: '04-16-2026 11:50 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '6' },

  // Folder 7 — Maintenance cost summary
  { id: '28', name: 'Repair cost by asset category',              reportType: 'horizontal-bar', type: 'Collection',     source: '{Account}/{Module}/{Collection}',  createdAt: '02-12-2026 08:30 AM', lastUpdated: '04-14-2026 03:20 PM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '7' },
  { id: '29', name: 'Preventive vs reactive maintenance',         reportType: 'bar',            type: 'Audit',          source: '{Account}/{Module}/{Collection}',  createdAt: '02-16-2026 01:45 PM', lastUpdated: '04-12-2026 10:05 AM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '7' },
  { id: '30', name: 'Monthly maintenance spend trend',            reportType: 'line',           type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '02-20-2026 09:00 AM', lastUpdated: '04-10-2026 01:30 PM', createdBy: 'John Smith',   owner: 'mine',   folderId: '7' },

  // Folder 8 — Procurement overview
  { id: '31', name: 'Vendor spend breakdown',                     reportType: 'donut',          type: 'Form',           source: '{Account}/Procurement/{Vendor}',   createdAt: '02-24-2026 02:15 PM', lastUpdated: '04-08-2026 09:40 AM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '8' },
  { id: '32', name: 'Purchase order summary',                     reportType: 'table',          type: 'Form',           source: '{Account}/Procurement/{Form}',     createdAt: '03-02-2026 10:30 AM', lastUpdated: '04-06-2026 04:15 PM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '8' },

  // Folder 9 — Field inspection logs
  { id: '33', name: 'Inspection completion rate',                 reportType: 'kpi',            type: 'Audit',          source: '{Account}/Field/{Inspection}',     createdAt: '03-06-2026 08:00 AM', lastUpdated: '04-04-2026 11:20 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '9' },
  { id: '34', name: 'Failed inspections by region',               reportType: 'bar',            type: 'Audit',          source: '{Account}/Field/{Inspection}',     createdAt: '03-10-2026 03:00 PM', lastUpdated: '04-02-2026 02:45 PM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '9' },
  { id: '35', name: 'Inspector workload distribution',            reportType: 'horizontal-bar', type: 'Audit',          source: '{Account}/Field/{Inspection}',     createdAt: '03-14-2026 11:30 AM', lastUpdated: '03-31-2026 09:00 AM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '9' },

  // Folder 10 — Compliance & certifications
  { id: '36', name: 'Certification expiry tracker',               reportType: 'table',          type: 'Saved views',    source: '{Account}/Compliance/{Cert}',      createdAt: '03-18-2026 09:45 AM', lastUpdated: '04-28-2026 10:00 AM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '10' },
  { id: '37', name: 'Compliance score by department',             reportType: 'bar',            type: 'Saved views',    source: '{Account}/Compliance/{Region}',    createdAt: '03-20-2026 02:30 PM', lastUpdated: '04-26-2026 03:10 PM', createdBy: 'John Smith',   owner: 'mine',   folderId: '10' },

  // Folder 11 — Fleet utilization report
  { id: '38', name: 'Vehicle idle time analysis',                 reportType: 'horizontal-bar', type: 'Collection',     source: '{Account}/Assets/{Fleet}',         createdAt: '03-24-2026 10:00 AM', lastUpdated: '04-24-2026 08:30 AM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '11' },
  { id: '39', name: 'Fleet availability by vehicle type',         reportType: 'donut',          type: 'Collection',     source: '{Account}/Assets/{Fleet}',         createdAt: '03-26-2026 01:15 PM', lastUpdated: '04-22-2026 11:45 AM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '11' },
  { id: '40', name: 'Mileage and usage summary',                  reportType: 'line',           type: 'Collection',     source: '{Account}/Assets/{Fleet}',         createdAt: '03-28-2026 08:45 AM', lastUpdated: '04-20-2026 02:00 PM', createdBy: 'John Smith',   owner: 'mine',   folderId: '11' },

  // Folder 12 — IT asset lifecycle
  { id: '41', name: 'Hardware refresh timeline',                  reportType: 'line',           type: 'Change reports', source: '{Account}/IT/{Collection}',        createdAt: '04-01-2026 09:30 AM', lastUpdated: '04-28-2026 09:00 AM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '12' },
  { id: '42', name: 'End-of-life assets summary',                 reportType: 'table',          type: 'Saved views',    source: '{Account}/IT/{Collection}',        createdAt: '04-03-2026 02:00 PM', lastUpdated: '04-27-2026 04:30 PM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '12' },
  { id: '43', name: 'Software license utilization',               reportType: 'kpi',            type: 'Collection',     source: '{Account}/IT/{License}',           createdAt: '04-05-2026 10:45 AM', lastUpdated: '04-25-2026 01:15 PM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '12' },

  // Folder 13 — Real estate portfolio
  { id: '44', name: 'Lease expiry calendar',                      reportType: 'table',          type: 'Saved views',    source: '{Account}/RealEstate/{Lease}',     createdAt: '04-07-2026 08:15 AM', lastUpdated: '04-24-2026 10:20 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '13' },
  { id: '45', name: 'Property value by location',                 reportType: 'bar',            type: 'Collection',     source: '{Account}/RealEstate/{Property}',  createdAt: '04-09-2026 03:30 PM', lastUpdated: '04-23-2026 09:50 AM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '13' },

  // Folder 14 — Energy consumption tracking
  { id: '46', name: 'Utility cost by facility',                   reportType: 'bar',            type: 'Collection',     source: '{Account}/Facilities/{Meter}',     createdAt: '04-10-2026 11:00 AM', lastUpdated: '04-22-2026 02:40 PM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '14' },
  { id: '47', name: 'Energy savings year over year',              reportType: 'line',           type: 'Change reports', source: '{Account}/Facilities/{Meter}',     createdAt: '04-11-2026 09:15 AM', lastUpdated: '04-21-2026 11:10 AM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '14' },

  // Folder 15 — Warranty claims tracking
  { id: '48', name: 'Open warranty claims by vendor',             reportType: 'table',          type: 'Collection',     source: '{Account}/Assets/{Warranty}',      createdAt: '04-12-2026 02:45 PM', lastUpdated: '04-20-2026 03:30 PM', createdBy: 'John Smith',   owner: 'mine',   folderId: '15' },
  { id: '49', name: 'Claim resolution time KPI',                  reportType: 'kpi',            type: 'Collection',     source: '{Account}/Assets/{Warranty}',      createdAt: '04-13-2026 10:00 AM', lastUpdated: '04-19-2026 08:55 AM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '15' },

  // Folder 16 — Disposal and write-offs
  { id: '50', name: 'Disposed assets by category',                reportType: 'bar',            type: 'Depreciation',   source: '{Account}/Finance/{Disposal}',     createdAt: '04-14-2026 08:30 AM', lastUpdated: '04-18-2026 01:20 PM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '16' },
  { id: '51', name: 'Write-off value this quarter',               reportType: 'kpi',            type: 'Depreciation',   source: '{Account}/Finance/{Disposal}',     createdAt: '04-14-2026 01:00 PM', lastUpdated: '04-17-2026 10:40 AM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '16' },

  // Folder 17 — Capital expenditure plan
  { id: '52', name: 'CapEx budget vs actual spend',               reportType: 'bar',            type: 'Depreciation',   source: '{Account}/Finance/{CapEx}',        createdAt: '04-15-2026 09:00 AM', lastUpdated: '04-28-2026 08:00 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '17' },
  { id: '53', name: 'Approved projects by department',            reportType: 'donut',          type: 'Form',           source: '{Account}/Finance/{CapEx}',        createdAt: '04-15-2026 11:30 AM', lastUpdated: '04-27-2026 03:45 PM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '17' },
  { id: '54', name: 'Project spend timeline',                     reportType: 'line',           type: 'Change reports', source: '{Account}/Finance/{CapEx}',        createdAt: '04-16-2026 02:15 PM', lastUpdated: '04-26-2026 11:00 AM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '17' },

  // Folder 18 — Asset transfer history
  { id: '55', name: 'Inter-department asset transfers',           reportType: 'table',          type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '04-16-2026 09:45 AM', lastUpdated: '04-25-2026 02:20 PM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '18' },
  { id: '56', name: 'Transfer frequency by location',             reportType: 'bar',            type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '04-17-2026 08:00 AM', lastUpdated: '04-24-2026 09:30 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '18' },
  { id: '57', name: 'Asset movement by quarter',                  reportType: 'horizontal-bar', type: 'Change reports', source: '{Account}/{Module}/{Collection}',  createdAt: '04-17-2026 03:00 PM', lastUpdated: '04-23-2026 04:00 PM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '18' },

  // Folder 19 — Biannual performance review
  { id: '58', name: 'KPI scorecard H1 2026',                      reportType: 'kpi',            type: 'Saved views',    source: '{Account}/{Module}/{Collection}',  createdAt: '04-18-2026 10:00 AM', lastUpdated: '04-22-2026 10:15 AM', createdBy: 'Jane Doe',     owner: 'shared', folderId: '19' },
  { id: '59', name: 'Performance trends 6-month view',            reportType: 'line',           type: 'Saved views',    source: '{Account}/{Module}/{Collection}',  createdAt: '04-18-2026 02:30 PM', lastUpdated: '04-21-2026 03:00 PM', createdBy: 'Mike Johnson', owner: 'mine',   folderId: '19' },

  // Folder 20 — New product rollout
  { id: '60', name: 'Launch readiness by department',             reportType: 'table',          type: 'Form',           source: '{Account}/Products/{Launch}',      createdAt: '04-19-2026 09:00 AM', lastUpdated: '04-20-2026 11:30 AM', createdBy: 'John Smith',   owner: 'mine',   folderId: '20' },
  { id: '61', name: 'Rollout progress by region',                 reportType: 'bar',            type: 'Form',           source: '{Account}/Products/{Launch}',      createdAt: '04-19-2026 01:45 PM', lastUpdated: '04-20-2026 08:45 AM', createdBy: 'Sarah Lee',    owner: 'shared', folderId: '20' },

  // Unassigned — visible in main Reports list
  { id: '62', name: 'Customer feedback analysis',                 reportType: 'donut',          type: 'Saved views',    source: '{Account}/{Module}/{Collection}',  createdAt: '01-06-2026 10:00 AM', lastUpdated: '04-27-2026 09:00 AM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '63', name: 'Support ticket volume',                      reportType: 'bar',            type: 'Collection',     source: '{Account}/{Module}/{Collection}',  createdAt: '01-14-2026 02:00 PM', lastUpdated: '04-25-2026 11:30 AM', createdBy: 'Mike Johnson', owner: 'mine'   },
  { id: '64', name: 'Training completion rate',                   reportType: 'kpi',            type: 'Saved views',    source: '{Account}/{Module}/{Collection}',  createdAt: '01-28-2026 09:30 AM', lastUpdated: '04-23-2026 02:15 PM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '65', name: 'Employee asset assignment report',           reportType: 'table',          type: 'Collection',     source: '{Account}/{Module}/{Collection}',  createdAt: '02-06-2026 11:00 AM', lastUpdated: '04-21-2026 10:00 AM', createdBy: 'Sarah Lee',    owner: 'shared' },
  { id: '66', name: 'Budget variance report',                     reportType: 'line',           type: 'Change reports', source: '{Account}/Finance/{Budget}',       createdAt: '02-19-2026 03:15 PM', lastUpdated: '04-19-2026 01:45 PM', createdBy: 'Jane Doe',     owner: 'shared' },
  { id: '67', name: 'Quarterly asset utilization',                reportType: 'horizontal-bar', type: 'Collection',     source: '{Account}/{Module}/{Collection}',  createdAt: '03-03-2026 08:00 AM', lastUpdated: '04-17-2026 09:20 AM', createdBy: 'Mike Johnson', owner: 'mine'   },
  { id: '68', name: 'Vendor performance scorecard',               reportType: 'bar',            type: 'Form',           source: '{Account}/Procurement/{Vendor}',   createdAt: '03-17-2026 01:00 PM', lastUpdated: '04-15-2026 03:00 PM', createdBy: 'John Smith',   owner: 'mine'   },
  { id: '69', name: 'Asset utilization overview',                 reportType: 'donut',          type: 'Collection',     source: '{Account}/{Module}/{Collection}',  createdAt: '04-02-2026 10:30 AM', lastUpdated: '04-13-2026 11:00 AM', createdBy: 'Sarah Lee',    owner: 'shared' },
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
  const [folderSource, setFolderSource] = useState<Screen>('reports')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [reports, setReports] = useState<Report[]>(initialReports)

  const selectedFolder = folders.find(f => f.id === selectedFolderId) ?? null
  const foldersWithCount = folders.map(f => ({ ...f, count: reports.filter(r => r.folderId === f.id).length }))

  function openFolder(folder: FolderItem, from: Screen) {
    setSelectedFolderId(folder.id)
    setFolderSource(from)
    setScreen('folder-detail')
  }

  function addFolder(name: string, description: string = '') {
    setFolders(prev => [
      { id: String(Date.now()), name, description, count: 0 },
      ...prev,
    ])
  }

  function editFolder(id: string, name: string, description?: string) {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name, description: description ?? f.description } : f))
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

  function moveReportToFolder(reportId: string, targetFolderId: string) {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, folderId: targetFolderId } : r))
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
        source={folderSource === 'folders' ? 'folders' : 'reports'}
        initialReports={reports.filter(r => r.folderId === selectedFolder?.id)}
        folders={foldersWithCount}
        folderId={selectedFolder?.id ?? ''}
        folderName={selectedFolder?.name ?? ''}
        folderDescription={selectedFolder?.description ?? ''}
        onEditFolder={(id, name, description) => editFolder(id, name, description)}
        onBack={() => setScreen(folderSource)}
        onNavigateToReports={() => setScreen('reports')}
        onOpenReport={(report) => openReport(report, 'folder-detail')}
        onEditReport={editReport}
        onDuplicateReport={duplicateReport}
        onDeleteReport={deleteReport}
        onMoveToFolder={moveReportToFolder}
        onAddReport={addReport}
      />
    )
  }
  if (screen === 'folders') {
    return (
      <Folders
        folders={foldersWithCount}
        onAddFolder={addFolder}
        onEditFolder={editFolder}
        onDeleteFolder={deleteFolder}
        onAddReport={addReport}
        onBack={() => setScreen('reports')}
        onOpenFolder={(folder) => openFolder(folder, 'folders')}
      />
    )
  }
  return (
    <Reports
      folders={foldersWithCount}
      reports={reports.filter(r => !r.folderId)}
      onAddFolder={addFolder}
      onEditFolder={editFolder}
      onDeleteFolder={deleteFolder}
      onAddReport={addReport}
      onEditReport={editReport}
      onDuplicateReport={duplicateReport}
      onDeleteReport={deleteReport}
      onMoveToFolder={moveReportToFolder}
      onViewAllFolders={() => setScreen('folders')}
      onOpenFolder={(folder) => openFolder(folder, 'reports')}
      onOpenReport={(report) => openReport(report, 'reports')}
    />
  )
}
