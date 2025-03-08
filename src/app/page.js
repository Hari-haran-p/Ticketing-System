// pages/index.js
"use client"

import { DashboardHeader } from "@/components/DashboardHeader"
import { FeedbackCharts } from "@/components/FeedbackCharts"
import { FeedbackTable } from "@/components/FeedbackTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ThumbsDown, ThumbsUp, Users } from "lucide-react"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DashboardCards } from "@/components/DashboardCards";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/admin/feedback");
        console.log(response.data?.data);

        setData(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
        setError("Failed to load feedback. Please try again later.");
        toast.error("Failed to load feedback.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full p-6">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <DashboardHeader />
      <DashboardCards data={data}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackCharts data={data} />
        <FeedbackTable data={data} />
      </div>
    </div>
  );
}