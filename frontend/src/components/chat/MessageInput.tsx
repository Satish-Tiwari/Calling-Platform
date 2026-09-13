import React, { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 px-4 py-3 bg-[#0e1626] border-t border-[#1f2d45] select-none shrink-0"
    >
      <div className="flex items-center gap-1.5 text-slate-400">
        <button
          type="button"
          className="p-1.5 hover:text-white rounded-xl hover:bg-slate-800 transition"
          title="Emojis"
        >
          <Smile size={19} />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white rounded-xl hover:bg-slate-800 transition"
          title="Attach files"
        >
          <Paperclip size={19} />
        </button>
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-2.5 bg-[#0a0f18] border border-[#1f2d45] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white transition shadow-md shadow-indigo-600/25 disabled:opacity-40"
          title="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};
