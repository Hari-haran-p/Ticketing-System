import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentFeedbackTable({ data }) {
  // Show only the most recent 5 items
  const recentData = [...data]
    .sort((a, b) => new Date(b.feedback_date).getTime() - new Date(a.feedback_date).getTime())
    .slice(0, 5)

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>Latest feedback received from users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentData.map((item) => (
              <TableRow key={item.feedback_id}>
                <TableCell className="font-medium">{item.user_name}</TableCell>
                <TableCell>{item.asset_name}</TableCell>
                <TableCell>
                  <Badge variant={item.user_response === "Yes" ? "success" : "destructive"}>{item.user_response}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(item.feedback_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

