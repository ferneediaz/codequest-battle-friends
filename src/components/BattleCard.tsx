
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import QuestionSelectDialog from "./QuestionSelectDialog";

interface BattleCardProps {
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  players: number;
  minRank: string;
  maxRank: string;
  currentPlayers: string[];
  battleId?: string;
  onJoin?: () => void;
}

const BattleCard = ({
  difficulty,
  title,
  players,
  minRank,
  maxRank,
  currentPlayers,
  battleId,
}: BattleCardProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleJoinBattle = async () => {
    if (!user || !battleId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join a battle",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('battle_participants')
        .insert([
          {
            battle_id: battleId,
            user_id: user.id,
            team: 'B' // Joining user goes to team B
          }
        ]);

      if (error) throw error;

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

      if (battleError) throw battleError;
      console.log("Battle created:", battle);

      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert([
          {
            battle_id: battle.id,
            user_id: user.id,
            team: 'A' // Creator joins team A by default
          }
        ]);

      if (participantError) throw participantError;

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
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className={`text-sm font-semibold ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {currentPlayers.length}/{players}
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">
              {minRank} - {maxRank}
            </span>
          </div>
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
        </div>
      </div>

      <QuestionSelectDialog
        open={showQuestionDialog}
        onClose={() => setShowQuestionDialog(false)}
        onQuestionSelect={createBattle}
      />
    </>
  );
};

export default BattleCard;
