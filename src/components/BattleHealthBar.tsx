
import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamHealthProps {
  health: number;
  maxHealth: number;
  team: "A" | "B";
}

const TeamHealth = ({ health, maxHealth, team }: TeamHealthProps) => {
  const percentage = (health / maxHealth) * 100;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Heart className={cn(
          "w-5 h-5",
          team === "A" ? "text-primary" : "text-destructive"
        )} />
        <span className={cn(
          "text-sm font-medium",
          team === "A" ? "text-primary" : "text-destructive"
        )}>
          Team {team}
        </span>
      </div>
      <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            team === "A" 
              ? "bg-gradient-to-r from-primary/80 to-primary" 
              : "bg-gradient-to-r from-destructive/80 to-destructive"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export function BattleHealthBar() {
  return (
    <div className="w-full bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
      <div className="container mx-auto grid grid-cols-2 gap-8">
        <TeamHealth health={300} maxHealth={300} team="A" />
        <TeamHealth health={300} maxHealth={300} team="B" />
      </div>
    </div>
  );
}
