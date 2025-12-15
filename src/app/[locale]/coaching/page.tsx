'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Video, 
  Send, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  User
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isFromCoach: boolean;
  createdAt: string;
  status: string;
}

interface Session {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  coachName?: string;
  videoUrl?: string;
}

export default function CoachingPage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/coaching/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/coaching/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const res = await fetch('/api/coaching/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });
      
      if (res.ok) {
        setNewMessage('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const requestSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coaching/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (res.ok) {
        await fetchSessions();
      }
    } catch (error) {
      console.error('Failed to request session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      scheduled: { variant: 'default', icon: <Calendar className="h-3 w-3" /> },
      in_progress: { variant: 'secondary', icon: <Video className="h-3 w-3" /> },
      completed: { variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
      cancelled: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      no_show: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {t(`coaching.status.${status}`)}
      </Badge>
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(211,100%,20%)]">
          {t('coaching.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('coaching.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('coaching.messages')}
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            {t('coaching.videoSessions')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[hsl(211,100%,20%)]" />
                {t('coaching.messageYourCoach')}
              </CardTitle>
              <CardDescription>
                {t('coaching.messageDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 rounded-lg mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>{t('coaching.noMessages')}</p>
                      <p className="text-sm mt-1">{t('coaching.startConversation')}</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromCoach ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.isFromCoach
                              ? 'bg-white border shadow-sm'
                              : 'bg-[hsl(211,100%,20%)] text-white'
                          }`}
                        >
                          {msg.isFromCoach && (
                            <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {t('coaching.coach')}
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isFromCoach ? 'text-muted-foreground' : 'text-white/70'}`}>
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('coaching.typeMessage')}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isSending}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || isSending}
                    className="bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[hsl(211,100%,20%)]" />
                  {t('coaching.scheduledSessions')}
                </CardTitle>
                <CardDescription>
                  {t('coaching.sessionsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>{t('coaching.noSessions')}</p>
                    <p className="text-sm mt-1">{t('coaching.requestSessionPrompt')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((sess) => (
                      <div key={sess.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{formatDate(sess.scheduledAt)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {sess.durationMinutes} {t('coaching.minutes')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(sess.status)}
                          {sess.status === 'scheduled' && sess.videoUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={sess.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-1" />
                                {t('coaching.join')}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-[hsl(145,100%,29%)]" />
                  {t('coaching.requestSession')}
                </CardTitle>
                <CardDescription>
                  {t('coaching.requestDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">{t('coaching.whatToExpect')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(145,100%,29%)] mt-0.5" />
                        {t('coaching.expectItem1')}
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(145,100%,29%)] mt-0.5" />
                        {t('coaching.expectItem2')}
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(145,100%,29%)] mt-0.5" />
                        {t('coaching.expectItem3')}
                      </li>
                    </ul>
                  </div>
                  <Button 
                    onClick={requestSession}
                    disabled={isLoading}
                    className="w-full bg-[hsl(145,100%,29%)] hover:bg-[hsl(145,100%,25%)]"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {isLoading ? t('common.loading') : t('coaching.requestNow')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
