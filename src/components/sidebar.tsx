"use client";

import React, { useState } from "react";
import { Conversation } from "@/types";
import { PlusCircle, Menu, Pin, Trash2, Edit2, Check, X } from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onUpdateConversations: (conversations: Conversation[]) => void;
  onDeleteConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
  isCollapsed: boolean; // Use this prop to control collapse state
  onToggleCollapse: () => void; // Callback to toggle collapse state
}

export default function Sidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onUpdateConversations,
  onDeleteConversation,
  onPinConversation,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  const sortedConversations = React.useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [conversations]);

  const handleRenameConversation = (id: string) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === id ? { ...conv, title: newTitle || conv.title } : conv
    );
    onUpdateConversations(updatedConversations);
    setEditingId(null);
    setNewTitle("");
  };

  return (
    <div
      className={`h-full transition-all duration-300 overflow-hidden ${
        isCollapsed
          ? "w-16" // Collapsed Width
          : "w-64 border-r border-gray-200 dark:border-gray-800" // Expanded Width with Border
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && <h2 className="text-lg font-semibold">Chats</h2>}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={() => {
                const newConversation: Conversation = {
                  id: Date.now().toString(),
                  title: "New Chat",
                  messages: [],
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                };
                onUpdateConversations([...conversations, newConversation]);
                onSelectConversation(newConversation);
              }}
              className="flex items-center justify-center w-full p-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <PlusCircle size={16} className="mr-2" />
              New Chat
            </button>
          </div>

          {/* Conversations List */}
          <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
            {sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
				{editingId === conversation.id ? (
				<input
					type="text"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleRenameConversation(conversation.id); // Save on Enter
					} else if (e.key === "Escape") {
						setEditingId(null); // Cancel on Escape
						setNewTitle("");
					}
					}}
					onBlur={() => {
					handleRenameConversation(conversation.id); // Save on blur
					}}
					placeholder="Enter new title"
					className="flex-1 p-1 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 w-full max-w-full text-sm"
					autoFocus
				/>
				) : (
				<button
					onDoubleClick={() => {
					setEditingId(conversation.id); // Enable edit mode on double-click
					setNewTitle(conversation.title); // Populate input with the current title
					}}
					className="flex-1 text-left truncate"
				>
					<div className="flex items-center gap-2">
					{conversation.pinned && <Pin size={12} />}
					<span className="truncate">{conversation.title}</span>
					</div>
				</button>
				)}
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => setEditingId(conversation.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onPinConversation(conversation.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Pin
                      size={14}
                      className={conversation.pinned ? "fill-current" : ""}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteConversation(conversation.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

