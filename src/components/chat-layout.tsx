import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ChatArea from "./chat-area";
import SettingsPanel from "./settings-panel";
import { Conversation } from "@/types";
import { loadConversations, saveConversations } from "@/lib/storage";
import { Settings } from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function ChatLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load conversations when the component mounts
    const savedConversations = loadConversations();
    setConversations(savedConversations);
    if (savedConversations.length > 0) {
      setSelectedConversation(savedConversations[0]);
    }
  }, []);

  const handleUpdateConversation = (updatedConversation: Conversation) => {
    const newConversations = conversations.map((conv) =>
      conv.id === updatedConversation.id ? updatedConversation : conv
    );
    setConversations(newConversations);
    saveConversations(newConversations);
    setSelectedConversation(updatedConversation);
  };

  const handleDeleteConversation = (id: string) => {
    const newConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(newConversations);
    saveConversations(newConversations);
    if (selectedConversation?.id === id) {
      setSelectedConversation(newConversations[0] || null);
    }
  };

  const handlePinConversation = (id: string) => {
    const newConversations = conversations.map((conv) =>
      conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
    );
    setConversations(newConversations);
    saveConversations(newConversations);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } flex-shrink-0`}
      >
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onUpdateConversations={(convs: Conversation[]) => {
            setConversations(convs);
            saveConversations(convs);
          }}
          onDeleteConversation={handleDeleteConversation}
          onPinConversation={handlePinConversation}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {selectedConversation?.title || "New Chat"}
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <ChatArea
            conversation={selectedConversation}
            onUpdateConversation={handleUpdateConversation}
          />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
