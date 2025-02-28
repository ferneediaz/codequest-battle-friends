
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

    const fetchBattle = async () => {
      try {
        const { data: battleData, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();

        if (battleError) throw battleError;
        setBattle(battleData as Battle);

        const { data: participantsData, error: participantsError } = await supabase
          .from('battle_participants')
          .select('*')
          .eq('battle_id', battleId);

        if (participantsError) throw participantsError;
        
        // Cast the team value to 'A' | 'B' since we know it's valid from our DB constraints
        const typedParticipants = participantsData.map(p => ({
          ...p,
          team: p.team as 'A' | 'B'
        }));
        
        setParticipants(typedParticipants);

        const userParticipant = typedParticipants.find(p => p.user_id === user.id);
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
        (payload: any) => {
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
        (payload: any) => {
          if (!payload.new) return;
          
          setParticipants(prev => {
            const updated = [...prev];
            const newParticipant = {
              ...payload.new,
              team: payload.new.team as 'A' | 'B'
            };
            const index = updated.findIndex(p => p.id === newParticipant.id);
            if (index >= 0) {
              updated[index] = newParticipant;
            } else {
              updated.push(newParticipant);
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
