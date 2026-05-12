import { useState } from 'react'
import { toast } from 'sonner'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Label,
  Input,
} from '@assetpandallc/pioneer-design-system'
import type { FolderItem } from '../App'

interface CreateFolderModalProps {
  open: boolean
  onClose: () => void
  onAdd: (name: string, description: string) => void
  folders: FolderItem[]
}

export function CreateFolderModal({ open, onClose, onAdd, folders }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('')
  const [folderDescription, setFolderDescription] = useState('')
  const [error, setError] = useState('')

  function handleClose() {
    setFolderName('')
    setFolderDescription('')
    setError('')
    onClose()
  }

  function handleAdd() {
    const trimmed = folderName.trim()
    if (!trimmed) { setError('Folder name is required.'); return }

    const isDuplicate = folders.some(
      (f) => f.name.trim().toLowerCase() === trimmed.toLowerCase()
    )

    if (isDuplicate) {
      setError('A folder with this name already exists.')
      return
    }

    onAdd(trimmed, folderDescription.trim())
    toast.success('Folder created successfully')
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Add folder</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="folder-name">Folder name</Label>
              <Input
                id="folder-name"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => { setFolderName(e.target.value); if (error) setError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                autoFocus
              />
              {error && <p className="text-[12px] text-destructive">{error}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="folder-description">Description</Label>
              <Input
                id="folder-description"
                placeholder="Add a description..."
                value={folderDescription}
                onChange={(e) => setFolderDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button variant="default" onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
