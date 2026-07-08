import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Plus, LogOut, Send } from "lucide-react";
import { toast } from "sonner";

export default function Forum() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const threadsQuery = trpc.forum.getThreads.useQuery();
  const threadQuery = trpc.forum.getThread.useQuery(
    { threadId: selectedThread || 0 },
    { enabled: selectedThread !== null }
  );
  const statsQuery = trpc.forum.getStats.useQuery();
  const createThreadMutation = trpc.forum.createThread.useMutation();
  const addMessageMutation = trpc.forum.addMessage.useMutation();

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreatingThread(true);
    try {
      await createThreadMutation.mutateAsync({
        title: newThreadTitle,
        content: newThreadContent,
      });
      setNewThreadTitle("");
      setNewThreadContent("");
      toast.success("Thread created successfully!");
      threadsQuery.refetch();
    } catch (error) {
      toast.error("Failed to create thread");
      console.error(error);
    } finally {
      setIsCreatingThread(false);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim() || selectedThread === null) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await addMessageMutation.mutateAsync({
        threadId: selectedThread,
        content: newMessage,
      });
      setNewMessage("");
      toast.success("Message posted!");
      threadQuery.refetch();
    } catch (error) {
      toast.error("Failed to post message");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/logo_fcf800f3.jpg" alt="the.people" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-slate-800">the.people</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm">
              Dashboard
            </Button>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Community Forum</h1>
            <p className="text-slate-600">Discuss ideas, share experiences, and build community</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Thread</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">Title</label>
                  <Input
                    placeholder="Thread title..."
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">Content</label>
                  <Textarea
                    placeholder="What would you like to discuss?"
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleCreateThread}
                  disabled={isCreatingThread}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Total Threads</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{statsQuery.data?.totalThreads || 0}</p>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Total Messages</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{statsQuery.data?.totalMessages || 0}</p>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Active Members</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{statsQuery.data?.totalMembers || 0}</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Threads List */}
          <div className="md:col-span-2 space-y-4">
            {threadsQuery.isLoading ? (
              <Card className="p-6 bg-white border-slate-200 text-center">
                <p className="text-slate-600">Loading threads...</p>
              </Card>
            ) : threadsQuery.data && threadsQuery.data.length > 0 ? (
              threadsQuery.data.map((thread) => (
                <Card
                  key={thread.id}
                  className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{thread.title}</h3>
                    {thread.isPinned && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pinned</span>}
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{thread.content}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{thread.messageCount} messages</span>
                    <span>{new Date(thread.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 bg-white border-slate-200 text-center">
                <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Discussions Yet</h3>
                <p className="text-slate-600 mb-6">Be the first to start a conversation in the community forum!</p>
              </Card>
            )}
          </div>

          {/* Thread Detail */}
          <div>
            {selectedThread !== null && threadQuery.data ? (
              <Card className="p-6 bg-white border-slate-200 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-4">{threadQuery.data.thread.title}</h2>
                <p className="text-slate-600 mb-6">{threadQuery.data.thread.content}</p>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {threadQuery.data.messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">{new Date(msg.createdAt).toLocaleString()}</p>
                      <p className="text-slate-700">{msg.content}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleAddMessage}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Reply
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-slate-100 border-slate-300 sticky top-24">
                <p className="text-slate-600 text-center">Select a thread to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
