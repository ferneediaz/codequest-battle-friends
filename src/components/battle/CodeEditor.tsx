
import React, { useRef } from 'react';
import { Language, Token } from '@/types/battle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  let currentToken = '';

  const addToken = (type?: Token['type']) => {
    if (currentToken) {
      tokens.push({ text: currentToken, type });
      currentToken = '';
    }
  };

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if ((char === '/' && line[i + 1] === '/') || char === '#') {
      addToken();
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    if (char === '"') {
      addToken();
      let stringContent = char;
      i++;
      while (i < line.length && line[i] !== '"') {
        stringContent += line[i];
        i++;
      }
      if (i < line.length) stringContent += line[i];
      tokens.push({ text: stringContent, type: 'string' });
      continue;
    }

    if (/\w/.test(char)) {
      currentToken += char;
    } else {
      if (currentToken) {
        if (/^(function|class|return|const|let|var|for|if|in|of|public|include|vector)$/.test(currentToken)) {
          addToken('keyword');
        } else if (/^(Map|unordered_map|vector|int|void)$/.test(currentToken)) {
          addToken('type');
        } else if (/^(solution|enumerate|find|size|has|get|set)$/.test(currentToken)) {
          addToken('function');
        } else if (/^\d+$/.test(currentToken)) {
          addToken('number');
        } else {
          addToken();
        }
      }
      tokens.push({ text: char });
      currentToken = '';
    }
  }

  if (currentToken) {
    if (/^(function|class|return|const|let|var|for|if|in|of|public|include|vector)$/.test(currentToken)) {
      addToken('keyword');
    } else if (/^(Map|unordered_map|vector|int|void)$/.test(currentToken)) {
      addToken('type');
    } else if (/^(solution|enumerate|find|size|has|get|set)$/.test(currentToken)) {
      addToken('function');
    } else if (/^\d+$/.test(currentToken)) {
      addToken('number');
    } else {
      addToken();
    }
  }

  return tokens;
};

const getTokenColor = (type?: Token['type']): string => {
  switch (type) {
    case 'comment': return '#6A9955';
    case 'keyword': return '#C586C0';
    case 'type': return '#4EC9B0';
    case 'function': return '#DCDCAA';
    case 'string': return '#CE9178';
    case 'number': return '#B5CEA8';
    default: return '#D4D4D4';
  }
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onLanguageChange,
  onChange,
  onKeyDown,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Code Editor</h3>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[140px] bg-black/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border border-white/10">
                <SelectItem value="javascript" className="text-white hover:bg-gray-800">JavaScript</SelectItem>
                <SelectItem value="python" className="text-white hover:bg-gray-800">Python</SelectItem>
                <SelectItem value="cpp" className="text-white hover:bg-gray-800">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="px-4 py-2 bg-muted hover:bg-muted/90 text-muted-foreground rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
              onClick={onRun}
              disabled={isRunning || isSubmitting}
            >
              <svg className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button 
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
              onClick={onSubmit}
              disabled={isRunning || isSubmitting}
            >
              <Check className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        <div className="relative w-full h-[500px]">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
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
          <div
            className="absolute inset-0 w-full h-full pointer-events-none font-mono p-4 text-sm leading-6"
            style={{
              whiteSpace: 'pre',
              fontFamily: 'monospace'
            }}
          >
            {code.split('\n').map((line, i) => (
              <div key={i} className="relative">
                {tokenizeLine(line).map((token, j) => (
                  <span
                    key={`${i}-${j}`}
                    style={{ color: getTokenColor(token.type) }}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
