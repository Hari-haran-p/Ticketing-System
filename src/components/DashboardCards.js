"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FeedbackTable } from "@/components/FeedbackTable";

export function DashboardCards({ data }) {

  const totalFeedback = data.length;
  const positiveFeedback = data.filter(
    (item) => item.user_response === "Yes"
  ).length;
  const negativeFeedback = data.filter(
    (item) => item.user_response === "No"
  ).length;
  const positivePercentage =
    totalFeedback > 0
      ? Math.round((positiveFeedback / totalFeedback) * 100)
      : 0;
    const uniqueUsersCount = new Set(data.map((item) => item.user_name)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFeedback}</div>
          <p className="text-xs text-muted-foreground">
            From all assets and categories
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{positiveFeedback}</div>
          <p className="text-xs text-muted-foreground">
            {positivePercentage}% of total feedback
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Negative Feedback</CardTitle>
          <ThumbsDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{negativeFeedback}</div>
          <p className="text-xs text-muted-foreground">
            {100 - positivePercentage}% of total feedback
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueUsersCount}</div>
          <p className="text-xs text-muted-foreground">
            Provided feedback this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}