
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCircle, Bell, Palette, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const LOCAL_STORAGE_MED_REMINDERS_KEY = 'pillPalMedicationRemindersEnabled';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [name, setName] = useState("John Doe"); // Example, not persisted
  const [email, setEmail] = useState("john.doe@example.com"); // Example, not persisted

  const [medicationRemindersEnabled, setMedicationRemindersEnabled] = useState(true);
  const [refillRemindersEnabled, setRefillRemindersEnabled] = useState(false); // Default off
  const [healthTipsEnabled, setHealthTipsEnabled] = useState(true); // Default on
  const [darkModeEnabled, setDarkModeEnabled] = useState(false); // Default off

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load medication reminders setting from localStorage
  useEffect(() => {
    if (isClient) {
      setIsLoadingSettings(true);
      const storedMedReminders = localStorage.getItem(LOCAL_STORAGE_MED_REMINDERS_KEY);
      if (storedMedReminders !== null) {
        setMedicationRemindersEnabled(JSON.parse(storedMedReminders));
      } else {
        // Default to true if not found and save it
        setMedicationRemindersEnabled(true);
        localStorage.setItem(LOCAL_STORAGE_MED_REMINDERS_KEY, JSON.stringify(true));
      }
      // Simulate loading for other settings for consistent UX, though they are not persisted yet
      // In a real app, these would also be loaded from a persistent store
      setIsLoadingSettings(false); 
    }
  }, [isClient]);

  // Save medication reminders setting to localStorage when it changes
  useEffect(() => {
    if (isClient && !isLoadingSettings) { // Only save after initial load/set
      localStorage.setItem(LOCAL_STORAGE_MED_REMINDERS_KEY, JSON.stringify(medicationRemindersEnabled));
    }
  }, [medicationRemindersEnabled, isClient, isLoadingSettings]);

  const handleProfileUpdate = () => {
    // Placeholder for profile update logic
    toast({
      title: "Profile Updated",
      description: "Your profile information has been (mock) updated.",
    });
  };
  
  const handleNotificationPreferencesSave = () => {
     // Only medicationRemindersEnabled is actually persisted for now
    toast({
      title: "Notification Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  if (isLoadingSettings && isClient) {
    return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading settings...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <SettingsIcon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            <CardTitle className="text-2xl sm:text-3xl font-headline">Settings</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Manage your account preferences and application settings.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-headline flex items-center gap-2"><UserCircle className="w-5 h-5 text-primary"/> Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleProfileUpdate}>Update Profile</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-headline flex items-center gap-2"><Bell className="w-5 h-5 text-primary"/> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-3 rounded-md border hover:bg-muted/50">
                <div className="flex-grow">
                  <Label htmlFor="medicationReminders" className="font-normal cursor-pointer text-base sm:text-lg">Medication Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications for scheduled medications.</p>
                </div>
                <Switch 
                  id="medicationReminders" 
                  checked={medicationRemindersEnabled}
                  onCheckedChange={setMedicationRemindersEnabled}
                  className="mt-1 sm:mt-0 shrink-0"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-3 rounded-md border hover:bg-muted/50">
                <div className="flex-grow">
                  <Label htmlFor="refillReminders" className="font-normal cursor-pointer text-base sm:text-lg">Refill Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified when your medication is running low.</p>
                </div>
                <Switch 
                  id="refillReminders"
                  checked={refillRemindersEnabled}
                  onCheckedChange={setRefillRemindersEnabled}
                  className="mt-1 sm:mt-0 shrink-0"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-3 rounded-md border hover:bg-muted/50">
                <div className="flex-grow">
                  <Label htmlFor="healthTips" className="font-normal cursor-pointer text-base sm:text-lg">Health Tips & Insights</Label>
                  <p className="text-sm text-muted-foreground">Receive occasional health tips and insights.</p>
                </div>
                <Switch 
                  id="healthTips" 
                  checked={healthTipsEnabled}
                  onCheckedChange={setHealthTipsEnabled}
                  className="mt-1 sm:mt-0 shrink-0"
                />
              </div>
              <Button className="w-full mt-4" onClick={handleNotificationPreferencesSave}>Save Notification Preferences</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md mt-8">
            <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline flex items-center gap-2"><Palette className="w-5 h-5 text-primary"/> Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-3 rounded-md border hover:bg-muted/50">
                    <div className="flex-grow">
                        <Label htmlFor="darkMode" className="font-normal cursor-pointer text-base sm:text-lg">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                    </div>
                    <Switch 
                      id="darkMode" 
                      checked={darkModeEnabled}
                      onCheckedChange={setDarkModeEnabled}
                      disabled // Dark mode toggle would need actual theme switching logic
                      className="mt-1 sm:mt-0 shrink-0"
                    />
                </div>
                <p className="text-sm text-muted-foreground">More appearance settings coming soon!</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <Card className="shadow-md border-destructive/50">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-headline text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-md border border-destructive/30 bg-destructive/5">
            <Image 
                src="https://6000-firebase-studio-1748787162267.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev/_next/static/media/fc67ac1800000000.png" 
                alt="Prohibited symbol" 
                width={300} 
                height={200} 
                className="rounded-lg mb-4 sm:mb-0 sm:mr-6 hidden sm:block max-w-[150px] sm:max-w-[200px] md:max-w-[300px]" 
                data-ai-hint="prohibited symbol" />
            <div className="flex-grow">
              <h4 className="font-semibold text-lg">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <Button variant="destructive" className="mt-4 sm:mt-0 sm:ml-4 shrink-0 w-full sm:w-auto" onClick={() => toast({variant: "destructive", title: "Action Disabled", description: "Account deletion is not implemented yet."})}>Delete My Account</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
