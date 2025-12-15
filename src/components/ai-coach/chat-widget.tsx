"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Send, X, Loader2, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiCoachWidget() {
  const t = useTranslations();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err) {
      setError(
        locale === "es"
          ? "No se pudo obtener respuesta. Intente de nuevo."
          : "Failed to get response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)] z-50"
        aria-label={
          locale === "es" ? "Abrir asistente de IA" : "Open AI assistant"
        }
      >
        <Brain className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 max-h-[500px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="bg-[hsl(211,100%,20%)] text-white rounded-t-lg py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <CardTitle className="text-base font-medium">
            {locale === "es" ? "Asistente de Coaching" : "Coaching Assistant"}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px]">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              <Brain className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>
                {locale === "es"
                  ? "¡Hola! Soy tu asistente de coaching. ¿En qué puedo ayudarte hoy?"
                  : "Hi! I'm your coaching assistant. How can I help you today?"}
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-[hsl(211,100%,20%)] text-white"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                locale === "es"
                  ? "Escribe tu pregunta..."
                  : "Type your question..."
              }
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
