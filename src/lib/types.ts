
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'thrice_daily' | 'every_other_day' | 'as_needed';
  times: string[]; // e.g., ['08:00', '20:00']
  instructions?: string; // e.g., "Take with food"
  icon?: React.ElementType; // Optional: Lucide icon component
  adherence: AdherenceLog[]; // Log of taken status
}

export interface AdherenceLog {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  taken: boolean;
}

export interface UserStats {
  points: number;
  currentStreak: number; // in days
  longestStreak: number; // in days
  overallAdherence: number; // percentage 0-100
}

export interface HealthInsight {
  id: string;
  title: string;
  content: string;
  isRelevant?: boolean;
  reasoning?: string;
  source?: string; // e.g., "AI Generated" or "General Health Tip"
  type: 'ai_safety' | 'general_tip';
}
