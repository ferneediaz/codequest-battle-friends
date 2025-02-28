
export interface BattleParticipant {
  id: string;
  battle_id: string;
  user_id: string;
  team: 'A' | 'B';
  joined_at: string;
  current_code: string | null;
}

export interface Battle {
  id: string;
  created_at: string;
  status: 'waiting' | 'in_progress' | 'completed';
  question_id: string;
  team_a_score: number;
  team_b_score: number;
}
