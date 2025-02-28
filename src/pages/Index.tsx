import { useState } from "react";
import { Button } from "@/components/ui/button";
import BattleCard from "@/components/BattleCard";
import QuestCard from "@/components/QuestCard";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Crown, Trophy, Star, Medal, Award, Skull, Flame, Zap, Brain, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const BATTLE_CATEGORIES = [
  "All Realms",
  "Forest of Arrays",
  "Hashmap Dungeons",
  "Binary Search Castle",
  "Linked List Gardens",
  "Tree of Wisdom",
  "Graph Adventures",
  "Dynamic Programming Peaks",
  "Stack & Queue Tavern",
  "Recursion Temple",
  "Sorting Sanctuary",
] as const;

const QUESTS = [
  {
    id: 1,
    title: "Battle Initiate",
    description: "Win your first coding battle",
    progress: 0,
    target: 1,
    reward: "Common Chest",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Battle Master",
    description: "Win 5 coding battles",
    progress: 2,
    target: 5,
    reward: "Rare Chest",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Code Warrior",
    description: "Complete 10 battles in different categories",
    progress: 3,
    target: 10,
    reward: "Epic Chest + Warrior Title",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Perfect Solver",
    description: "Complete a battle with a perfect score",
    progress: 0,
    target: 1,
    reward: "Legendary Item",
    isCompleted: false,
  },
];

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Realms");
  const [battles] = useState([
    { 
      id: 1, 
      difficulty: "Easy", 
      title: "Two Crystal Merger", 
      players: 4,
      category: "Forest of Arrays",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player1"],
    },
    { 
      id: 2, 
      difficulty: "Medium", 
      title: "Mystic Array Rotation", 
      players: 2,
      category: "Forest of Arrays",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player2"],
    },
    { 
      id: 3, 
      difficulty: "Hard", 
      title: "Crystal Matrix Challenge", 
      players: 3,
      category: "Forest of Arrays",
      minRank: "ancient",
      maxRank: "immortal",
      currentPlayers: ["Player3"],
    },
  ]);

  const handleCreateBattle = () => {
    toast({
      title: "Creating New Battle",
      description: "Opening battle creation form...",
    });
  };

  const handleJoinBattle = () => {
    toast({
      title: "Joining Battle",
      description: "Finding your perfect match...",
    });
  };

  const filteredBattles = battles.filter(
    battle => selectedCategory === "All Realms" || battle.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            CodeQuest Battles
          </h1>
          <p className="text-xl text-gray-400">
            Choose your battle and start coding!
          </p>
          <Button 
            onClick={handleCreateBattle}
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Battle
          </Button>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Available Battles</h2>
          <div className="w-64">
            <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue placeholder="Select a realm" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border border-white/10">
                {BATTLE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-800 cursor-pointer">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBattles.map((battle) => (
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
