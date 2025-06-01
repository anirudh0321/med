"use client";

import React, { useState, useEffect } from 'react';
import { HealthPromptForm } from '@/components/dashboard/health-prompt-form';
import { Medication, HealthInsight } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ShieldCheck, BookOpen, Lightbulb } from 'lucide-react';
import Image from 'next/image';

// Mock data - replace with API calls in a real app
const mockUserMedications: Medication[] = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'once_daily', times: ['08:00'], adherence: [] },
  { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'twice_daily', times: ['08:00', '20:00'], adherence: [] },
];

const mockGeneralTips: HealthInsight[] = [
  { id: 'tip1', title: 'Stay Hydrated', content: 'Drinking enough water is crucial for overall health and can affect how medications are absorbed and processed.', type: 'general_tip', source: 'General Health Wisdom' },
  { id: 'tip2', title: 'Consistent Sleep', content: 'Aim for 7-9 hours of quality sleep per night. Sleep impacts your body\'s ability to heal and manage stress.', type: 'general_tip', source: 'Wellness Experts' },
  { id: 'tip3', title: 'Balanced Diet', content: 'A diet rich in fruits, vegetables, lean proteins, and whole grains supports your well-being and medication efficacy.', type: 'general_tip', source: 'Nutrition Guidelines' },
];

export default function HealthInsightsPage() {
  const [userMedications, setUserMedications] = useState<Medication[]>(mockUserMedications);
  const [generalTips, setGeneralTips] = useState<HealthInsight[]>(mockGeneralTips);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  if (isLoading) {
     return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Lightbulb className="h-16 w-16 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-muted-foreground">Loading health insights...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Personalized Health & Safety Insights</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Use our AI tool to check relevance of health advice to your medications, and browse general wellness tips.
          </CardDescription>
        </CardHeader>
      </Card>

      <HealthPromptForm userMedications={userMedications} />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            <CardTitle className="text-2xl font-headline">General Wellness Tips</CardTitle>
          </div>
          <CardDescription>
            Browse these general tips for improving your overall health. Always consult your doctor for personalized medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalTips.length > 0 ? (
            generalTips.map(tip => (
              <Card key={tip.id} className="bg-accent/10 border-accent/30 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
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
              <Image src="https://placehold.co/300x200.png" alt="No tips available" width={200} height={133} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="empty state lightbulb" />
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
