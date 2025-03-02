
import { useState, useEffect } from 'react';
import { Language } from '@/types/battle';
import { supabase } from '@/integrations/supabase/client';
import { ViewUpdate } from '@codemirror/view';

export function useCodeEditor(currentRoom: string | null, userId: string | undefined) {
  const [code, setCode] = useState("");

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

  // New change handler for CodeMirror
  const handleCodeChange = (value: string, viewUpdate?: ViewUpdate) => {
    setCode(value);
    if (currentRoom) {
      broadcastCodeUpdate(value);
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
    handleCodeChange
  };
}
