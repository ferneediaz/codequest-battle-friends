
import React from 'react';
import { Wand, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skill } from '@/types/battle';

interface BattleSkillsProps {
  skills: Skill[];
  onUseSkill: (skill: Skill) => void;
  mana: number;
}

export const BattleSkills: React.FC<BattleSkillsProps> = ({
  skills,
  onUseSkill,
  mana
}) => {
  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Battle Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <TooltipProvider>
          {skills.map((skill) => (
            <Tooltip key={skill.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onUseSkill(skill)}
                  className="relative h-10 w-full flex items-center justify-between gap-2 px-3"
                  variant={skill.isOnCooldown ? "secondary" : "default"}
                  disabled={skill.isOnCooldown || mana < skill.manaCost}
                >
                  <div className="flex items-center gap-2">
                    <Wand className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-400">{skill.manaCost} MP</span>
                    <Info className="w-4 h-4 opacity-50" />
                  </div>
                  {skill.isOnCooldown && (
                    <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                      Recharging...
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p>{skill.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
