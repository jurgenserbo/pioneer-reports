import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Label,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@assetpandallc/pioneer-design-system'
import { ChevronDown } from 'lucide-react'
import type { FolderItem } from '../App'

interface MoveToFolderModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (folderId: string, folderName: string) => void
  folders: FolderItem[]
}

export function MoveToFolderModal({ open, onClose, onConfirm, folders }: MoveToFolderModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectionError, setSelectionError] = useState('')

  const selectedFolder = folders.find(f => f.id === selectedId)

  function handleConfirm() {
    if (!selectedId || !selectedFolder) { setSelectionError('Please select a folder.'); return }
    onConfirm(selectedId, selectedFolder.name)
    setSelectedId(null)
  }

  function handleClose() {
    setSelectedId(null)
    setSelectionError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Move to folder</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-2">
            <Label>Select folder</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between w-full px-3 h-10 border border-border rounded-lg bg-background text-[14px] hover:border-primary/50 transition-colors">
                  <span className={selectedFolder ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedFolder ? selectedFolder.name : 'Select folder'}
                  </span>
                  <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[352px] max-h-[240px] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
                {folders.length === 0 ? (
                  <div className="px-3 py-4 text-[14px] text-muted-foreground text-center">No folders yet</div>
                ) : (
                  folders.map(folder => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={() => { setSelectedId(folder.id); if (selectionError) setSelectionError('') }}
                      className={selectedId === folder.id ? 'bg-primary/5 text-primary' : ''}
                    >
                      {folder.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectionError && <p className="text-[12px] text-destructive">{selectionError}</p>}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button variant="default" onClick={handleConfirm}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
