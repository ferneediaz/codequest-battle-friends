import { useState } from "react";
import BattleCard from "@/components/BattleCard";
import QuestCard from "@/components/QuestCard";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Crown, Trophy, Star, Medal } from "lucide-react";
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
    
    { 
      id: 4, 
      difficulty: "Easy", 
      title: "Treasure Map Decoder", 
      players: 2,
      category: "Hashmap Dungeons",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player4"],
    },
    { 
      id: 5, 
      difficulty: "Medium", 
      title: "Potion Ingredients Counter", 
      players: 3,
      category: "Hashmap Dungeons",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player5"],
    },
    { 
      id: 6, 
      difficulty: "Hard", 
      title: "Magical Items Inventory", 
      players: 4,
      category: "Hashmap Dungeons",
      minRank: "ancient",
      maxRank: "divine",
      currentPlayers: ["Player6"],
    },

    { 
      id: 7, 
      difficulty: "Easy", 
      title: "Castle Guard Search", 
      players: 2,
      category: "Binary Search Castle",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player7"],
    },
    { 
      id: 8, 
      difficulty: "Medium", 
      title: "Royal Treasury Quest", 
      players: 3,
      category: "Binary Search Castle",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player8"],
    },
    { 
      id: 9, 
      difficulty: "Hard", 
      title: "Dragon's Lair Search", 
      players: 4,
      category: "Binary Search Castle",
      minRank: "legend",
      maxRank: "immortal",
      currentPlayers: ["Player9"],
    },

    { 
      id: 10, 
      difficulty: "Easy", 
      title: "Garden Path Traversal", 
      players: 2,
      category: "Linked List Gardens",
      minRank: "herald",
      maxRank: "guardian",
      currentPlayers: ["Player10"],
    },
    { 
      id: 11, 
      difficulty: "Medium", 
      title: "Enchanted Garden Cycle", 
      players: 3,
      category: "Linked List Gardens",
      minRank: "crusader",
      maxRank: "archon",
      currentPlayers: ["Player11"],
    },
    { 
      id: 12, 
      difficulty: "Hard", 
      title: "Magical Garden Merge", 
      players: 4,
      category: "Linked List Gardens",
      minRank: "legend",
      maxRank: "divine",
      currentPlayers: ["Player12"],
    },

    { 
      id: 13, 
      difficulty: "Easy", 
      title: "Sacred Tree Path", 
      players: 2,
      category: "Tree of Wisdom",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player13"],
    },
    { 
      id: 14, 
      difficulty: "Medium", 
      title: "Wisdom Tree Balance", 
      players: 3,
      category: "Tree of Wisdom",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player14"],
    },
    { 
      id: 15, 
      difficulty: "Hard", 
      title: "Ancient Tree Transformation", 
      players: 4,
      category: "Tree of Wisdom",
      minRank: "ancient",
      maxRank: "immortal",
      currentPlayers: ["Player15"],
    },

    { 
      id: 16, 
      difficulty: "Easy", 
      title: "Village Connections", 
      players: 2,
      category: "Graph Adventures",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player16"],
    },
    { 
      id: 17, 
      difficulty: "Medium", 
      title: "Enchanted Path Finder", 
      players: 3,
      category: "Graph Adventures",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player17"],
    },
    { 
      id: 18, 
      difficulty: "Hard", 
      title: "Magical Network Flow", 
      players: 4,
      category: "Graph Adventures",
      minRank: "ancient",
      maxRank: "immortal",
      currentPlayers: ["Player18"],
    },

    { 
      id: 19, 
      difficulty: "Easy", 
      title: "Mountain Treasure Path", 
      players: 2,
      category: "Dynamic Programming Peaks",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player19"],
    },
    { 
      id: 20, 
      difficulty: "Medium", 
      title: "Dragon's Gold Distribution", 
      players: 3,
      category: "Dynamic Programming Peaks",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player20"],
    },
    { 
      id: 21, 
      difficulty: "Hard", 
      title: "Legendary Quest Optimizer", 
      players: 4,
      category: "Dynamic Programming Peaks",
      minRank: "ancient",
      maxRank: "immortal",
      currentPlayers: ["Player21"],
    },

    { 
      id: 22, 
      difficulty: "Easy", 
      title: "Tavern Order System", 
      players: 2,
      category: "Stack & Queue Tavern",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player22"],
    },
    { 
      id: 23, 
      difficulty: "Medium", 
      title: "Potion Brewing Queue", 
      players: 3,
      category: "Stack & Queue Tavern",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player23"],
    },
    { 
      id: 24, 
      difficulty: "Hard", 
      title: "Enchanted Stack Challenge", 
      players: 4,
      category: "Stack & Queue Tavern",
      minRank: "ancient",
      maxRank: "divine",
      currentPlayers: ["Player24"],
    },

    { 
      id: 25, 
      difficulty: "Easy", 
      title: "Temple Maze Explorer", 
      players: 2,
      category: "Recursion Temple",
      minRank: "guardian",
      maxRank: "crusader",
      currentPlayers: ["Player25"],
    },
    { 
      id: 26, 
      difficulty: "Medium", 
      title: "Mystical Pattern Builder", 
      players: 3,
      category: "Recursion Temple",
      minRank: "archon",
      maxRank: "legend",
      currentPlayers: ["Player26"],
    },
    { 
      id: 27, 
      difficulty: "Hard", 
      title: "Ancient Puzzle Solver", 
      players: 4,
      category: "Recursion Temple",
      minRank: "legend",
      maxRank: "immortal",
      currentPlayers: ["Player27"],
    },

    { 
      id: 28, 
      difficulty: "Easy", 
      title: "Crystal Sorter", 
      players: 2,
      category: "Sorting Sanctuary",
      minRank: "herald",
      maxRank: "guardian",
      currentPlayers: ["Player28"],
    },
    { 
      id: 29, 
      difficulty: "Medium", 
      title: "Artifact Arrangement", 
      players: 3,
      category: "Sorting Sanctuary",
      minRank: "crusader",
      maxRank: "archon",
      currentPlayers: ["Player29"],
    },
    { 
      id: 30, 
      difficulty: "Hard", 
      title: "Elemental Matrix Sort", 
      players: 4,
      category: "Sorting Sanctuary",
      minRank: "legend",
      maxRank: "divine",
      currentPlayers: ["Player30"],
    },
  ]);

  const [userProfile] = useState({
    name: "CodeWarrior",
    rank: "legend",
    mmr: 3500,
    wins: 42,
    losses: 18,
    chests: {
      common: 2,
      rare: 1,
      epic: 0,
      legendary: 0,
    },
    inventory: [
      { id: 1, name: "Quick Syntax Scroll", rarity: "rare", description: "30% faster coding speed for one battle" },
      { id: 2, name: "Debug Lens", rarity: "common", description: "Reveals one bug in your code" },
    ]
  });

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

        {/* Profile Card */}
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
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Win Rate</div>
                <div className="text-xl font-bold text-white">
                  {Math.round((userProfile.wins / (userProfile.wins + userProfile.losses)) * 100)}%
                </div>
                <div className="text-sm text-gray-400">
                  {userProfile.wins}W - {userProfile.losses}L
                </div>
              </div>
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="text-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <span className="text-sm text-gray-400">Chests: {
                    Object.values(userProfile.chests).reduce((a, b) => a + b, 0)
                  }</span>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <span className="text-sm text-gray-400">Items: {userProfile.inventory.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quests Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Active Quests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUESTS.map((quest) => (
              <QuestCard key={quest.id} {...quest} />
            ))}
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

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Active Battles</h2>
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
