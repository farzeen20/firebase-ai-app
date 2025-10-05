'use client';

import type { ChartConfig } from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { user, dailySavingData, goalsData, committeesData, budgetItemsData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const goalChartData = goalsData
  .filter((goal) => goal.status === 'active')
  .map((goal) => ({
    name: goal.name,
    saved: goal.savedAmount,
    target: goal.targetAmount,
    fill: `hsl(var(--chart-${goalsData.indexOf(goal) + 1}))`,
  }));
const goalChartConfig = {
  saved: {
    label: 'Saved',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const spendingChartData = budgetItemsData.reduce((acc, item) => {
    const existing = acc.find(d => d.category === item.category);
    if (existing) {
        existing.amount += item.price;
    } else {
        acc.push({ category: item.category, amount: item.price });
    }
    return acc;
}, [] as { category: string, amount: number }[]).map((d, i) => ({...d, fill: `hsl(var(--chart-${i+1}))`}));

const spendingChartConfig = {
    amount: {
        label: "Amount",
    },
    ...Object.fromEntries(spendingChartData.map((d, i) => [d.category, { label: d.category, color: `hsl(var(--chart-${i+1}))` }]))
} satisfies ChartConfig

export function Overview() {
  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name.split(' ')[0]}!
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Savings
            </CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {dailySavingData.currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +PKR {dailySavingData.dailyAmount.toLocaleString()} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalsData.filter(g => g.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {goalsData.filter(g => g.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Committees</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{committeesData.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently participating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Family Members
            </CardTitle>
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+3</div>
            <p className="text-xs text-muted-foreground">
              In your family circle
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
            <CardDescription>
              Your progress towards your active savings goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={goalChartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={goalChartData} layout="vertical" margin={{left: 10}}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{fontSize: 12}} width={120} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="saved" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Spending Habits</CardTitle>
            <CardDescription>
              Your expense breakdown for this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer
              config={spendingChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={spendingChartData} dataKey="amount" nameKey="category" innerRadius={60}>
                    {spendingChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                 <ChartLegend
                    content={<ChartLegendContent nameKey="category" />}
                    className="-mt-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up: Groceries, Transport 📈
            </div>
            <div className="leading-none text-muted-foreground">
              AI analysis suggests optimizing utility bills.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
