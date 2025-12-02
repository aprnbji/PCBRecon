"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ImageIcon, Trash2, Edit2, ZoomIn } from "lucide-react"

interface ImageItem {
  id: string
  name: string
  uploadedAt: string
  size: string
  tags?: string[]
}

interface ImageManagerProps {
  images: ImageItem[]
  onDelete?: (id: string) => void
  onRename?: (id: string, newName: string) => void
  onView?: (id: string) => void
}

export function ImageManager({ images, onDelete, onRename, onView }: ImageManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleRename = (id: string, oldName: string) => {
    if (!editingId) {
      setEditingId(id)
      setEditName(oldName.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleSaveRename = (id: string) => {
    const ext = editName.includes(".") ? "" : ".jpg"
    onRename?.(id, editName + ext)
    setEditingId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                {editingId === image.id ? (
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-input/50 border-input text-sm"
                      placeholder="Image name"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveRename(image.id)}
                      className="bg-accent hover:bg-accent/80 text-accent-foreground"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="font-medium truncate text-sm">{image.name}</p>
                    <p className="text-xs text-muted-foreground">{image.size}</p>
                  </>
                )}

                {image.tags && image.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {image.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">Uploaded {image.uploadedAt}</p>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView?.(image.id)}
                    className="text-xs border-primary/50"
                  >
                    <ZoomIn className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRename(image.id, image.name)}
                    className="text-xs border-primary/50"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete?.(image.id)}
                    className="text-xs border-destructive/50 text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
