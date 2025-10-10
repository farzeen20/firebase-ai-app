'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { analyzeUserText } from '@/ai/flows/analyze-user-text';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { BachatPalLogo } from '../bachat-pal-logo';

export function BachatPal() {
    const [userInput, setUserInput] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!userInput.trim()) return;
        setIsLoading(true);
        setAnalysis('');
        try {
            const result = await analyzeUserText({ text: userInput });
            setAnalysis(result.analysis);
        } catch (error: any) {
            console.error("Bachat Pal analysis failed:", error);
            toast({
                variant: "destructive",
                title: "AI Analysis Failed",
                description: error.message || "There was an issue with the analysis. Please check the console.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
                <BachatPalLogo className="h-12 w-12 text-primary" />
                <div>
                    <CardTitle className="text-2xl font-bold text-primary">Bachat Pal</CardTitle>
                    <CardDescription>Your personal AI finance assistant. How can I help you today?</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="e.g., 'I want to save more money this month' or 'How can I reduce my grocery bills?'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={3}
                />
                <Button onClick={handleAnalyze} disabled={isLoading || !userInput.trim()}>
                    <Sparkles className="me-2 h-4 w-4" />
                    {isLoading ? 'Analyzing...' : 'Ask Bachat Pal'}
                </Button>

                {isLoading && (
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                )}

                {analysis && !isLoading && (
                    <Alert className="mt-4 border-primary/50 bg-primary/5">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="font-bold text-primary">Bachat Pal says:</AlertTitle>
                        <AlertDescription>
                            <p className="text-foreground">{analysis}</p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
