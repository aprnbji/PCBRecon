"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Trash2, Edit2, Eye } from "lucide-react"
import { ProjectDeleteDialog } from "@/components/project-delete-dialog"

interface Project {
  id: string
  name: string
  description: string
  category: string
  imageCount: number
  createdAt: string
  lastModified: string
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "IoT Router v2.1",
      description: "WiFi 6 router main board analysis and security audit",
      category: "IoT",
      imageCount: 14,
      createdAt: "2025-01-15",
      lastModified: "2025-01-20",
    },
    {
      id: "2",
      name: "Microcontroller Board",
      description: "ARM Cortex-M4 development board PCB review",
      category: "Microcontroller",
      imageCount: 8,
      createdAt: "2025-01-10",
      lastModified: "2025-01-18",
    },
    {
      id: "3",
      name: "Power Supply Unit",
      description: "500W modular PSU design and vulnerability assessment",
      category: "Power",
      imageCount: 11,
      createdAt: "2025-01-05",
      lastModified: "2025-01-19",
    },
  ])
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)

  const categories = ["all", "IoT", "Microcontroller", "Power", "Custom PCB", "Router"]

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteProject = () => {
    if (deleteProjectId) {
      setProjects(projects.filter((p) => p.id !== deleteProjectId))
      setDeleteProjectId(null)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage and analyze all your PCB projects</p>
        </div>
        <Link href="/dashboard/new-project">
          <Button className="bg-accent hover:bg-accent/80 text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input/50 border-input"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-card/80"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-all group">
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary mb-2">
                      {project.category}
                    </div>
                    <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteProjectId(project.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{project.imageCount}</span> images
                  </div>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/50 hover:border-primary bg-transparent"
                    >
                      Open
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground">
                    Modified {new Date(project.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-border/50 bg-card/50 text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Link href="/dashboard/new-project">
                <Button className="bg-accent hover:bg-accent/80 text-accent-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      {deleteProjectId && (
        <ProjectDeleteDialog
          isOpen={!!deleteProjectId}
          onConfirm={handleDeleteProject}
          onCancel={() => setDeleteProjectId(null)}
        />
      )}
    </div>
  )
}
