"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadZoneProps {
  projectId: string
  onUpload?: (files: File[]) => void
}

export function ImageUploadZone({ projectId, onUpload }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const handleDragEnter = () => setIsDragging(true)
  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        setUploadProgress(100)
        setTimeout(() => {
          setUploadProgress(null)
          onUpload?.(files)
        }, 500)
        clearInterval(interval)
      } else {
        setUploadProgress(Math.min(progress, 99))
      }
    }, 300)
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50 bg-card/50"
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/png,image/jpeg"
        onChange={handleFileSelect}
        className="hidden"
        id="file-input"
      />

      {uploadProgress !== null ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              {uploadProgress === 100 ? (
                <Check className="w-6 h-6 text-accent" />
              ) : (
                <Upload className="w-6 h-6 text-accent animate-pulse" />
              )}
            </div>
          </div>
          <div>
            <p className="font-medium">Uploading...</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-accent h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Drag and drop PCB images here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <label htmlFor="file-input">
              <Button asChild className="bg-accent hover:bg-accent/80 text-accent-foreground">
                <span>Select Files</span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-4">PNG or JPG, max 10MB each</p>
          </div>
        </div>
      )}
    </div>
  )
}
