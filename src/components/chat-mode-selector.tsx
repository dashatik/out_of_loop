"use client";

import React from "react";
import { chatModes } from "@/config/chat-modes";

interface ChatModeSelectorProps {
  onSelectMode: (modeId: string) => void;
  onClose: () => void;
}

export default function ChatModeSelector({ onSelectMode, onClose }: ChatModeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Select Chat Mode</h2>
        <div className="grid grid-cols-2 gap-4">
          {chatModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                onSelectMode(mode.id);
                onClose();
              }}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{mode.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-4">
            <button
                onClick={onClose}
                className="p-2 w-28 border border-red-700 rounded-lg bg-red-700 text-white dark:text-white hover:bg-red-800"
            >
                Cancel
            </button>
            </div>
      </div>
    </div>
  );
}
