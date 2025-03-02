import { useState } from "react";
import BattleCard from "@/components/BattleCard";
import QuestCard from "@/components/QuestCard";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Crown, Trophy, Star, Medal, Award, Skull, Flame, Zap, Brain } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

interface Battle {
  id: string;
  status: string;
  max_participants: number;
  current_participants: number;
  min_rank: string;
  max_rank: string;
  questions: {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
  };
  battle_participants: {
    user_id: string;
    profiles: {
      username: string;
    };
  }[];
}

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Realms");
  
  const { data: battles = [], isLoading } = useQuery({
    queryKey: ['battles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battles')
        .select(`
          *,
          questions (
            title,
            difficulty,
            category
          ),
          battle_participants (
            user_id,
            profiles (
              username
            )
          )
        `)
        .eq('status', 'waiting');
      
      if (error) {
        toast({
          title: "Error loading battles",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Battle[];
    },
  });

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
    ],
    achievements: {
      competitions: [
        { id: 1, name: "Algorithm Master", place: 1, year: 2023 },
        { id: 2, name: "Code Wars Champion", place: 2, year: 2023 },
      ],
      totals: {
        bugsFixed: 856,
        linesWritten: 15420,
        algorithmsOptimized: 234,
        perfectSolutions: 28,
      }
    },
    titles: [
      { 
        id: 1, 
        name: "Bug Hunter", 
        icon: <Skull className="w-4 h-4 text-red-500" />,
        description: "Fixed over 500 bugs",
        rarity: "rare"
      },
      { 
        id: 2, 
        name: "Code Artisan", 
        icon: <Star className="w-4 h-4 text-purple-500" />,
        description: "Written over 10,000 lines of code",
        rarity: "epic"
      },
      { 
        id: 3, 
        name: "Algorithm Sage", 
        icon: <Brain className="w-4 h-4 text-blue-500" />,
        description: "Optimized over 200 algorithms",
        rarity: "legendary"
      },
      { 
        id: 4, 
        name: "Perfect Executioner", 
        icon: <Flame className="w-4 h-4 text-yellow-500" />,
        description: "Achieved 25+ perfect solutions",
        rarity: "epic"
      },
    ],
    activeTitle: 2,
    skills: [
      { category: "Arrays", value: 85 },
      { category: "Hashmaps", value: 78 },
      { category: "Binary Search", value: 92 },
      { category: "Linked Lists", value: 75 },
      { category: "Trees", value: 88 },
      { category: "Graphs", value: 70 },
      { category: "Dynamic Prog", value: 65 },
      { category: "Stack/Queue", value: 82 },
      { category: "Recursion", value: 77 },
      { category: "Sorting", value: 90 }
    ],
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

  const handleJoin = (battleId: string) => {
    toast({
      title: "Joining Battle",
      description: `Joining battle with ID: ${battleId}`,
    });
  };

  const filteredBattles = battles.filter(
    battle => selectedCategory === "All Realms" || battle.questions.category === selectedCategory
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

        <div className="mb-16 p-6 rounded-lg bg-black/30 border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent">
                  {getRankIcon(userProfile.rank)}
                </div>
                {userProfile.achievements.competitions.length > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative">
                      <Award className="w-6 h-6 text-yellow-500 animate-glow" />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
                        {userProfile.achievements.competitions.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {userProfile.name}
                  {userProfile.titles.find(t => t.id === userProfile.activeTitle)?.icon}
                </h3>
                <div className="text-sm" style={{
                  color: userProfile.titles.find(t => t.id === userProfile.activeTitle)?.rarity === 'legendary' ? '#fcd34d' :
                    userProfile.titles.find(t => t.id === userProfile.activeTitle)?.rarity === 'epic' ? '#c084fc' :
                    userProfile.titles.find(t => t.id === userProfile.activeTitle)?.rarity === 'rare' ? '#93c5fd' :
                    '#d1d5db'
                }}>
                  {userProfile.titles.find(t => t.id === userProfile.activeTitle)?.name}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm" style={{ color: RANKS[userProfile.rank].color }}>
                    {RANKS[userProfile.rank].name}
                  </span>
                  <span className="text-sm text-gray-400">
                    MMR: {userProfile.mmr}
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/5">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Earned Titles</h4>
                  <div className="space-y-2">
                    {userProfile.titles.map((title) => (
                      <TooltipProvider key={title.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                title.id === userProfile.activeTitle ? 'bg-white/10' : 'hover:bg-white/5'
                              }`}
                            >
                              {title.icon}
                              <span
                                className="text-sm"
                                style={{
                                  color: title.rarity === 'legendary' ? '#fcd34d' :
                                    title.rarity === 'epic' ? '#c084fc' :
                                    title.rarity === 'rare' ? '#93c5fd' :
                                    '#d1d5db'
                                }}
                              >
                                {title.name}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{title.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-black/20 rounded-lg border border-white/5">
                    <Skull className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Bugs Fixed</div>
                    <div className="text-sm font-semibold text-white">{userProfile.achievements.totals.bugsFixed}</div>
                  </div>
                  <div className="text-center p-2 bg-black/20 rounded-lg border border-white/5">
                    <Brain className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Algorithms</div>
                    <div className="text-sm font-semibold text-white">{userProfile.achievements.totals.algorithmsOptimized}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={userProfile.skills}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-black/20 border border-white/5">
                <div className="text-xl font-bold text-white mb-1">
                  {Math.round((userProfile.wins / (userProfile.wins + userProfile.losses)) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
                <div className="text-xs text-gray-500 mt-1">
                  {userProfile.wins}W - {userProfile.losses}L
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-black/20 border border-white/5">
                <div className="text-xl font-bold text-white mb-1">
                  {Object.values(userProfile.chests).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-400">Chests</div>
                <div className="flex justify-center gap-2 mt-1">
                  {Object.entries(userProfile.chests).map(([type, count]) => count > 0 && (
                    <div
                      key={type}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: type === 'legendary' ? 'rgba(234, 179, 8, 0.2)' :
                          type === 'epic' ? 'rgba(168, 85, 247, 0.2)' :
                          type === 'rare' ? 'rgba(59, 130, 246, 0.2)' :
                          'rgba(107, 114, 128, 0.2)',
                        color: type === 'legendary' ? '#fcd34d' :
                          type === 'epic' ? '#c084fc' :
                          type === 'rare' ? '#93c5fd' :
                          '#d1d5db'
                      }}
                    >
                      {count} {type}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 p-4 rounded-lg bg-black/20 border border-white/5">
                <div className="text-sm text-gray-400 mb-2">Inventory</div>
                <div className="space-y-2">
                  {userProfile.inventory.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white">{item.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: item.rarity === 'rare' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                          color: item.rarity === 'rare' ? '#93c5fd' : '#d1d5db'
                        }}
                      >
                        {item.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Active Quests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUESTS.map((quest) => (
              <QuestCard key={quest.id} {...quest} />
            ))}
          </div>
        </div>

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
          {isLoading ? (
            // Add loading state
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative group animate-pulse">
                <div className="h-[300px] bg-black/50 rounded-lg border border-white/10"></div>
              </div>
            ))
          ) : filteredBattles.map((battle) => (
            <BattleCard
              key={battle.id}
              difficulty={battle.questions.difficulty}
              title={battle.questions.title}
              players={battle.max_participants}
              minRank={RANKS[battle.min_rank as keyof typeof RANKS].name}
              maxRank={RANKS[battle.max_rank as keyof typeof RANKS].name}
              currentPlayers={battle.battle_participants.map(bp => bp.profiles.username)}
              onJoin={() => handleJoin(battle.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
