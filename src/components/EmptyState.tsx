import type { ReactNode } from 'react'
import { Button } from '@assetpandallc/pioneer-design-system'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 px-6 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex flex-col gap-1 max-w-[280px]">
        <p className="text-[16px] font-bold text-foreground leading-6">{title}</p>
        <p className="text-[14px] text-muted-foreground leading-5">{description}</p>
      </div>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
