"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function FeedbackCharts({ data }) {
  // Prepare data for pie chart
  const pieData = [
    { name: "Positive", value: data.filter((item) => item.user_response === "Yes").length, color: "#16a34a" },
    { name: "Negative", value: data.filter((item) => item.user_response === "No").length, color: "#dc2626" },
  ]

  // Prepare data for bar chart - by category
  const categoryData = Array.from(
    data.reduce((acc, item) => {
      const category = item.category_name
      if (!acc.has(category)) {
        acc.set(category, {
          name: category,
          positive: 0,
          negative: 0,
        })
      }

      if (item.user_response === "Yes") {
        acc.get(category).positive += 1
      } else if (item.user_response === "No") {
        acc.get(category).negative += 1
      }

      return acc
    }, new Map()),
  ).map(([_, value]) => value)

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Feedback Analysis</CardTitle>
        <CardDescription>Visual representation of feedback data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>
          <TabsContent value="distribution" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="categories" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="positive" name="Positive" fill="#16a34a" />
                  <Bar dataKey="negative" name="Negative" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}