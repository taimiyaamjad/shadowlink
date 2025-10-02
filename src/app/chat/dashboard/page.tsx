"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getDashboardData } from '@/app/actions/dashboard';
import { BarChart, LineChart, PieChart, MessageSquarePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const pieData = [
    { name: 'Direct', value: 400, fill: 'hsl(var(--primary))' },
    { name: 'Referral', value: 300, fill: 'hsl(var(--accent))' },
    { name: 'Social', value: 200, fill: 'hsl(var(--secondary))' },
    { name: 'Organic', value: 278, fill: 'hsl(var(--muted-foreground))' },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getDashboardData(user.uid)
                .then(data => {
                    setDashboardData(data);
                    setLoading(false);
                })
                .catch(console.error);
        }
    }, [user]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
        <Button asChild>
            <Link href="/chat">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                New Chat
            </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{dashboardData?.totalMessages || 0}</div>}
            {loading ? <Skeleton className="h-4 w-40 mt-1" /> : <p className="text-xs text-muted-foreground">All time</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Messages
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{dashboardData?.aiMessages || 0}</div>}
            {loading ? <Skeleton className="h-4 w-40 mt-1" /> : <p className="text-xs text-muted-foreground">All time</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Messages</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{dashboardData?.userMessages || 0}</div>}
            {loading ? <Skeleton className="h-4 w-40 mt-1" /> : <p className="text-xs text-muted-foreground">All time</p>}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{dashboardData?.totalConversations || 0}</div>}
            {loading ? <Skeleton className="h-4 w-40 mt-1" /> : <p className="text-xs text-muted-foreground">Total conversations started</p>}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Message Volume (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? <Skeleton className="h-[350px] w-full" /> : (
            <ResponsiveContainer width="100%" height={350}>
                <RechartsBarChart data={dashboardData?.messageVolume || []}>
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    User
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    AI
                                  </span>
                                  <span className="font-bold">
                                    {payload[1].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="user" stackId="a" fill="hsl(var(--primary))" name="User" />
                    <Bar dataKey="ai" stackId="a" fill="hsl(var(--accent))" name="AI" />
                </RechartsBarChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Message Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[350px] w-full" /> : (
             <ResponsiveContainer width="100%" height={350}>
                <RechartsPieChart>
                    <Pie
                        data={dashboardData?.messageDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {(dashboardData?.messageDistribution || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip />
                </RechartsPieChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
