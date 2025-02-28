
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Battle, BattleParticipant } from '@/types/battle';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useBattle(battleId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [userTeam, setUserTeam] = useState<'A' | 'B' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch battle and participants
    const fetchBattle = async () => {
      try {
        const { data: battleData, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();

        if (battleError) throw battleError;
        setBattle(battleData);

        const { data: participantsData, error: participantsError } = await supabase
          .from('battle_participants')
          .select('*')
          .eq('battle_id', battleId);

        if (participantsError) throw participantsError;
        setParticipants(participantsData);

        const userParticipant = participantsData.find(p => p.user_id === user.id);
        if (userParticipant) {
          setUserTeam(userParticipant.team);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBattle();

    // Subscribe to real-time updates
    const battleSubscription = supabase
      .channel('battle_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battles',
          filter: `id=eq.${battleId}`,
        },
        (payload) => {
          setBattle(payload.new as Battle);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battle_participants',
          filter: `battle_id=eq.${battleId}`,
        },
        (payload) => {
          setParticipants(prev => {
            const updated = [...prev];
            const index = updated.findIndex(p => p.id === payload.new.id);
            if (index >= 0) {
              updated[index] = payload.new;
            } else {
              updated.push(payload.new);
            }
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(battleSubscription);
    };
  }, [battleId, user]);

  const updateCode = async (code: string) => {
    if (!user || !userTeam) return;

    try {
      const { error } = await supabase
        .from('battle_participants')
        .update({ current_code: code })
        .eq('battle_id', battleId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    battle,
    participants,
    userTeam,
    loading,
    updateCode,
  };
}
