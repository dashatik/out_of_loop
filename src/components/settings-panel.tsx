"use client";

import React from "react";
import { X, LogOut } from "lucide-react";
import { UserSettings } from "@/types";
import { loadSettings, saveSettings } from "@/lib/storage";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = React.useState<UserSettings>(loadSettings());
  const [isDirty, setIsDirty] = React.useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setIsDirty(false);
    onClose(); // Close the panel after saving
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Redirect to landing page after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleChange = (key: keyof UserSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">API Key</label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Model</label>
          <select
            value={settings.model}
            onChange={(e) => handleChange("model", e.target.value)}
            className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="w-full p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600"
        >
          Save Changes
        </button>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
