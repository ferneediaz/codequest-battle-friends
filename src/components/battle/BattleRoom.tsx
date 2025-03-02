
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BattleRoomProps {
  currentRoom: string | null;
  setCurrentRoom: (room: string | null) => void;
  setCode: (code: string) => void;
  initialCode: string;
}

export function BattleRoom({ 
  currentRoom, 
  setCurrentRoom, 
  setCode, 
  initialCode 
}: BattleRoomProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = React.useState<string>("");

  const createBattleRoom = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a battle room",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select('id')
        .limit(1);

      if (questionError || !questions || questions.length === 0) {
        console.error('Error fetching question:', questionError);
        throw new Error('No questions available');
      }

      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .insert({
          room_code: newRoomCode,
          status: 'waiting',
          current_participants: 1,
          max_participants: 2,
          document_content: initialCode,
          min_rank: 'herald',
          max_rank: 'immortal',
          question_id: questions[0].id
        })
        .select()
        .single();

      if (battleError) {
        console.error('Error creating battle:', battleError);
        throw battleError;
      }

      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id,
          team: 'A',
          current_code: initialCode
        });

      if (participantError) {
        console.error('Error adding participant:', participantError);
        throw participantError;
      }

      setCurrentRoom(battleData.id);
      
      await navigator.clipboard.writeText(newRoomCode);
      
      toast({
        title: "Room Created Successfully! 🎉",
        description: `Room code ${newRoomCode} has been copied to your clipboard. Share it with your friend!`,
      });

    } catch (error: any) {
      console.error('Error creating room:', error);
      const errorMessage = error.message || "Failed to create room. Please try again.";
      
      await navigator.clipboard.writeText(
        `Error creating room: ${errorMessage}\nDetails: ${JSON.stringify(error, null, 2)}`
      );
      
      toast({
        title: "Error",
        description: errorMessage + " (Error details copied to clipboard)",
        variant: "destructive",
      });
    }
  };

  const joinBattleRoom = async (code: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a battle room",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!code) {
      toast({
        title: "Error",
        description: "Please enter a room code",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .select('*')
        .eq('room_code', code.toUpperCase())
        .single();

      if (battleError) throw new Error('Room not found');

      if (!battleData) {
        throw new Error('Room not found');
      }

      // Check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('battle_participants')
        .select('*')
        .eq('battle_id', battleData.id)
        .eq('user_id', user.id)
        .single();

      if (existingParticipant) {
        setCurrentRoom(battleData.id);
        toast({
          title: "Welcome back!",
          description: "You've rejoined the battle.",
        });
        return;
      }

      // Get current participants count directly from participants table
      const { count: participantsCount } = await supabase
        .from('battle_participants')
        .select('*', { count: 'exact' })
        .eq('battle_id', battleData.id);

      if (participantsCount && participantsCount >= (battleData.max_participants || 2)) {
        throw new Error('Room is full');
      }

      const { data: participantData } = await supabase
        .from('battle_participants')
        .select('current_code')
        .eq('battle_id', battleData.id)
        .single();

      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id,
          team: 'B',
          current_code: participantData?.current_code || initialCode
        });

      if (participantError) throw participantError;

      setCurrentRoom(battleData.id);
      
      if (participantData?.current_code) {
        setCode(participantData.current_code);
      }

      toast({
        title: "Joined Room Successfully! 🎉",
        description: "You've joined the battle. Good luck!",
      });

    } catch (error: any) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: error.message || "Invalid room code or room is full",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!currentRoom ? (
        <>
          <Button onClick={createBattleRoom} variant="outline">
            Create Room
          </Button>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              className="px-3 py-1 bg-black/30 border border-white/10 rounded text-white"
            />
            <Button onClick={() => joinBattleRoom(roomCode)} variant="outline">
              Join Room
            </Button>
          </div>
        </>
      ) : (
        <div className="text-white">
          Room Active
        </div>
      )}
    </div>
  );
}
