"use client"

import { PageHeader } from "@/components/PageHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-fox-toast";
import { Loader2 } from "lucide-react";
import { PositiveFeedbackTable } from "@/components/PositiveFeedbackTable";

export default function PositiveFeedback() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/admin/positive-feedback");
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full p-6">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading feedback...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Positive Feedback"
        description="View all positive feedback from users"
        count={data.length}
      />
      <PositiveFeedbackTable data={data} />
    </div>
  );
}
