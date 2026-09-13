import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  Phone,
  Users,
  Search,
  RefreshCw,
  UserPlus,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';
import { UserSwitcherModal } from './UserSwitcherModal';
import { GroupCallCreatorModal } from '../call/GroupCallCreatorModal';
import { User } from '../../types';

interface SidebarHeaderProps {
  activeTab: 'chats' | 'calls';
  setActiveTab: (tab: 'chats' | 'calls') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  missedCallsCount: number;
  availableUsers: User[];
  incomingRequestsCount: number;
  onOpenSettings: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  missedCallsCount,
  availableUsers,
  incomingRequestsCount,
  onOpenSettings,
}) => {
  const { user } = useAuth();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <div className="bg-[#0e1626] border-b border-[#1f2d45] select-none">
      {/* Brand & Profile Bar */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div
          onClick={onOpenSettings}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to view profile & settings"
        >
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.displayName}
              className="w-10 h-10 rounded-2xl object-cover border-2 border-indigo-500/50 group-hover:border-indigo-400 transition"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0e1626]"></span>
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition flex items-center gap-1.5">
              <span>{user?.displayName}</span>
            </p>
            <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-1.5">
          {/* New Group Call Button */}
          {availableUsers.length > 1 && (
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
              title="Start a Group Conference"
            >
              <Users size={14} />
              <span className="hidden sm:inline">Group</span>
            </button>
          )}

          {/* Settings & Friends Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#141e30] hover:bg-[#1a263c] text-slate-400 hover:text-white border border-[#1f2d45] transition relative"
            title="Settings, Friends & Profile"
          >
            <SettingsIcon size={16} />
            {incomingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {incomingRequestsCount}
              </span>
            )}
          </button>

          {/* Quick Demo Switcher */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="p-2 rounded-xl bg-[#141e30] hover:bg-[#1a263c] text-slate-400 hover:text-white border border-[#1f2d45] transition"
            title="Switch User Profile"
          >
            <Sparkles size={15} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-1 pb-2.5 gap-2">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'chats'
              ? 'bg-[#182338] text-white border border-indigo-500/40 shadow-sm'
              : 'bg-transparent text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <MessageSquare size={14} />
          <span>Friends & Chats ({availableUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition relative ${
            activeTab === 'calls'
              ? 'bg-[#182338] text-white border border-indigo-500/40 shadow-sm'
              : 'bg-transparent text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <Phone size={14} />
          <span>Call History</span>
          {missedCallsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {missedCallsCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="px-3 pb-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'chats' ? 'Search friends...' : 'Search call history...'}
            className="w-full pl-9 pr-3 py-2 bg-[#0a0f18] border border-[#1f2d45] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <UserSwitcherModal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
      <GroupCallCreatorModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        users={availableUsers}
      />
    </div>
  );
};
