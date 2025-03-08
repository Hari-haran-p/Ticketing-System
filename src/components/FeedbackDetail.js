// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"

// export function FeedbackDetail({ feedback }) {
//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Name</p>
//               <p>{feedback.name}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Mobile</p>
//               <p>{feedback.mobile}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Rating</p>
//               <Badge variant={feedback.rating < 3 ? "destructive" : "outline"}>{feedback.rating}/5</Badge>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Asset ID</p>
//               <p>{feedback.asset_id}</p>
//             </div>
//           </div>

//           <Separator />

//           <div>
//             <p className="text-sm font-medium text-muted-foreground mb-2">Feedback</p>
//             <p>{feedback.feedbacktxt || "No feedback text provided"}</p>
//           </div>

//           <Separator />

//           <div>
//             <p className="text-sm font-medium text-muted-foreground mb-2">Question Responses</p>
//             <div className="space-y-3">
//               {feedback.questions &&
//                 feedback.questions.map((question, index) => (
//                   <div key={index} className="bg-muted/50 p-3 rounded-md">
//                     <p className="font-medium">{question.question}</p>
//                     <p className={`mt-1 ${question.response === "No" ? "text-destructive" : ""}`}>
//                       Response: {question.response}
//                     </p>
//                     {question.comment && <p className="mt-1 text-sm">Comment: {question.comment}</p>}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

