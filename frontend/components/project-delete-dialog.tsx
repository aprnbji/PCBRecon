"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ProjectDeleteDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ProjectDeleteDialog({ isOpen, onConfirm, onCancel }: ProjectDeleteDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border/50 rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Delete Project?</h2>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Deleting this project will remove all associated images, analysis results, and chat history.
          </p>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="border-primary/50 bg-transparent">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="bg-destructive hover:bg-destructive/80 text-destructive-foreground">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
