
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medication, UserStats } from "@/lib/types";
import { Bell, CalendarDays, CheckCircle, Clock, PlusCircle, TrendingUp, Zap, Pill, Award, Lightbulb, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

const defaultInitialMedications: Medication[] = [];

const defaultInitialUserStats: UserStats = {
  points: 1250,
  currentStreak: 15,
  longestStreak: 28,
  overallAdherence: 88,
};

type UpcomingMedication = Medication & { scheduledTime: string };

const LOCAL_STORAGE_MED_REMINDERS_KEY = 'pillPalMedicationRemindersEnabled';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(defaultInitialUserStats);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [upcomingMedications, setUpcomingMedications] = useState<UpcomingMedication[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [shownNotificationKeys, setShownNotificationKeys] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsLoadingData(true);
      const storedMedicationsString = localStorage.getItem('pillPalMedications');
      if (storedMedicationsString) {
        try {
          setMedications(JSON.parse(storedMedicationsString));
        } catch (e) {
          console.error("Error parsing medications from localStorage", e);
          setMedications(defaultInitialMedications);
          localStorage.setItem('pillPalMedications', JSON.stringify(defaultInitialMedications.map(m => {
            const { icon, ...rest } = m;
            return rest;
          })));
        }
      } else {
        setMedications(defaultInitialMedications);
        localStorage.setItem('pillPalMedications', JSON.stringify(defaultInitialMedications.map(m => {
          const { icon, ...rest } = m;
          return rest;
        })));
      }

      const storedUserStatsString = localStorage.getItem('pillPalUserStats');
      if (storedUserStatsString) {
        try {
          setUserStats(JSON.parse(storedUserStatsString));
        } catch (e) {
          console.error("Error parsing user stats from localStorage", e);
          setUserStats(defaultInitialUserStats);
          localStorage.setItem('pillPalUserStats', JSON.stringify(defaultInitialUserStats));
        }
      } else {
        setUserStats(defaultInitialUserStats);
        localStorage.setItem('pillPalUserStats', JSON.stringify(defaultInitialUserStats));
      }
      setIsLoadingData(false);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && !isLoadingData) {
      localStorage.setItem('pillPalMedications', JSON.stringify(medications.map(m => {
        const { icon, ...rest } = m;
        return rest;
      })));
    }
  }, [medications, isClient, isLoadingData]);

  useEffect(() => {
    if (isClient && !isLoadingData) {
      localStorage.setItem('pillPalUserStats', JSON.stringify(userStats));
    }
  }, [userStats, isClient, isLoadingData]);


  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLoadingData && isClient) {
      const todayDateString = new Date().toISOString().split('T')[0];
      const calculatedUpcoming = medications
        .flatMap(med => med.times.map(time => ({ ...med, scheduledTime: time })))
        .filter(med => {
            const isTaken = med.adherence.find(log => log.date === todayDateString && log.time === med.scheduledTime && log.taken);
            if (med.endDate) {
                const endDate = new Date(med.endDate);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (endDate < today) {
                    return false;
                }
            }
            if (med.startDate) {
                const startDate = new Date(med.startDate);
                startDate.setHours(0,0,0,0);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (startDate > today) {
                    return false;
                }
            }
            return !isTaken;
        })
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
      
      setUpcomingMedications(calculatedUpcoming);
    }
  }, [medications, isLoadingData, isClient]);
  
  const handleTakeMedication = (medId: string, time: string) => {
    setMedications(prevMeds => 
      prevMeds.map(med => 
        med.id === medId ? { ...med, adherence: [...med.adherence, {date: new Date().toISOString().split('T')[0], time, taken: true}], icon: CheckCircle } : med
      )
    );
    setUserStats(prevStats => ({
      ...prevStats,
      points: prevStats.points + 10,
      currentStreak: prevStats.currentStreak + 1, // This should be more complex based on adherence history
      overallAdherence: Math.min(100, prevStats.overallAdherence + 2) // This should be recalculated
    }));
  };

  const showBrowserNotification = useCallback(async (med: UpcomingMedication) => {
    if (!('Notification' in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Pill Pal Reminder', {
        body: `Time to take your ${med.name} (${med.dosage}) at ${med.scheduledTime}`,
        // icon: '/favicon.ico' // Optional: if you have a favicon in public folder
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Pill Pal Reminder', {
          body: `Time to take your ${med.name} (${med.dosage}) at ${med.scheduledTime}`,
        });
      }
    }
  }, []); // Empty dependency array, this function is stable

  useEffect(() => {
    if (!isClient || isLoadingData || !currentTime) return;

    let remindersEnabled = false;
    try {
      const remindersEnabledString = localStorage.getItem(LOCAL_STORAGE_MED_REMINDERS_KEY);
      if (remindersEnabledString) {
          remindersEnabled = JSON.parse(remindersEnabledString);
      }
    } catch (error) {
        console.error("Error parsing remindersEnabled from localStorage:", error);
        remindersEnabled = true; // Default to true if parsing fails or not set, can be changed
    }

    if (!remindersEnabled) return;

    upcomingMedications.forEach(med => {
      if (med.scheduledTime === currentTime) {
        const todayDateString = new Date().toISOString().split('T')[0];
        const notificationKey = `${med.id}-${med.scheduledTime}-${todayDateString}`;
        if (!shownNotificationKeys.includes(notificationKey)) {
          showBrowserNotification(med);
          setShownNotificationKeys(prevKeys => [...prevKeys, notificationKey]);
        }
      }
    });

  }, [currentTime, upcomingMedications, isClient, isLoadingData, shownNotificationKeys, showBrowserNotification]);


  if (isLoadingData && isClient) {
    return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <Card className="mb-8 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-lg">Here&apos;s your medication overview for today. Current time: {isClient ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Loading...'}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <StatCard icon={Zap} title="Points" value={userStats.points.toString()} color="text-yellow-500" />
          <StatCard icon={TrendingUp} title="Current Streak" value={`${userStats.currentStreak} days`} color="text-green-500" />
          <StatCard icon={CalendarDays} title="Overall Adherence" value={`${userStats.overallAdherence}%`} color="text-blue-500" />
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-headline">Today&apos;s Medications</CardTitle>
              <Link href="/medications/add" passHref>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading medications...</p>
                </div>
              ) : upcomingMedications.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingMedications.map((med) => {
                    const isTakenToday = med.adherence.find(log => log.date === new Date().toISOString().split('T')[0] && log.time === med.scheduledTime && log.taken);
                    const MedIcon = isTakenToday ? CheckCircle : med.icon || Clock; 

                    return (
                      <li key={`${med.id}-${med.scheduledTime}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                           <MedIcon className={`h-8 w-8 ${isTakenToday ? 'text-green-500' : 'text-primary'}`} />
                          <div>
                            <h3 className="font-semibold text-lg">{med.name}</h3>
                            <p className="text-sm text-muted-foreground">{med.dosage} - {med.scheduledTime}</p>
                            {med.instructions && <p className="text-xs text-muted-foreground/80">{med.instructions}</p>}
                          </div>
                        </div>
                        {!isTakenToday ? (
                          <Button onClick={() => handleTakeMedication(med.id, med.scheduledTime)} size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Taken
                          </Button>
                        ) : (
                           <span className="text-sm text-green-600 font-medium flex items-center"><CheckCircle className="mr-1 h-4 w-4" /> Taken</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Image src="https://placehold.co/300x200.png" alt="All medications taken" width={300} height={200} className="mx-auto mb-4 rounded-lg" data-ai-hint="celebration empty state" />
                  <p className="text-muted-foreground text-lg">All medications for today are logged or none are scheduled!</p>
                  <p className="text-sm text-muted-foreground">Add a new one or check back tomorrow.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Adherence Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Goal</span>
                  <span>{userStats.overallAdherence}%</span>
                </div>
                <Progress value={userStats.overallAdherence} aria-label={`${userStats.overallAdherence}% adherence`} />
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Keep up the great work! Consistency is key.
                </p>
              </div>
              <Button variant="link" className="w-full mt-4 text-primary" asChild>
                <Link href="/stats">View Detailed Stats</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="ghost" asChild>
                    <Link href="/medications/list"><Pill className="mr-2 h-4 w-4" /> View All Medications</Link>
                </Button>
                <Button className="w-full justify-start" variant="ghost" asChild>
                    <Link href="/rewards"><Award className="mr-2 h-4 w-4" /> Check Rewards</Link>
                </Button>
                <Button className="w-full justify-start" variant="ghost" asChild>
                    <Link href="/health-insights"><Lightbulb className="mr-2 h-4 w-4" /> Health Insights</Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
}

function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  return (
    <div className="p-6 bg-card rounded-xl shadow-md flex items-center space-x-4 border hover:border-primary/50 transition-all">
      <div className={`p-3 rounded-full bg-primary/10 ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

