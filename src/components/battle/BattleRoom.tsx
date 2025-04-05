
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BattleRole } from "@/types/battle";
import { toast } from "sonner";

interface BattleRoomProps {
  currentRoom: string | null;
  setCurrentRoom: (room: string | null) => void;
  setCode: (code: string) => void;
  initialCode: string;
  userRole: BattleRole;
  setUserRole: (role: BattleRole) => void;
  participants: { userId: string, role: BattleRole }[];
  setParticipants: (participants: { userId: string, role: BattleRole }[]) => void;
}

export function BattleRoom({ 
  currentRoom, 
  setCurrentRoom, 
  setCode, 
  initialCode,
  userRole,
  setUserRole,
  participants,
  setParticipants
}: BattleRoomProps) {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState<string>("");
  const [commMode, setCommMode] = useState<boolean>(false);

  const createBattleRoom = async () => {
    try {
      if (!user) {
        uiToast({
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
          question_id: questions[0].id,
          comm_challenge: commMode
        })
        .select()
        .single();

      if (battleError) {
        console.error('Error creating battle:', battleError);
        throw battleError;
      }

      // For communication mode, set creator as explainer
      const userRole: BattleRole = commMode ? 'explainer' : null;
      
      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id,
          team: 'A',
          current_code: initialCode,
          role: userRole
        });

      if (participantError) {
        console.error('Error adding participant:', participantError);
        throw participantError;
      }

      setCurrentRoom(battleData.id);
      
      if (commMode) {
        setUserRole('explainer');
        setParticipants([{ userId: user.id, role: 'explainer' }]);
        
        toast.success("Communication Challenge Mode Activated", {
          description: "You are the explainer. Your teammate won't see the problem description!"
        });
      }
      
      await navigator.clipboard.writeText(newRoomCode);
      
      uiToast({
        title: "Room Created Successfully! 🎉",
        description: `Room code ${newRoomCode} has been copied to your clipboard. Share it with your friend!`,
      });

    } catch (error: any) {
      console.error('Error creating room:', error);
      const errorMessage = error.message || "Failed to create room. Please try again.";
      
      await navigator.clipboard.writeText(
        `Error creating room: ${errorMessage}\nDetails: ${JSON.stringify(error, null, 2)}`
      );
      
      uiToast({
        title: "Error",
        description: errorMessage + " (Error details copied to clipboard)",
        variant: "destructive",
      });
    }
  };

  const joinBattleRoom = async (code: string) => {
    if (!user) {
      uiToast({
        title: "Authentication Required",
        description: "Please sign in to join a battle room",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!code) {
      uiToast({
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
        setUserRole(existingParticipant.role as BattleRole);
        
        uiToast({
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

      // Fix: check if current participants is less than max participants
      if (participantsCount && participantsCount >= 2) {
        throw new Error('Room is full');
      }

      // Get data from the first participant
      const { data: participantData, error: participantDataError } = await supabase
        .from('battle_participants')
        .select('current_code, role')
        .eq('battle_id', battleData.id)
        .single();
      
      if (participantDataError) {
        console.error('Error getting participant data:', participantDataError);
      }
      
      // If this is a communication challenge room, set second user as coder
      let newUserRole: BattleRole = null;
      if (battleData.comm_challenge) {
        newUserRole = 'coder';
      }

      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id,
          team: 'B',
          current_code: participantData?.current_code || initialCode,
          role: newUserRole
        });

      if (participantError) throw participantError;

      setCurrentRoom(battleData.id);
      
      if (participantData?.current_code) {
        setCode(participantData.current_code);
      }
      
      // If communication challenge, update roles for all participants
      if (battleData.comm_challenge && newUserRole) {
        setUserRole(newUserRole);
        
        // Get all participants and their roles
        const { data: allParticipants } = await supabase
          .from('battle_participants')
          .select('user_id, role')
          .eq('battle_id', battleData.id);
          
        if (allParticipants) {
          const formattedParticipants = allParticipants.map(p => ({
            userId: p.user_id,
            role: p.role as BattleRole
          }));
          
          setParticipants(formattedParticipants);
          
          // Broadcast roles to all participants
          await supabase.channel(`battle:${battleData.id}:roles`).send({
            type: 'broadcast',
            event: 'role_assigned',
            payload: { participants: formattedParticipants }
          });
          
          toast.success("Communication Challenge Mode", {
            description: "You are the coder. Your teammate will explain the problem to you!"
          });
        }
      }

      uiToast({
        title: "Joined Room Successfully! 🎉",
        description: "You've joined the battle. Good luck!",
      });

    } catch (error: any) {
      console.error('Error joining room:', error);
      uiToast({
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
          <div className="flex items-center gap-2 mr-4">
            <Button 
              variant={commMode ? "default" : "outline"}
              onClick={() => setCommMode(!commMode)}
              className="flex items-center gap-2"
            >
              <MessageCircleIcon className="w-4 h-4" />
              Communication Mode
            </Button>
            {commMode && (
              <div className="text-xs text-primary">
                Only you will see the problem description
              </div>
            )}
          </div>
          
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
        <div className="flex items-center gap-2 text-white">
          <div className="px-3 py-1 bg-primary/20 rounded">
            Room Active
          </div>
          {userRole && (
            <div className="flex items-center gap-1 px-3 py-1 bg-accent/20 rounded">
              {userRole === 'explainer' ? (
                <>
                  <MessageCircleIcon className="w-4 h-4" />
                  <span>Explainer</span>
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  <span>Coder</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
