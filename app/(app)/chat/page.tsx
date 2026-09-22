"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Message } from "@/components/chat/message";
import { Send, Loader2 } from "lucide-react";

const suggestions = [
  "How much did I spend last month?",
  "What's my biggest expense category?",
  "Show my income vs expenses trend",
];

export default function ChatPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || isLoading) {
      return;
    }

    setInput("");

    try {
      await sendMessage({ text });
    } catch {
      setInput(text);
    }
  };

  const handleSuggestion = (text: string) => {
    if (!isLoading) {
      setInput(text);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Chat</h1>
        <p className="text-muted-foreground">
          Ask me anything about your finances
        </p>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold">
                  Start a conversation
                </h3>

                <p className="text-sm text-muted-foreground">
                  Try asking:
                </p>

                <div className="mt-4 flex flex-col items-center gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => handleSuggestion(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const content = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");

                if (!content) {
                  return null;
                }

                return (
                  <Message
                    key={message.id}
                    role={message.role === "user" ? "user" : "assistant"}
                    content={content}
                    timestamp={new Date()}
                  />
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
            </>
          )}
        </CardContent>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              disabled={isLoading}
              className="flex-1"
            />

            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
