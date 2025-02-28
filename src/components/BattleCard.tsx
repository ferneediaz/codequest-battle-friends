
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface BattleCardProps {
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  players: number;
  onJoin?: () => void;
  minRank: string;
  maxRank: string;
  currentPlayers: string[];
}

const BattleCard = ({
  difficulty,
  title,
  players,
  minRank,
  maxRank,
  currentPlayers,
}: BattleCardProps) => {
  const [isCreating, setIsCreating] = useState(false);
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

  const createBattle = async () => {
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

      // First, create the battle
      const { data: battle, error: battleError } = await supabase
        .from('battles')
        .insert([
          {
            question_id: '123', // You should replace this with actual question ID selection
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

      // Then, add the creator as the first participant
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

      // Redirect to the battle page
      navigate(`/battle?battleId=${battle.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
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
        <Button
          className="w-full"
          onClick={createBattle}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Battle"}
        </Button>
      </div>
    </div>
  );
};

export default BattleCard;
