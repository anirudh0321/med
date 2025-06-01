
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Percent, CalendarCheck2, AlertTriangle, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { UserStats } from '@/lib/types';
import Image from 'next/image';

const defaultInitialUserStats: UserStats = {
  points: 0,
  currentStreak: 0,
  longestStreak: 0,
  overallAdherence: 0,
  lastStreakIncrementDate: undefined,
};

const weeklyAdherenceData = [
  { day: "Mon", taken: 4, scheduled: 5, adherence: 80 },
  { day: "Tue", taken: 5, scheduled: 5, adherence: 100 },
  { day: "Wed", taken: 3, scheduled: 4, adherence: 75 },
  { day: "Thu", taken: 5, scheduled: 5, adherence: 100 },
  { day: "Fri", taken: 4, scheduled: 5, adherence: 80 },
  { day: "Sat", taken: 6, scheduled: 6, adherence: 100 },
  { day: "Sun", taken: 5, scheduled: 6, adherence: 83 },
];

const monthlyAdherenceData = [
  { month: "Jan", adherence: 85 },
  { month: "Feb", adherence: 90 },
  { month: "Mar", adherence: 82 },
  { month: "Apr", adherence: 88 },
  { month: "May", adherence: 92 },
  { month: "Jun", adherence: 87 },
];


const chartConfig = {
  adherence: {
    label: "Adherence",
    color: "hsl(var(--primary))",
  },
  taken: {
    label: "Taken",
    color: "hsl(var(--primary))",
  },
  scheduled: {
    label: "Scheduled",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const [isClient, setIsClient] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(defaultInitialUserStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsLoading(true);
      const storedUserStatsString = localStorage.getItem('pillPalUserStats');
      if (storedUserStatsString) {
        try {
          const parsedStats = JSON.parse(storedUserStatsString);
           setUserStats({
            ...defaultInitialUserStats, // provides defaults for new fields like lastStreakIncrementDate
            ...parsedStats // overrides with stored values
          });
        } catch (e) {
            console.error("Error parsing user stats from localStorage", e);
            setUserStats(defaultInitialUserStats);
            localStorage.setItem('pillPalUserStats', JSON.stringify(defaultInitialUserStats));
        }
      } else {
        // Use default if not found, and save it for next time
        setUserStats(defaultInitialUserStats);
        localStorage.setItem('pillPalUserStats', JSON.stringify(defaultInitialUserStats));
      }
      setIsLoading(false);
    }
  }, [isClient]);


  if (isLoading && isClient) {
     return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="ml-4 text-xl text-muted-foreground">Loading adherence statistics...</p>
      </div>
    );
  }

  const hasWeeklyData = weeklyAdherenceData && weeklyAdherenceData.length > 0;
  const hasMonthlyData = monthlyAdherenceData && monthlyAdherenceData.length > 0;


  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Adherence Statistics</CardTitle>
          </div>
          <CardDescription>Visualize your medication adherence over time and gain insights into your habits.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatDisplayCard icon={Percent} title="Overall Adherence" value={`${userStats.overallAdherence || 0}%`} description="Across all medications" />
        <StatDisplayCard icon={TrendingUp} title="Current Streak" value={`${userStats.currentStreak || 0} days`} description="Consistent adherence" />
        <StatDisplayCard icon={CalendarCheck2} title="Longest Streak" value={`${userStats.longestStreak || 0} days`} description="Your personal best!" />
        <StatDisplayCard icon={BarChart3} title="Points Earned" value={(userStats.points || 0).toString()} description="From consistent adherence" />
      </div>

      {hasWeeklyData ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Weekly Adherence Trend</CardTitle>
            <CardDescription>Number of doses taken vs. scheduled this week. (Sample Data)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAdherenceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  />
                  <Bar dataKey="taken" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="scheduled" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <NoDataCard title="Weekly Adherence Trend" message="Not enough data to display weekly adherence. Keep logging your medications!" />
      )}


      {hasMonthlyData ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Monthly Adherence (%)</CardTitle>
            <CardDescription>Your adherence percentage over the past few months. (Sample Data)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAdherenceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tickLine={false} axisLine={false}/>
                  <RechartsTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  />
                  <Bar dataKey="adherence" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
         <NoDataCard title="Monthly Adherence (%)" message="Monthly adherence data will appear here once you have a longer history." />
      )}
    </div>
  );
}

interface StatDisplayCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}

function StatDisplayCard({ icon: Icon, title, value, description }: StatDisplayCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

interface NoDataCardProps {
  title: string;
  message: string;
}

function NoDataCard({ title, message }: NoDataCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-10">
        <Image src="https://placehold.co/300x200.png" alt="No data available" width={200} height={133} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="data chart empty" />
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
