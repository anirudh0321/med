
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Zap, ShieldCheck, TrendingUp, CheckCircle, Loader2 } from "lucide-react";
import { UserStats } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

// Mock data for initial structure / fallback
const defaultInitialUserStats: UserStats = {
  points: 1250,
  currentStreak: 15,
  longestStreak: 28,
  overallAdherence: 88,
};

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  achieved: boolean;
  progress?: number; 
  tier?: 'bronze' | 'silver' | 'gold';
  condition: (stats: UserStats) => { achieved: boolean; progress: number };
}

// Define badge conditions here so they can react to userStats
const badgeDefinitions: Omit<Badge, 'achieved' | 'progress'>[] = [
  { id: '1', name: 'Perfect Week', description: '7 days of perfect adherence.', icon: Star, tier: 'silver', 
    condition: (stats) => ({ achieved: stats.currentStreak >= 7, progress: Math.min(100, (stats.currentStreak / 7) * 100) }) },
  { id: '2', name: 'Month Miler', description: '30 days of perfect adherence.', icon: Award, tier: 'gold',
    condition: (stats) => ({ achieved: stats.currentStreak >= 30, progress: Math.min(100, (stats.currentStreak / 30) * 100) }) },
  { id: '3', name: 'Early Bird', description: 'Took morning meds on time for 5 days (simulated).', icon: Zap, tier: 'bronze', 
    condition: (stats) => ({ achieved: stats.points > 500, progress: stats.points > 500 ? 100: (stats.points/500)*100 }) }, // Example, replace with real logic
  { id: '4', name: 'Consistency King', description: 'Achieved 90% adherence overall.', icon: ShieldCheck, tier: 'silver', 
    condition: (stats) => ({ achieved: stats.overallAdherence >= 90, progress: stats.overallAdherence }) },
  { id: '5', name: 'Streak Starter', description: 'Achieved a 3-day streak.', icon: TrendingUp, tier: 'bronze',
    condition: (stats) => ({ achieved: stats.currentStreak >= 3, progress: Math.min(100, (stats.currentStreak / 3) * 100) }) },
  { id: '6', name: 'Point Hoarder', description: 'Earned over 1000 points.', icon: CheckCircle, tier: 'bronze', 
    condition: (stats) => ({ achieved: stats.points >= 1000, progress:  Math.min(100, (stats.points / 1000) * 100)}) },
];


export default function RewardsPage() {
  const [isClient, setIsClient] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(defaultInitialUserStats);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUserStatsString = localStorage.getItem('pillPalUserStats');
      if (storedUserStatsString) {
        setUserStats(JSON.parse(storedUserStatsString));
      } else {
        setUserStats(defaultInitialUserStats);
        localStorage.setItem('pillPalUserStats', JSON.stringify(defaultInitialUserStats));
      }
      // Badges will be calculated in the next effect, after userStats is set
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
        // Calculate badges based on current userStats
        const calculatedBadges = badgeDefinitions.map(def => {
            const { achieved, progress } = def.condition(userStats);
            return { ...def, achieved, progress };
        });
        setBadges(calculatedBadges);
        setIsLoading(false); // Data (stats and badges) is now ready
    }
  }, [userStats, isClient]); // Re-calculate badges when userStats changes


  if (isLoading && isClient) {
     return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="ml-4 text-xl text-muted-foreground">Loading your rewards...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <Award className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl font-headline">Your Rewards & Achievements</CardTitle>
          </div>
          <CardDescription className="text-lg">Stay motivated by tracking your points, streaks, and earned badges!</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <RewardStatCard icon={Zap} title="Total Points" value={userStats.points.toString()} bgColor="bg-yellow-400/10" iconColor="text-yellow-500" />
          <RewardStatCard icon={TrendingUp} title="Current Streak" value={`${userStats.currentStreak} Days`} bgColor="bg-green-400/10" iconColor="text-green-500" />
          <RewardStatCard icon={Star} title="Longest Streak" value={`${userStats.longestStreak} Days`} bgColor="bg-blue-400/10" iconColor="text-blue-500" />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Badges Earned</CardTitle>
          <CardDescription>Collect badges for your achievements and milestones.</CardDescription>
        </CardHeader>
        <CardContent>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
               <Image src="https://placehold.co/300x200.png" alt="No badges earned" width={200} height={133} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="empty state trophy" />
              <p className="text-muted-foreground">No badges earned yet. Keep up the good work to unlock them!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
            <p><strong className="text-foreground">Log Medication on Time:</strong> +10 points</p>
            <p><strong className="text-foreground">Maintain Daily Streak:</strong> +5 points daily (increases with streak length!)</p>
            <p><strong className="text-foreground">Complete a Perfect Week:</strong> +50 bonus points</p>
            <p><strong className="text-foreground">Unlock Badges:</strong> Points vary per badge</p>
        </CardContent>
      </Card>

    </div>
  );
}

interface RewardStatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

function RewardStatCard({ icon: Icon, title, value, bgColor, iconColor }: RewardStatCardProps) {
  return (
    <div className={`p-6 rounded-xl shadow-md flex flex-col items-center text-center ${bgColor} border border-transparent hover:border-primary/30 transition-all`}>
      <div className={`p-4 rounded-full mb-3 ${iconColor} bg-background`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className={`text-3xl font-bold ${iconColor}`}>{value}</p>
    </div>
  );
}

interface BadgeCardProps {
  badge: Badge;
}

function BadgeCard({ badge }: BadgeCardProps) {
  const Icon = badge.icon;
  let tierColor = "border-muted-foreground/30";
  if (badge.achieved) {
    if (badge.tier === 'gold') tierColor = "border-yellow-500 shadow-yellow-500/30";
    else if (badge.tier === 'silver') tierColor = "border-slate-400 shadow-slate-400/30";
    else if (badge.tier === 'bronze') tierColor = "border-yellow-700 shadow-yellow-700/30";
  }

  return (
    <Card className={`flex flex-col items-center p-6 text-center transition-all hover:shadow-xl ${badge.achieved ? 'opacity-100' : 'opacity-60 hover:opacity-100'} border-2 ${tierColor} ${badge.achieved ? 'shadow-lg' : ''}`}>
      <div className={`mb-3 p-3 rounded-full ${badge.achieved ? (badge.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-600' : badge.tier === 'silver' ? 'bg-slate-400/20 text-slate-500' : 'bg-yellow-700/20 text-yellow-800') : 'bg-muted text-muted-foreground'}`}>
        <Icon className="w-10 h-10" />
      </div>
      <h4 className="font-semibold text-lg mb-1">{badge.name}</h4>
      <p className="text-xs text-muted-foreground mb-3 h-10">{badge.description}</p>
      {badge.progress !== undefined && !badge.achieved && (
        <div className="w-full mt-auto">
          <Progress value={badge.progress} className="h-2" aria-label={`${badge.progress}% towards ${badge.name}`} />
          <p className="text-xs text-muted-foreground mt-1">{badge.progress}% complete</p>
        </div>
      )}
      {badge.achieved && <span className="text-xs font-medium text-green-600 mt-auto">Achieved!</span>}
    </Card>
  );
}

    