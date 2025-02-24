
import { Trophy, Swords, Users } from "lucide-react";

interface BattleCardProps {
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  players: number;
  onJoin: () => void;
}

const DifficultyColor = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

const BattleCard = ({ difficulty, title, players, onJoin }: BattleCardProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-semibold ${DifficultyColor[difficulty]}`}>
            {difficulty}
          </span>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm text-gray-400">{players}/4</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-400">+100 XP</span>
          </div>
          <button
            onClick={onJoin}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center space-x-2 transition-colors"
          >
            <Swords className="w-4 h-4" />
            <span>Join Battle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleCard;
