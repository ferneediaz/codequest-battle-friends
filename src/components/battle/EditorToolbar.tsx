
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Send } from "lucide-react";
import { Language } from '@/types/battle';
import { LanguageSelector } from './LanguageSelector';

interface EditorToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
  onSubmit: () => void;
  isExecuting: boolean;
  currentOperation: 'run' | 'submit' | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  isExecuting,
  currentOperation
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-white">Code Editor</h3>
        <LanguageSelector 
          language={language}
          onLanguageChange={onLanguageChange}
        />
      </div>
      <div className="flex gap-4">
        <Button 
          className="gap-2"
          onClick={onRun}
          disabled={isExecuting}
        >
          <Play className="w-4 h-4" />
          {isExecuting && currentOperation === 'run' ? 'Running...' : 'Run Code'}
        </Button>
        <Button 
          variant="secondary" 
          className="gap-2"
          onClick={onSubmit}
          disabled={isExecuting}
        >
          <Send className="w-4 h-4" />
          {isExecuting && currentOperation === 'submit' ? 'Submitting...' : 'Submit Solution'}
        </Button>
      </div>
    </div>
  );
};
