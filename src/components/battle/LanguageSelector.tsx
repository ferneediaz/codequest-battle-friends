
import React from 'react';
import { Language } from '@/types/battle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  language, 
  onLanguageChange 
}) => {
  return (
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
  );
};
