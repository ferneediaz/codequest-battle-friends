import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BattleCard from "@/components/BattleCard";
import QuestCard from "@/components/QuestCard";
import { useToast } from "@/hooks/use-toast";
import { Shield, Sword, Crown, Trophy, Star, Medal, Award, Skull, Flame, Zap, Brain, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RANKS = {
  immortal: { name: "Immortal", color: "#9b87f5", minMMR: 6000 },
  divine: { name: "Divine", color: "#7E69AB", minMMR: 5000 },
  ancient: { name: "Ancient", color: "#6E59A5", minMMR: 4000 },
  legend: { name: "Legend", color: "#8B5CF6", minMMR: 3000 },
  archon: { name: "Archon", color: "#D946EF", minMMR: 2000 },
  crusader: { name: "Crusader", color: "#F97316", minMMR: 1000 },
  guardian: { name: "Guardian", color: "#0EA5E9", minMMR: 500 },
  herald: { name: "Herald", color: "#33C3F0", minMMR: 0 },
} as const;

const DSA_SKILLS = [
  { subject: 'Arrays', score: 80 },
  { subject: 'Hashmaps', score: 65 },
  { subject: 'Binary Search', score: 70 },
  { subject: 'Linked Lists', score: 75 },
  { subject: 'Trees', score: 60 },
  { subject: 'Graphs', score: 55 },
  { subject: 'Dynamic Programming', score: 45 },
  { subject: 'Stack & Queue', score: 85 },
  { subject: 'Recursion', score: 70 },
  { subject: 'Sorting', score: 90 },
];

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

type BattleWithExtras = Database["public"]["Tables"]["battles"]["Row"] & {
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  title: string;
  minRank: keyof typeof RANKS;
  maxRank: keyof typeof RANKS;
};

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Realms");
  const [battles, setBattles] = useState<BattleWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMMR = 1200;
  const currentRank = Object.entries(RANKS).reduce((acc, [key, rank]) => 
    currentMMR >= rank.minMMR ? key as keyof typeof RANKS : acc
  , 'herald' as keyof typeof RANKS);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const { data, error } = await supabase
          .from('battles')
          .select('*')
          .eq('status', 'waiting');
        
        if (error) throw error;
        
        if (data) {
          setBattles(data.map(battle => ({
            ...battle,
            difficulty: "Medium" as const,
            category: "Forest of Arrays",
            title: "Sample Battle",
            minRank: "guardian" as const,
            maxRank: "immortal" as const,
          })));
        }
      } catch (error: any) {
        console.error('Error fetching battles:', error);
        toast({
          title: "Error",
          description: "Failed to load battles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();

    const channel = supabase
      .channel('public:battles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battles'
        },
        async (payload) => {
          console.log('Real-time update:', payload);
          fetchBattles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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
        <div className="mb-16 bg-black/30 rounded-lg p-6 border border-white/10">
          <div className="flex flex-col space-y-6">
            {/* Rank display strip */}
            <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg">
              {Object.entries(RANKS).reverse().map(([key, rank]) => (
                <div 
                  key={key} 
                  className={`flex flex-col items-center ${key === currentRank ? 'scale-110 transform' : 'opacity-50'}`}
                >
                  <Crown 
                    className="w-6 h-6 mb-1" 
                    style={{ color: rank.color }} 
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: rank.color }}
                  >
                    {rank.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Stats */}
              <div className="space-y-4 flex flex-col h-[300px]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <div className="text-sm text-gray-400">Current Rank</div>
                    </div>
                    <div className="text-lg font-bold mt-1" style={{ color: RANKS[currentRank].color }}>
                      {RANKS[currentRank].name}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <div className="text-sm text-gray-400">MMR</div>
                    </div>
                    <div className="text-lg font-bold text-yellow-400 mt-1">{currentMMR}</div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-green-400" />
                      <div className="text-sm text-gray-400">Battles Won</div>
                    </div>
                    <div className="text-lg font-bold text-green-400 mt-1">23</div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-lg font-bold text-purple-400 mt-1">65%</div>
                  </div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Medal className="w-4 h-4 text-primary" />
                    <div className="text-sm text-gray-400">Recent Achievements</div>
                  </div>
                  <div className="space-y-2 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Perfect Solver</span>
                        <Award className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Graph Master</span>
                        <Brain className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Battle Veteran</span>
                        <Skull className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle column - DSA Skills */}
              <div className="space-y-4">
                <div className="h-[300px] bg-black/50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={DSA_SKILLS}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#9ca3af' }}
                        fontSize={10}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: '#9ca3af' }}
                        fontSize={10}
                      />
                      <Radar
                        name="Skills"
                        dataKey="score"
                        stroke="#8b5cf6"
                        fill="#8b5cf680"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <div className="text-sm text-gray-400">Strongest</div>
                    </div>
                    <div className="text-sm font-medium text-orange-400 mt-1">Sorting (90%)</div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <div className="text-sm text-gray-400">To Improve</div>
                    </div>
                    <div className="text-sm font-medium text-blue-400 mt-1">DP (45%)</div>
                  </div>
                </div>
              </div>

              {/* Right column - Active Quests */}
              <div className="h-[300px]">
                <div className="bg-black/50 p-4 rounded-lg h-full overflow-y-auto">
                  <h3 className="text-lg font-bold text-white mb-4">Active Quests</h3>
                  <div className="space-y-2">
                    {QUESTS.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        title={quest.title}
                        description={quest.description}
                        progress={quest.progress}
                        target={quest.target}
                        reward={quest.reward}
                        isCompleted={quest.isCompleted}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Available Battles</h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>
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

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : battles.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No active battles found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBattles.map((battle) => (
              <BattleCard
                key={battle.id}
                difficulty={battle.difficulty}
                title={battle.title}
                players={battle.max_participants || 2}
                onJoin={handleJoinBattle}
                minRank={RANKS[battle.minRank].name}
                maxRank={RANKS[battle.maxRank].name}
                currentPlayers={[`${battle.current_participants || 0} players`]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
