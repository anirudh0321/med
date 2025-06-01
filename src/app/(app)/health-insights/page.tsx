
"use client";

import React, { useState, useEffect } from 'react';
import { HealthPromptForm } from '@/components/dashboard/health-prompt-form';
import { Medication, HealthInsight } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck, BookOpen, Lightbulb, Loader2 } from 'lucide-react';
import Image from 'next/image';

const mockGeneralTips: HealthInsight[] = [
  { id: 'tip1', title: 'Stay Hydrated', content: 'Drinking enough water is crucial for overall health and can affect how medications are absorbed and processed.', type: 'general_tip', source: 'General Health Wisdom' },
  { id: 'tip2', title: 'Consistent Sleep', content: 'Aim for 7-9 hours of quality sleep per night. Sleep impacts your body\'s ability to heal and manage stress.', type: 'general_tip', source: 'Wellness Experts' },
  { id: 'tip3', title: 'Balanced Diet', content: 'A diet rich in fruits, vegetables, lean proteins, and whole grains supports your well-being and medication efficacy.', type: 'general_tip', source: 'Nutrition Guidelines' },
];

export default function HealthInsightsPage() {
  const [isClient, setIsClient] = useState(false);
  const [userMedications, setUserMedications] = useState<Medication[]>([]);
  const [generalTips, setGeneralTips] = useState<HealthInsight[]>(mockGeneralTips);
  const [isLoadingPage, setIsLoadingPage] = useState(true); // For loading medications and tips

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsLoadingPage(true);
      // Load medications from localStorage
      const storedMedicationsString = localStorage.getItem('pillPalMedications');
      if (storedMedicationsString) {
        setUserMedications(JSON.parse(storedMedicationsString));
      } else {
        setUserMedications([]); // Default to empty if nothing in localStorage
        // Initialize if it's the very first load for the app
        localStorage.setItem('pillPalMedications', JSON.stringify([]));
      }

      // Simulate data fetching for general tips
      // In a real app, this might be an API call
      setGeneralTips(mockGeneralTips); 
      
      setIsLoadingPage(false);
    }
  }, [isClient]);
  
  if (isLoadingPage && isClient) {
     return (
      <div className="container mx-auto p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading health insights...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            <CardTitle className="text-2xl sm:text-3xl font-headline">Personalized Health & Safety Insights</CardTitle>
          </div>
          <CardDescription className="text-base sm:text-lg">
            Use our AI tool to check relevance of health advice to your medications, and browse general wellness tips.
          </CardDescription>
        </CardHeader>
      </Card>

      <HealthPromptForm userMedications={userMedications} />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <CardTitle className="text-xl sm:text-2xl font-headline">General Wellness Tips</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">
            Browse these general tips for improving your overall health. Always consult your doctor for personalized medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalTips.length > 0 ? (
            generalTips.map(tip => (
              <Card key={tip.id} className="bg-accent/10 border-accent/30 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.content}</p>
                  {tip.source && <p className="text-xs text-muted-foreground/70 mt-2">Source: {tip.source}</p>}
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="text-center py-10">
              <Image src="https://placehold.co/300x200.png" alt="No tips available" width={200} height={133} className="mx-auto mb-4 rounded-lg opacity-70 max-w-[70%] sm:max-w-xs" data-ai-hint="empty state lightbulb" />
              <p className="text-muted-foreground">No general wellness tips available at the moment. Check back later!</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Alert variant="default" className="border-primary/50 bg-primary/5">
        <AlertCircle className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Important Disclaimer</AlertTitle>
        <AlertDescription className="text-sm">
          The information provided by the AI analysis and general tips is for informational purposes only and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </AlertDescription>
      </Alert>
    </div>
  );
}

