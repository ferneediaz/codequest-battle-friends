
import { useState, useRef, useEffect } from 'react';
import { Language } from '@/types/battle';
import { supabase } from '@/integrations/supabase/client';

export function useCodeEditor(currentRoom: string | null, userId: string | undefined) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const broadcastCodeUpdate = async (newCode: string) => {
    if (!currentRoom || !userId) return;

    try {
      await supabase
        .from('battle_participants')
        .update({ current_code: newCode })
        .eq('battle_id', currentRoom)
        .eq('user_id', userId);

      await supabase.channel(`battle:${currentRoom}`).send({
        type: 'broadcast',
        event: 'code_update',
        payload: { code: newCode, userId }
      });
    } catch (error) {
      console.error('Error broadcasting code update:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd } = textarea;
      const currentValue = textarea.value;
      
      const newValue = 
        currentValue.substring(0, selectionStart) + 
        "  " + 
        currentValue.substring(selectionEnd);
      
      setCode(newValue);
      
      const newCursorPos = selectionStart + 2;
      
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    }

    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCode(history[newIndex]);
      }
    }

    if ((e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey)) || 
        (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCode(history[newIndex]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (newCode !== history[history.length - 1]) {
      setHistory([...history, newCode]);
      setHistoryIndex(history.length);
    }
    
    if (currentRoom) {
      broadcastCodeUpdate(newCode);
    }
  };

  useEffect(() => {
    if (currentRoom) {
      const channel = supabase.channel(`battle:${currentRoom}`)
        .on('broadcast', { event: 'code_update' }, ({ payload }) => {
          if (payload.userId !== userId) {
            setCode(payload.code);
          }
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [currentRoom, userId]);

  return {
    code,
    setCode,
    textareaRef,
    handleKeyDown,
    handleChange
  };
}
