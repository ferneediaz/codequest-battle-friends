
import { Shield, Users } from "lucide-react";

interface BattleCardHeaderProps {
  difficulty: "Easy" | "Medium" | "Hard";
  players: number;
  currentPlayers: string[];
}

const BattleCardHeader = ({
  difficulty,
  players,
  currentPlayers,
}: BattleCardHeaderProps) => {
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

  return (
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
  );
};

export default BattleCardHeader;
