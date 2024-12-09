"use client";

import React from "react";
import { Conversation } from "@/types";
import { PlusCircle, Menu, Pin, Trash2 } from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onUpdateConversations: (conversations: Conversation[]) => void;
  onDeleteConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
}

export default function Sidebar({ 
  conversations,
  selectedConversation, 
  onSelectConversation,
  onUpdateConversations,
  onDeleteConversation,
  onPinConversation
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <div className={`border-r border-gray-200 dark:border-gray-800 ${
      isCollapsed ? 'w-16' : 'w-64'
    } transition-all duration-200`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && <h2 className="text-lg font-semibold">Chats</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <button
          onClick={() => {
            const newConversation: Conversation = {
              id: Date.now().toString(),
              title: "New Chat",
              messages: [],
              createdAt: Date.now(),
              updatedAt: Date.now()
            };
            onUpdateConversations([...conversations, newConversation]);
            onSelectConversation(newConversation);
          }}
          className="flex items-center justify-center w-full p-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <PlusCircle size={16} className="mr-2" />
          {!isCollapsed && "New Chat"}
        </button>
      </div>

      <div className="overflow-y-auto">
        {sortedConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedConversation?.id === conversation.id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <button
              onClick={() => onSelectConversation(conversation)}
              className="flex-1 text-left truncate"
            >
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  {conversation.pinned && <Pin size={12} />}
                  <span className="truncate">{conversation.title}</span>
                </div>
              )}
            </button>
            {!isCollapsed && (
              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={() => onPinConversation(conversation.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Pin size={14} className={conversation.pinned ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={() => onDeleteConversation(conversation.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 