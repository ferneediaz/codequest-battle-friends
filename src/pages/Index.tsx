
import { useState } from "react";
import BattleCard from "@/components/BattleCard";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Crown } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [battles] = useState([
    { id: 1, difficulty: "Easy", title: "Forest of Arrays", players: 2 },
    { id: 2, difficulty: "Medium", title: "Dungeon of Objects", players: 1 },
    { id: 3, difficulty: "Hard", title: "Dragon's Algorithm Lair", players: 3 },
  ]);

  const handleJoinBattle = () => {
    toast({
      title: "Joining Battle",
      description: "Finding your perfect match...",
    });
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { title: "Active Battles", value: "24" },
            { title: "Online Warriors", value: "128" },
            { title: "Battles Won", value: "1.2K" },
          ].map((stat) => (
            <div
              key={stat.title}
              className="p-6 rounded-lg bg-white/5 border border-white/10 text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.title}</div>
            </div>
          ))}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
