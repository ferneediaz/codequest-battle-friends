
import { useState } from 'react';
import { BattleState, INITIAL_BATTLE_STATE } from '@/types/battle';
import { useToast } from '@/hooks/use-toast';

const HINT_COST = 100;

export function useBattleState() {
  const [battleState, setBattleState] = useState<BattleState>(INITIAL_BATTLE_STATE);
  const { toast } = useToast();

  const useSkill = (skillId: string) => {
    const skill = battleState.skills.find(s => s.id === skillId);
    
    if (!skill) return;

    if (skill.isOnCooldown) {
      toast({
        title: "Skill on Cooldown",
        description: "This skill is still recharging...",
        variant: "destructive",
      });
      return;
    }

    if (battleState.mana < skill.manaCost) {
      toast({
        title: "Not Enough Mana",
        description: "You need more mana to use this skill!",
        variant: "destructive",
      });
      return;
    }

    switch (skill.id) {
      case "debug":
        toast({
          title: "Debug Insight Activated",
          description: "Looking for potential bugs in your code...",
        });
        break;
      case "optimize":
        toast({
          title: "Code Optimizer Activated",
          description: "Analyzing your code for optimization opportunities...",
        });
        break;
      case "timeFreeze":
        toast({
          title: "Time Freeze Activated",
          description: "Battle timer paused for 30 seconds!",
        });
        break;
    }

    setBattleState(prev => ({
      ...prev,
      mana: prev.mana - skill.manaCost,
      skills: prev.skills.map(s => 
        s.id === skill.id 
          ? { ...s, isOnCooldown: true }
          : s
      ),
    }));

    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        skills: prev.skills.map(s =>
          s.id === skill.id
            ? { ...s, isOnCooldown: false }
            : s
        ),
      }));
    }, skill.cooldown * 1000);
  };

  const buyHint = () => {
    if (battleState.hints.length === battleState.usedHints.length) {
      toast({
        title: "No More Hints",
        description: "You've already unlocked all available hints!",
        variant: "destructive",
      });
      return;
    }

    if (battleState.gold < HINT_COST) {
      toast({
        title: "Not Enough Gold",
        description: `You need ${HINT_COST} gold to unlock a hint!`,
        variant: "destructive",
      });
      return;
    }

    const unusedHints = battleState.hints.filter(
      hint => !battleState.usedHints.includes(hint)
    );
    const newHint = unusedHints[0];

    setBattleState(prev => ({
      ...prev,
      gold: prev.gold - HINT_COST,
      usedHints: [...prev.usedHints, newHint],
    }));

    toast({
      title: "Hint Unlocked!",
      description: newHint,
    });
  };

  return {
    battleState,
    useSkill,
    buyHint
  };
}
