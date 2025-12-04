// frontend/app/dashboard/projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Trash2, Loader2 } from 'lucide-react';
import { api, type ProjectWithMessages, type ChatMessage } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);

  const [project, setProject] = useState<ProjectWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await api.getProject(projectId);
      setProject(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || sendingMessage) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    setSendingMessage(true);

    try {
      // Add user message to UI immediately
      const tempUserMsg: ChatMessage = {
        id: Date.now(),
        project_id: projectId,
        sender: 'user',
        message: userMessage,
        created_at: new Date().toISOString(),
      };

      setProject(prev => prev ? {
        ...prev,
        chat_messages: [...prev.chat_messages, tempUserMsg]
      } : null);

      // Send to backend and get bot response
      const botResponse = await api.sendChatMessage(projectId, userMessage);

      // Refresh project to get both messages
      await fetchProject();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }

    try {
      await api.deleteProject(projectId);
      router.push('/dashboard/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <div className="space-y-6 max-w-6xl w-full px-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 items-start">

          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || 'Project not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/projects')}>
              Go to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">
              Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-10 md:grid-cols-2 items-start justify-center">
        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>PCB Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={project.image_base64}
                alt={project.name}
                className="object-contain w-full h-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis & Chat */}
        <Card>
          <Tabs defaultValue="analysis">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="chat">
                  Chat ({project.chat_messages.length})
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="analysis" className="space-y-4">
                {project.analysis ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{project.analysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No analysis available yet
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg">
                  {project.chat_messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No messages yet. Ask a question about this PCB!
                      </p>
                    </div>
                  ) : (
                    project.chat_messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask about components, connections, etc..."
                    disabled={sendingMessage}
                  />
                  <Button type="submit" disabled={sendingMessage || !chatMessage.trim()}>
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}