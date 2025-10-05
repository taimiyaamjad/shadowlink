"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getDashboardData } from '@/app/actions/dashboard';
import { BarChart, LineChart, PieChart, MessageSquarePlus, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bar,
  BarChart as RechartsBarChart,
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

export default function DashboardPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getDashboardData(user.uid)
                .then(data => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        setDashboardData(data);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
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

       <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-accent"/>
                Digital Trajectory
            </CardTitle>
            <CardDescription>
                An AI-driven simulation of your life trajectory based on your conversational patterns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ) : dashboardData?.trajectoryAnalysis ? (
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1">Writing Style</h4>
                        <p className="text-muted-foreground">{dashboardData.trajectoryAnalysis.writingStyle}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Tone</h4>
                        <p className="text-muted-foreground">{dashboardData.trajectoryAnalysis.tone}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Response Patterns</h4>
                        <p className="text-muted-foreground">{dashboardData.trajectoryAnalysis.responsePatterns}</p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                    Start chatting to analyze your digital trajectory. More than 5 messages are needed.
                </p>
            )}
          </CardContent>
        </Card>

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
