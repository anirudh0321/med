
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCircle, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Settings</CardTitle>
          </div>
          <CardDescription className="text-lg">Manage your account preferences and application settings.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2"><UserCircle className="w-5 h-5 text-primary"/> Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <Button className="w-full">Update Profile</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2"><Bell className="w-5 h-5 text-primary"/> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
                <Label htmlFor="medicationReminders" className="font-normal flex-grow">
                  Medication Reminders
                  <p className="text-xs text-muted-foreground">Receive push notifications for scheduled medications.</p>
                </Label>
                <Switch id="medicationReminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
                <Label htmlFor="refillReminders" className="font-normal flex-grow">
                  Refill Reminders
                  <p className="text-xs text-muted-foreground">Get notified when your medication is running low.</p>
                </Label>
                <Switch id="refillReminders" />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
                <Label htmlFor="healthTips" className="font-normal flex-grow">
                  Health Tips & Insights
                  <p className="text-xs text-muted-foreground">Receive occasional health tips and insights.</p>
                </Label>
                <Switch id="healthTips" defaultChecked/>
              </div>
              <Button className="w-full mt-4">Save Notification Preferences</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md mt-8">
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2"><Palette className="w-5 h-5 text-primary"/> Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
                    <Label htmlFor="darkMode" className="font-normal flex-grow">
                    Dark Mode
                    <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
                    </Label>
                    <Switch id="darkMode" disabled />
                    {/* Dark mode toggle would need actual theme switching logic */}
                </div>
                <p className="text-sm text-muted-foreground">More appearance settings coming soon!</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <Card className="shadow-md border-destructive/50">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-md border border-destructive/30 bg-destructive/5">
            <div>
              <h4 className="font-semibold">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <Button variant="destructive" className="mt-2 sm:mt-0 sm:ml-4 shrink-0">Delete My Account</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
