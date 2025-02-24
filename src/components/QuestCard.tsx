
import React from "react";
import { Trophy, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  isCompleted: boolean;
}

const getChestImage = (reward: string) => {
  const quality = reward.split(" ")[0].toLowerCase();
  switch (quality) {
    case "legendary":
      return "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=200&h=200&fit=crop";
    case "epic":
      return "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=200&h=200&fit=crop";
    case "rare":
      return "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=200&h=200&fit=crop";
    case "common":
    default:
      return "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=200&h=200&fit=crop";
  }
};

const QuestCard = ({ title, description, progress, target, reward, isCompleted }: QuestProps) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Trophy className="w-5 h-5 text-yellow-500" />
            )}
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={getChestImage(reward)}
                alt={reward}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-sm text-primary">{reward}</span>
          </div>
        </div>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Progress</span>
            <span>{progress}/{target}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress / target) * 100}%` }}
            />
          </div>
        </div>
        {isCompleted && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => {}}
          >
            Claim Reward
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
