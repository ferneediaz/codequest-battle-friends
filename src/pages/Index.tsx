import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuestCard from "@/components/QuestCard";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBeginQuest = async () => {
    try {
      // Generate a unique battle ID
      const battleId = crypto.randomUUID();
      
      // Create the initial battle in Supabase
      const { error } = await supabase
        .from('battles')
        .insert([
          {
            id: battleId,
            status: 'active',
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      // Navigate to the battle page with the generated ID
      navigate(`/battle?battleId=${battleId}`);
      
      toast({
        title: "Quest Started!",
        description: "Share this page URL with friends to code together.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to CodeQuest</h1>
        <p className="text-gray-400 max-w-2xl">
          Embark on an epic journey through the realms of coding. Complete quests,
          earn rewards, and become a legendary programmer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Daily Quests</h2>
          </div>
          <p className="text-gray-400">
            Complete daily coding challenges to earn rewards and improve your skills.
          </p>
        </div>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Achievements</h2>
          </div>
          <p className="text-gray-400">
            Unlock special achievements by mastering different programming concepts.
          </p>
        </div>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Check className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-white">Progress</h2>
          </div>
          <p className="text-gray-400">
            Track your journey and see how far you've come in your coding adventure.
          </p>
        </div>
      </div>
      
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Choose Your Quest</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              All Quests
            </Button>
            <Button variant="ghost" size="sm">
              In Progress
            </Button>
            <Button variant="ghost" size="sm">
              Completed
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuestCard
            title="Forest of Arrays"
            description="Master the art of array manipulation in this mystical forest."
            progress={0}
            target={100}
            reward="Epic Chest"
            isCompleted={false}
            onBeginQuest={handleBeginQuest}
          />
        </div>
      </section>
      
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Progress</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Quests Completed</h3>
            <p className="text-3xl font-bold text-primary">12</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Total XP</h3>
            <p className="text-3xl font-bold text-primary">1,234</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Current Rank</h3>
            <p className="text-3xl font-bold text-primary">Silver</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Achievements</h3>
            <p className="text-3xl font-bold text-primary">8/24</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
