
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Bot, Lightbulb } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { BudgetItem } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '@/context/language-context';
import { categorizeBudgetItems, type CategorizeBudgetItemsOutput } from '@/ai/flows/categorize-budget-items';
import { analyzeSpendingHabits, type AnalyzeSpendingHabitsOutput } from '@/ai/flows/analyze-spending-habits';
import { useToast } from '@/hooks/use-toast';

export function BudgetManager() {
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [categorizedItems, setCategorizedItems] = useState<CategorizeBudgetItemsOutput['budgetItems']>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeSpendingHabitsOutput | null>(null);
    const { t } = useLanguage();
    const { toast } = useToast();
    
    const receiptPlaceholder = PlaceHolderImages.find(p => p.id === 'receipt-scan');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                setReceiptImage(dataUri);
                setCategorizedItems([]);
                setAnalysisResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeReceipt = async () => {
        if (!receiptImage) return;

        setIsCategorizing(true);
        setIsAnalyzing(true);
        setCategorizedItems([]);
        setAnalysisResult(null);

        try {
            // Step 1: Categorize items
            const budgetCategories = ['Groceries', 'Toiletries', 'Entertainment', 'Transport', 'Utilities', 'Other'];
            const items = await categorizeBudgetItems({ receiptDataUri: receiptImage, budgetCategories });
            setCategorizedItems(items.budgetItems);
            setIsCategorizing(false);

            // Step 2: Analyze spending habits
            if (items.budgetItems.length > 0) {
                const analysis = await analyzeSpendingHabits({
                    expenses: items.budgetItems,
                    budgetId: 'temp-budget-id', // Using a temporary ID as per schema
                });
                setAnalysisResult(analysis);
            }
        } catch (error: any) {
            console.error("AI analysis failed:", error);
            toast({
                variant: "destructive",
                title: "AI Analysis Failed",
                description: error.message || "There was an issue analyzing your receipt. Please try again.",
            });
        } finally {
            setIsCategorizing(false);
            setIsAnalyzing(false);
        }
    };
    
    const isLoading = isCategorizing || isAnalyzing;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">{t('budget.title')}</h1>
                <p className="text-muted-foreground">{t('budget.description')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>{t('budget.uploadTitle')}</CardTitle>
                        <CardDescription>{t('budget.uploadDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label htmlFor="receipt-upload" className="cursor-pointer">
                                <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 transition-colors">
                                    {receiptImage ? (
                                        <Image src={receiptImage} alt="Receipt preview" width={300} height={400} className="object-contain h-full w-full rounded-md" />
                                    ) : (
                                       <>
                                        {receiptPlaceholder && <Image src={receiptPlaceholder.imageUrl} alt={receiptPlaceholder.description} width={150} height={200} data-ai-hint={receiptPlaceholder.imageHint} className="opacity-20 mb-2" />}
                                        <Upload className="h-8 w-8 mb-2" />
                                        <p>{t('budget.clickToUpload')}</p>
                                        <p className="text-xs">{t('budget.fileTypes')}</p>
                                       </>
                                    )}
                                </div>
                            </Label>
                            <Input id="receipt-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAnalyzeReceipt} disabled={!receiptImage || isLoading}>
                            <Bot className="me-2 h-4 w-4" />
                            {isLoading ? t('budget.analyzing') : t('budget.analyzeButton')}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('budget.expensesTitle')}</CardTitle>
                            <CardDescription>{t('budget.expensesDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('budget.item')}</TableHead>
                                        <TableHead>{t('budget.category')}</TableHead>
                                        <TableHead className="text-right">{t('budget.price')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isCategorizing && Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-16 ms-auto" /></TableCell>
                                        </TableRow>
                                    ))}
                                    {!isCategorizing && categorizedItems.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                {t('budget.uploadPrompt')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!isCategorizing && categorizedItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell className="text-right">PKR {item.price.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                     {(isAnalyzing && !isCategorizing) && (
                        <Alert className="border-primary/50">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary font-bold">{t('budget.analysisTitle')}</AlertTitle>
                            <AlertDescription>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {analysisResult && !isLoading && (
                         <Alert className="border-primary/50">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary font-bold">{t('budget.analysisTitle')}</AlertTitle>
                            <AlertDescription>
                                <p className="font-semibold">{analysisResult.analysis}</p>
                                <p className="mt-2">{analysisResult.recommendations}</p>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
