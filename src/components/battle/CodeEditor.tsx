import React from 'react';
import { Language } from '@/types/battle';
import { LanguageSelector } from './LanguageSelector';
import { TokenizedCode } from './TokenizedCode';
import { Button } from "@/components/ui/button";
import { Play, Send } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  currentRoom: string | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onLanguageChange,
  onChange,
  onKeyDown,
  textareaRef
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Code Editor</h3>
            <LanguageSelector 
              language={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
          <div className="flex gap-4">
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              Run Code
            </Button>
            <Button variant="secondary" className="gap-2">
              <Send className="w-4 h-4" />
              Submit Solution
            </Button>
          </div>
        </div>
        <div className="relative w-full h-[500px]">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="absolute inset-0 w-full h-full bg-[#1E1E1E] font-mono p-4 text-[#D4D4D4] text-sm leading-6 resize-none outline-none"
            style={{ 
              tabSize: 2,
              color: 'transparent',
              caretColor: '#D4D4D4',
              whiteSpace: 'pre',
              fontFamily: 'monospace'
            }}
          />
          <TokenizedCode code={code} />
        </div>
      </div>
    </div>
  );
};
