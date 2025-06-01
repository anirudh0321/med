"use client";

import React, { useState, useTransition } from 'react';
import { RelevantHealthPromptInput, RelevantHealthPromptOutput, getRelevantHealthPrompt } from '@/ai/flows/health-prompt-relevance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Sparkles, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react';
import { Medication } from '@/lib/types'; // Assuming you have this type

interface HealthPromptFormProps {
  userMedications: Medication[]; // Pass the user's current medications
}

export function HealthPromptForm({ userMedications }: HealthPromptFormProps) {
  const [healthAdvice, setHealthAdvice] = useState('');
  const [aiResponse, setAiResponse] = useState<RelevantHealthPromptOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!healthAdvice.trim()) {
      setError("Please enter some health advice.");
      return;
    }
    setError(null);
    setAiResponse(null);

    startTransition(async () => {
      try {
        const medicationList = userMedications.map(med => med.name).join(', ');
        const input: RelevantHealthPromptInput = {
          medicationList: medicationList || "No medications listed", // Handle empty list
          healthAdvice,
        };
        const response = await getRelevantHealthPrompt(input);
        setAiResponse(response);
      } catch (e) {
        console.error("Error getting health prompt relevance:", e);
        setError("Failed to analyze health advice. Please try again.");
      }
    });
  };

  const dismissAlert = () => {
    setAiResponse(null);
    setError(null);
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-primary" />
          <CardTitle className="text-2xl font-headline">Personalized Health Insight</CardTitle>
        </div>
        <CardDescription>
          Enter any health or safety advice you&apos;ve heard. Our AI will help determine its relevance to your current medications.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Avoid grapefruit juice, Get 8 hours of sleep, Don't operate heavy machinery..."
            value={healthAdvice}
            onChange={(e) => setHealthAdvice(e.target.value)}
            rows={4}
            className="resize-none"
            aria-label="Health advice input"
          />
          <Button type="submit" disabled={isPending || !healthAdvice.trim()} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Advice
              </>
            )}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col items-start">
        {error && (
          <Alert variant="destructive" className="w-full mb-4">
             <div className="flex justify-between items-start">
              <div>
                <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={dismissAlert} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}
        {aiResponse && (
          <Alert variant={aiResponse.isRelevant ? "default" : "default"} className={`w-full ${aiResponse.isRelevant ? 'border-green-500 bg-green-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
             <div className="flex justify-between items-start">
              <div>
                {aiResponse.isRelevant ? <CheckCircle className="h-5 w-5 inline-block mr-2 text-green-600" /> : <Lightbulb className="h-5 w-5 inline-block mr-2 text-blue-600" />}
                <AlertTitle className={aiResponse.isRelevant ? "text-green-700" : "text-blue-700"}>
                  AI Analysis: {aiResponse.isRelevant ? "Potentially Relevant" : "General Information"}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  <strong>Relevance:</strong> {aiResponse.isRelevant ? "This advice may be relevant to your medications." : "This advice is likely general information."}
                  <br />
                  <strong>Reasoning:</strong> {aiResponse.reason}
                </AlertDescription>
              </div>
               <Button variant="ghost" size="icon" onClick={dismissAlert} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
               </Button>
            </div>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
