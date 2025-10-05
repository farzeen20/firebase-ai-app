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

// Mock AI functions
const categorizeBudgetItems = async (receiptDataUri: string): Promise<BudgetItem[]> => {
    console.log("AI: Categorizing items from receipt...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("AI: Done!");
    return [
        { name: 'Chicken Breast', category: 'Groceries', price: 850 },
        { name: 'Basmati Rice 5kg', category: 'Groceries', price: 1600 },
        { name: 'Shampoo', category: 'Toiletries', price: 550 },
        { name: 'Movie Ticket', category: 'Entertainment', price: 1200 },
        { name: 'Petrol', category: 'Transport', price: 2500 },
    ];
};

const analyzeSpendingHabits = async (expenses: BudgetItem[]): Promise<{ analysis: string; recommendations: string; }> => {
    console.log("AI: Analyzing spending habits...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("AI: Done!");
    return {
        analysis: "Your spending is highest in Transport and Groceries. Entertainment expenses are moderate but frequent.",
        recommendations: "Consider carpooling or using public transport twice a week to reduce fuel costs. For groceries, buying in bulk and planning meals can lead to significant savings. Limit entertainment outings to a weekly budget.",
    };
};

export function BudgetManager() {
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categorizedItems, setCategorizedItems] = useState<BudgetItem[]>([]);
    const [analysisResult, setAnalysisResult] = useState<{ analysis: string; recommendations: string; } | null>(null);
    
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

        setIsLoading(true);
        const items = await categorizeBudgetItems(receiptImage);
        setCategorizedItems(items);
        const analysis = await analyzeSpendingHabits(items);
        setAnalysisResult(analysis);
        setIsLoading(false);
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Budget Manager</h1>
                <p className="text-muted-foreground">Scan your receipts and let our AI help you track and analyze your spending.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Upload Receipt</CardTitle>
                        <CardDescription>Upload a photo of your receipt to get started.</CardDescription>
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
                                        <p>Click to upload</p>
                                        <p className="text-xs">PNG, JPG, or WEBP</p>
                                       </>
                                    )}
                                </div>
                            </Label>
                            <Input id="receipt-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAnalyzeReceipt} disabled={!receiptImage || isLoading}>
                            <Bot className="mr-2 h-4 w-4" />
                            {isLoading ? 'Analyzing...' : 'Analyze with AI'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Categorized Expenses</CardTitle>
                            <CardDescription>Here's what our AI found on your receipt.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))}
                                    {!isLoading && categorizedItems.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                Upload a receipt to see categorized items.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!isLoading && categorizedItems.map((item, index) => (
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

                    {analysisResult && !isLoading && (
                         <Alert className="border-primary/50">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary font-bold">AI Savings Analysis</AlertTitle>
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
