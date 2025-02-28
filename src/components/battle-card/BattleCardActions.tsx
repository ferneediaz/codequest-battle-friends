
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import QuestionSelectDialog from "../QuestionSelectDialog";

interface BattleCardActionsProps {
  battleId?: string;
  players: number;
  currentPlayers: string[];
}

const BattleCardActions = ({
  battleId,
  players,
  currentPlayers,
}: BattleCardActionsProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinBattle = async () => {
    if (!user) {
      console.log("No user found, redirecting to auth");
      toast({
        title: "Authentication Required",
        description: "Please log in to join a battle",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!battleId) {
      console.error("No battleId provided");
      return;
    }

    // Check if user is already in the battle
    const { data: existingParticipant } = await supabase
      .from('battle_participants')
      .select('*')
      .eq('battle_id', battleId)
      .eq('user_id', user.id)
      .single();

    if (existingParticipant) {
      console.log("User already in battle");
      navigate(`/battle?battleId=${battleId}`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('battle_participants')
        .insert([
          {
            battle_id: battleId,
            user_id: user.id,
            team: 'B' // Joining user goes to team B
          }
        ])
        .select();

      if (error) {
        console.error("Join battle error:", error);
        throw error;
      }

      console.log("Successfully joined battle:", data);
      navigate(`/battle?battleId=${battleId}`);
    } catch (error: any) {
      console.error("Join battle error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createBattle = async (questionId: string) => {
    if (!user) {
      console.log("No user found, redirecting to auth");
      toast({
        title: "Authentication Required",
        description: "Please log in to create a battle",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      setIsCreating(true);
      console.log("Creating battle with question:", questionId);
      console.log("Current user:", user);

      // First create the battle
      const { data: battle, error: battleError } = await supabase
        .from('battles')
        .insert([
          {
            question_id: questionId,
            max_participants: players,
            current_participants: 1,
            status: 'waiting',
            team_a_score: 0,
            team_b_score: 0
          }
        ])
        .select()
        .single();

      if (battleError) {
        console.error("Battle creation error:", battleError);
        throw battleError;
      }

      console.log("Battle created:", battle);

      // Then add the creator as a participant
      const { data: participant, error: participantError } = await supabase
        .from('battle_participants')
        .insert([
          {
            battle_id: battle.id,
            user_id: user.id,
            team: 'A' // Creator joins team A by default
          }
        ])
        .select();

      if (participantError) {
        console.error("Participant creation error:", participantError);
        throw participantError;
      }

      console.log("Participant added:", participant);

      toast({
        title: "Battle Created",
        description: "Redirecting to battle room...",
      });

      navigate(`/battle?battleId=${battle.id}`);
    } catch (error: any) {
      console.error("Create battle error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
      setShowQuestionDialog(false);
    }
  };

  return (
    <>
      {battleId ? (
        <Button
          className="w-full"
          onClick={handleJoinBattle}
          disabled={currentPlayers.length >= players}
        >
          {currentPlayers.length >= players ? "Battle Full" : "Join Battle"}
        </Button>
      ) : (
        <Button
          className="w-full"
          onClick={() => setShowQuestionDialog(true)}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Battle"}
        </Button>
      )}

      <QuestionSelectDialog
        open={showQuestionDialog}
        onClose={() => setShowQuestionDialog(false)}
        onQuestionSelect={createBattle}
      />
    </>
  );
};

export default BattleCardActions;
