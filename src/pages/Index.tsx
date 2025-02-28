
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
