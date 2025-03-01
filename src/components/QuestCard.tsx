import React from "react";
import { Trophy, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  isCompleted: boolean;
  onBeginQuest?: () => void;
}

const getChestStyle = (reward: string) => {
  const quality = reward.split(" ")[0].toLowerCase();
  switch (quality) {
    case "legendary":
      return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-black";
    case "epic":
      return "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white";
    case "rare":
      return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white";
    case "common":
    default:
      return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 text-white";
  }
};

const QuestCard = ({ title, description, progress, target, reward, isCompleted, onBeginQuest }: QuestProps) => {
  const handleBeginQuest = () => {
    if (onBeginQuest) {
      onBeginQuest();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative p-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {isCompleted ? (
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            ) : (
              <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            )}
            <div className="flex flex-col items-start">
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">{description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "relative w-8 h-8 rounded-lg overflow-hidden shadow-lg flex-shrink-0",
              "flex items-center justify-center",
              getChestStyle(reward)
            )}>
              <Trophy className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-primary font-semibold">{reward.split(' ')[0]}</span>
              <div className="flex items-center gap-1">
                <div className="w-20 bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(progress / target) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{progress}/{target}</span>
              </div>
            </div>
          </div>
        </div>
        {!isCompleted && (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full mt-2 text-xs py-1 h-7"
            onClick={handleBeginQuest}
          >
            Begin Quest
          </Button>
        )}
        {isCompleted && (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full mt-2 text-xs py-1 h-7"
            onClick={() => {}}
          >
            Claim
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
