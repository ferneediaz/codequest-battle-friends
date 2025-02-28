
import BattleCardHeader from "./battle-card/BattleCardHeader";
import BattleCardContent from "./battle-card/BattleCardContent";
import BattleCardActions from "./battle-card/BattleCardActions";

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
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <BattleCardHeader
          difficulty={difficulty}
          players={players}
          currentPlayers={currentPlayers}
        />
        <BattleCardContent
          title={title}
          minRank={minRank}
          maxRank={maxRank}
        />
        <BattleCardActions
          battleId={battleId}
          players={players}
          currentPlayers={currentPlayers}
        />
      </div>
    </div>
  );
};

export default BattleCard;
