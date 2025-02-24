
import { useState } from "react";
import BattleCard from "@/components/BattleCard";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Crown, Trophy, Star, Medal } from "lucide-react";

// Dota 2-inspired ranks
const RANKS = {
  immortal: { name: "Immortal", color: "#9b87f5", minMMR: 6000 },
  divine: { name: "Divine", color: "#7E69AB", minMMR: 5000 },
  ancient: { name: "Ancient", color: "#6E59A5", minMMR: 4000 },
  legend: { name: "Legend", color: "#8B5CF6", minMMR: 3000 },
  archon: { name: "Archon", color: "#D946EF", minMMR: 2000 },
  crusader: { name: "Crusader", color: "#F97316", minMMR: 1000 },
  guardian: { name: "Guardian", color: "#0EA5E9", minMMR: 500 },
  herald: { name: "Herald", color: "#33C3F0", minMMR: 0 },
};

const Index = () => {
  const { toast } = useToast();
  const [battles] = useState([
    { 
      id: 1, 
      difficulty: "Easy", 
      title: "Forest of Arrays", 
      players: 2,
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player1", "Player2"],
    },
    { 
      id: 2, 
      difficulty: "Medium", 
      title: "Dungeon of Objects", 
      players: 1,
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player3"],
    },
    { 
      id: 3, 
      difficulty: "Hard", 
      title: "Dragon's Algorithm Lair", 
      players: 3,
      minRank: "ancient",
      maxRank: "immortal",
      currentPlayers: ["Player4", "Player5", "Player6"],
    },
    { 
      id: 4, 
      difficulty: "Medium", 
      title: "Binary Search Castle", 
      players: 2,
      minRank: "legend",
      maxRank: "divine",
      currentPlayers: ["Player7", "Player8"],
    },
    { 
      id: 5, 
      difficulty: "Hard", 
      title: "Recursive Realm", 
      players: 1,
      minRank: "divine",
      maxRank: "immortal",
      currentPlayers: ["Player9"],
    },
    { 
      id: 6, 
      difficulty: "Easy", 
      title: "Linked List Garden", 
      players: 4,
      minRank: "herald",
      maxRank: "guardian",
      currentPlayers: ["Player10", "Player11", "Player12", "Player13"],
    },
  ]);

  const [userProfile] = useState({
    name: "CodeWarrior",
    rank: "legend",
    mmr: 3500,
    wins: 42,
    losses: 18,
  });

  const handleJoinBattle = () => {
    toast({
      title: "Joining Battle",
      description: "Finding your perfect match...",
    });
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "immortal":
        return <Crown className="w-6 h-6" style={{ color: RANKS.immortal.color }} />;
      case "divine":
      case "ancient":
        return <Star className="w-6 h-6" style={{ color: RANKS[rank].color }} />;
      case "legend":
      case "archon":
        return <Trophy className="w-6 h-6" style={{ color: RANKS[rank].color }} />;
      default:
        return <Medal className="w-6 h-6" style={{ color: RANKS[rank].color }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container px-4 py-16 mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            <Shield className="w-12 h-12 text-primary animate-float" />
            <Crown className="w-12 h-12 text-yellow-500 animate-float" style={{ animationDelay: "0.2s" }} />
            <Sword className="w-12 h-12 text-accent animate-float" style={{ animationDelay: "0.4s" }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            CodeQuest Battles
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Team up with fellow warriors and challenge others in epic coding battles.
            Use your skills wisely to claim victory!
          </p>
        </div>

        {/* User Profile Card */}
        <div className="mb-16 p-6 rounded-lg bg-black/30 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                {getRankIcon(userProfile.rank)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{userProfile.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: RANKS[userProfile.rank].color }}>
                    {RANKS[userProfile.rank].name}
                  </span>
                  <span className="text-sm text-gray-400">
                    MMR: {userProfile.mmr}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Win Rate</div>
              <div className="text-xl font-bold text-white">
                {Math.round((userProfile.wins / (userProfile.wins + userProfile.losses)) * 100)}%
              </div>
              <div className="text-sm text-gray-400">
                {userProfile.wins}W - {userProfile.losses}L
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { title: "Active Battles", value: "24", color: "from-blue-500 to-blue-600" },
            { title: "Online Warriors", value: "128", color: "from-green-500 to-green-600" },
            { title: "Battles Won", value: "1.2K", color: "from-purple-500 to-purple-600" },
          ].map((stat) => (
            <div
              key={stat.title}
              className="p-6 rounded-lg bg-gradient-to-r border border-white/10 text-center relative group overflow-hidden"
              style={{ background: `linear-gradient(to right, ${stat.color})` }}
            >
              <div className="relative z-10">
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80">{stat.title}</div>
              </div>
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Rank Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Rank Tiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(RANKS).map(([key, rank]) => (
              <div
                key={key}
                className="p-4 rounded-lg bg-black/30 border border-white/10 text-center"
                style={{ borderColor: rank.color }}
              >
                <div className="flex justify-center mb-2">
                  {getRankIcon(key)}
                </div>
                <div className="text-sm font-semibold" style={{ color: rank.color }}>
                  {rank.name}
                </div>
                <div className="text-xs text-gray-400">
                  {rank.minMMR}+ MMR
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Cards */}
        <h2 className="text-2xl font-bold text-white mb-8">Active Battles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {battles.map((battle) => (
            <BattleCard
              key={battle.id}
              difficulty={battle.difficulty as "Easy" | "Medium" | "Hard"}
              title={battle.title}
              players={battle.players}
              onJoin={handleJoinBattle}
              minRank={RANKS[battle.minRank].name}
              maxRank={RANKS[battle.maxRank].name}
              currentPlayers={battle.currentPlayers}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
