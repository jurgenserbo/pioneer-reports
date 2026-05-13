import { useState } from 'react'
import { toast } from 'sonner'
import {
  Button,
  Checkbox,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@assetpandallc/pioneer-design-system'
import { CreateReportModal } from '../components/CreateReportModal'
import { CreateFolderModal } from '../components/CreateFolderModal'
import { EmptyState } from '../components/EmptyState'
import type { FolderItem, ReportType } from '../App'
import {
  ListFilter,
  ArrowUpNarrowWide,
  FolderPlus,
  CirclePlus,
  Folder,
  EllipsisVertical,
  ArrowLeft,
  ChevronDown,
  Search,
  PanelLeft,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react'

// ── Component ────────────────────────────────────────────────────────────────

export function Folders({ folders, onAddFolder, onEditFolder, onDeleteFolder, onAddReport, onBack, onOpenFolder }: {
  folders: FolderItem[]
  onAddFolder: (name: string, description: string) => void
  onEditFolder: (id: string, name: string) => void
  onDeleteFolder: (id: string) => void
  onAddReport: (r: { name: string; reportType: ReportType; type: string; source: string }) => void
  onBack: () => void
  onOpenFolder: (folder: FolderItem) => void
}) {
  const [addReportOpen, setAddReportOpen] = useState(false)
  const [addFolderOpen, setAddFolderOpen] = useState(false)
  const [editFolder, setEditFolder] = useState<FolderItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState('')
  const [deleteFolder, setDeleteFolder] = useState<FolderItem | null>(null)
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set())
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)

  function toggleFolder(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBulkDelete() {
    selectedFolders.forEach(id => onDeleteFolder(id))
    const count = selectedFolders.size
    setSelectedFolders(new Set())
    setBulkDeleteOpen(false)
    toast.success(`${count} folder${count > 1 ? 's' : ''} deleted successfully`)
  }

  function handleEditOpen(folder: FolderItem) {
    setEditFolder(folder)
    setEditName(folder.name)
    setEditError('')
  }

  function handleEditClose() {
    setEditFolder(null)
    setEditName('')
    setEditError('')
  }

  function handleEditSave() {
    const trimmed = editName.trim()
    if (!trimmed) { setEditError('Folder name is required.'); return }
    if (!editFolder) return

    const isDuplicate = folders.some(
      f => f.id !== editFolder.id && f.name.trim().toLowerCase() === trimmed.toLowerCase()
    )
    if (isDuplicate) {
      setEditError('A folder with this name already exists.')
      return
    }

    onEditFolder(editFolder.id, trimmed)
    toast.success('Folder updated successfully')
    handleEditClose()
  }

  function handleDeleteConfirm() {
    if (!deleteFolder) return
    onDeleteFolder(deleteFolder.id)
    toast.success('Folder deleted successfully')
    setDeleteFolder(null)
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
              <button onClick={onBack} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</button>
              <span className="text-[12px] font-medium text-muted-foreground">/</span>
              <span className="text-[12px] font-medium text-primary">Folders</span>
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
                <h1 className="text-[18px] font-bold text-foreground leading-7">{folders.length} Folders</h1>
                <p className="text-[14px] text-muted-foreground leading-5">Organize and manage your reports into folders for quick access.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="icon"><ListFilter size={16} /></Button>
              <Button variant="outline" size="icon"><ArrowUpNarrowWide size={16} /></Button>
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

          {/* Bulk actions bar — only visible when folders are selected */}
          {selectedFolders.size > 0 && (
            <div className="flex items-center gap-2 px-6 h-12 border-t border-border shrink-0">
              <span className="flex-1 text-[14px] font-medium text-foreground">
                {selectedFolders.size} folder{selectedFolders.size > 1 ? 's' : ''} selected
              </span>
              <Button variant="link" size="sm" onClick={() => setSelectedFolders(new Set(folders.map(f => f.id)))}>
                Select all
              </Button>
              <Button variant="link" size="sm" onClick={() => setSelectedFolders(new Set())}>
                Deselect all
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          )}

          {/* Folders grid */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto hover-scrollbar-y">
            {folders.length === 0 ? (
              <EmptyState
                icon={<Folder size={24} />}
                title="No folders yet"
                description="Create a folder to organize your reports and find them quickly."
                action={{ label: 'Add folder', onClick: () => setAddFolderOpen(true) }}
              />
            ) : (
            <TooltipProvider>
            <div className="grid gap-4 grid-cols-4">
              {folders.map((folder) => {
                const isSelected = selectedFolders.has(folder.id)
                return (
                <div
                  key={folder.id}
                  onClick={() => onOpenFolder(folder)}
                  onMouseEnter={() => setHoveredFolder(folder.id)}
                  onMouseLeave={() => setHoveredFolder(null)}
                  className={`bg-card border rounded-2xl flex flex-col px-4 py-3.5 gap-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Icon slot: folder icon by default, checkbox on hover / when selected */}
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors cursor-pointer ${
                          isSelected || hoveredFolder === folder.id ? 'bg-transparent' : 'bg-background-blue'
                        }`}
                        onClick={(e) => toggleFolder(folder.id, e)}
                      >
                        {isSelected || hoveredFolder === folder.id ? (
                          <Checkbox checked={isSelected} onCheckedChange={() => {}} />
                        ) : (
                          <Folder size={20} className="text-tertiary" />
                        )}
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
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditOpen(folder) }}>
                          <Pencil size={14} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation() }}>
                          <Share2 size={14} />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteFolder(folder) }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Bottom row */}
                  <div className="flex flex-col gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-[16px] font-bold text-foreground leading-6 truncate">{folder.name}</p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[260px] break-words">{folder.name}</TooltipContent>
                    </Tooltip>
                    {folder.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-[12px] text-muted-foreground leading-4 truncate">{folder.description}</p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px] break-words">{folder.description}</TooltipContent>
                      </Tooltip>
                    )}
                    {!folder.description && (
                      <p className="text-[12px] text-muted-foreground leading-4 truncate">{folder.description}</p>
                    )}
                  </div>
                </div>
                )
              })}
            </div>
            </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Edit folder modal */}
      <Dialog open={!!editFolder} onOpenChange={(v) => { if (!v) handleEditClose() }}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit folder</DialogTitle>
          </DialogHeader>
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
            <Button variant="default" onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk delete confirmation modal */}
      <Dialog open={bulkDeleteOpen} onOpenChange={(v) => { if (!v) setBulkDeleteOpen(false) }}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete {selectedFolders.size} folder{selectedFolders.size > 1 ? 's' : ''}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-[14px] text-muted-foreground">
              Are you sure you want to delete {selectedFolders.size} folder{selectedFolders.size > 1 ? 's' : ''}? This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <Dialog open={!!deleteFolder} onOpenChange={(v) => { if (!v) setDeleteFolder(null) }}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete folder</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-[14px] text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteFolder?.name}"</span>? This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFolder(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
