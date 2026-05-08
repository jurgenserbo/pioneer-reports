import { useState } from 'react'
import { toast } from 'sonner'
import {
  Button,
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
import { CreateReportModal } from '../components/CreateReportModal'
import { CreateFolderModal } from '../components/CreateFolderModal'
import type { FolderItem } from '../App'
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
  onAddFolder: (name: string) => void
  onEditFolder: (id: string, name: string) => void
  onDeleteFolder: (id: string) => void
  onAddReport: (r: { name: string; reportType: string; type: string; source: string }) => void
  onBack: () => void
  onOpenFolder: () => void
}) {
  const [addReportOpen, setAddReportOpen] = useState(false)
  const [addFolderOpen, setAddFolderOpen] = useState(false)
  const [editFolder, setEditFolder] = useState<FolderItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState('')
  const [deleteFolder, setDeleteFolder] = useState<FolderItem | null>(null)

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
    if (!trimmed || !editFolder) return

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
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">

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
        <div className="mx-6 rounded-lg border border-border bg-card mb-6">

          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-6 shrink-0">
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1 w-fit text-[14px] font-medium text-[#006CA9] hover:opacity-80 transition-opacity"
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

          {/* Folders grid */}
          <div className="px-6 pb-6">
            <div className="grid gap-4 grid-cols-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={onOpenFolder}
                  className="bg-card border border-border rounded-2xl flex flex-col px-4 py-3.5 gap-4 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-background-blue shrink-0">
                        <Folder size={20} className="text-[#006CA9]" />
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
                    <p className="text-[16px] font-bold text-foreground leading-6 truncate">{folder.name}</p>
                    <p className="text-[12px] text-muted-foreground leading-4 truncate">{folder.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <Button variant="default" disabled={!editName.trim()} onClick={handleEditSave}>Save</Button>
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
