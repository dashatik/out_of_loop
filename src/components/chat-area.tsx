"use client";

import React from "react";
import { Conversation, Message } from "@/types";
import { Send } from "lucide-react";
import { sendMessage, generateTitle } from "@/lib/api";
import { ErrorBoundary } from "./error-boundary";
import ReactMarkdown from 'react-markdown';
import { CopyButton } from "./copy-button";
import { RobotIcon } from "./robot-icon";

interface ChatAreaProps {
  conversation: Conversation | null;
  onUpdateConversation: (conversation: Conversation) => void;
  isSidebarCollapsed: boolean;
}

const ALL_QUERIES = [
  // Programming & Development
  "How do I get started with web development?",
  "Explain Docker containers simply",
  "What are the key features of TypeScript?",
  "How to implement authentication in Next.js?",
  "Best practices for React performance",
  "Explain microservices architecture",
  "How to use Git effectively?",
  "What is CI/CD pipeline?",
  
  // AI & Machine Learning
  "Explain machine learning in simple terms",
  "Latest developments in AI technology",
  "How does natural language processing work?",
  "What is deep learning?",
  "Explain neural networks simply",
  
  // Computer Science
  "What are data structures?",
  "Explain Big O notation",
  "How does blockchain work?",
  "What is cloud computing?",
  "Explain quantum computing basics",
  
  // Career & Learning
  "How to become a better programmer?",
  "Tips for coding interviews",
  "Best resources for learning Python",
  "How to contribute to open source?",
  "Career path for becoming a data scientist"
];

function getRandomQueries(count: number = 4): string[] {
  const shuffled = [...ALL_QUERIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function ChatArea({ conversation, onUpdateConversation, isSidebarCollapsed }: ChatAreaProps) {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [abortController, setAbortController] = React.useState<AbortController | null>(null);
  const [suggestedQueries, setSuggestedQueries] = React.useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  React.useEffect(() => {
    if (!conversation?.messages.length) {
      setSuggestedQueries(getRandomQueries());
    }
  }, [conversation]);

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsStreaming(false);
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversation) return;

    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);

    try {
      // Generate title if this is the first message
      if (conversation.messages.length === 0) {
        const title = await generateTitle(message);
        conversation.title = title;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: Date.now(),
      };

      const updatedConversation: Conversation = {
        ...conversation,
        messages: [...conversation.messages, userMessage],
      };
      onUpdateConversation(updatedConversation);
      setMessage("");

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: Date.now(),
      };

      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
      };
      onUpdateConversation(finalConversation);

      setIsLoading(false);
      setIsStreaming(true);

      await sendMessage(
        message,
        (chunk) => {
          if (!controller.signal.aborted) {
            aiMessage.content += chunk;
            onUpdateConversation({
              ...finalConversation,
              messages: finalConversation.messages.map(m =>
                m.id === aiMessage.id ? aiMessage : m
              ),
            });
          }
        },
        controller.signal
      );

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Update the message to indicate it was stopped
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content += '\n\n_Generation stopped._';
          onUpdateConversation({
            ...conversation,
            messages: conversation.messages,
          });
        }
        return;
      }
      setError(error.message);
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
      setAbortController(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex-1 flex flex-col h-full">
	  <div className="flex-1 w-full overflow-y-auto space-y-4 py-4">
		{conversation?.messages.length === 0 ? (
			<div className="h-full flex flex-col items-center justify-center text-center px-4">
			<h1 className="text-4xl font-bold mb-8">How can I help you today?</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
				{suggestedQueries.map((query, index) => (
				<button
					key={index}
					onClick={() => {
					setMessage(query);
					}}
					className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				>
					{query}
				</button>
				))}
			</div>
			</div>
		) : (
			<>
			{conversation?.messages.map((msg) => (
				<div
				key={msg.id}
				className="flex justify-center w-full px-4"
				>
				<div
					className="group relative max-w-2xl w-full"
				>
					<div
					className={`rounded-lg p-3 ${
						msg.role === 'user'
						? 'bg-blue-500 text-white ml-auto'
						: 'bg-white dark:bg-gray-800 prose dark:prose-invert prose-sm'
					}`}
					style={{ maxWidth: '100%' }}
					>
					{msg.role === 'user' ? (
						msg.content
					) : (
						<div className="flex items-start">
						<RobotIcon />
						<div className="flex-1">
							<ReactMarkdown>{msg.content}</ReactMarkdown>
							<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={msg.content} />
						</div>
						</div>
						</div>
					)}
					</div>
				</div>
				</div>
			))}
			</>
		)}
          {isLoading && !isStreaming && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg p-3">
                {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
            <form onSubmit={handleSubmit} className="p-4 ">
      <div className="relative flex gap-2 justify-center items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Submit the form when Enter is pressed
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto"; // Reset height
            target.style.height = `${Math.min(target.scrollHeight, 160)}px`; // Grow up to 6.5 lines
          }}
          placeholder="Type your message here..."
          className="resize-none w-full max-w-2xl rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 p-3 pr-10 focus:ring focus:ring-blue-500 focus:outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
          style={{
            overflowY: "auto", // Scroll only when exceeding max height
            maxHeight: "160px", // Limit maximum height to 6.5 lines
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="absolute right-4 lg:right-48 p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
          style={{
            marginBottom: "8px",
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </form>

      </div>
    </ErrorBoundary>
  );
} 