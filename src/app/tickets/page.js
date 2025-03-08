"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'; // Import axios

// Function to fetch tickets from your API endpoint using axios
async function fetchTickets() {
  try {
    const response = await axios.get('/api/admin/tickets'); // Replace with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error?.message);
    throw new Error(`Failed to fetch tickets: ${error?.message}`);
  }
}

// Function to update ticket status using axios
async function updateTicketStatus(ticketId, newStatus) {
  try {
    const response = await axios.put(`/api/admin/tickets/${ticketId}`, { // Replace with your API endpoint
      status: newStatus,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket status for ID ${ticketId}:`, error?.message);
    throw new Error(`Failed to update ticket status: ${error?.message}`);
  }
}


export default function TicketingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [tickets, setTickets] = useState([]); // Initialize as an empty array
  const [selectedTicket, setSelectedTicket] = useState(null); // For the popup
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    async function getTickets() {
      try {
        const data = await fetchTickets();
        setTickets(Array.isArray(data) ? data : []); // Ensure data is an array
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching tickets:", err?.message);
        setError(`Failed to load tickets: ${err?.message}`); // Set the error message
        setTickets([]); // Set tickets to an empty array on error
      }
    }

    getTickets();
  }, []); // Fetch tickets on initial load


  const getStatusBadge = (status) => {
    const variants = {
      open: "secondary",
      "in-progress": "warning",
      resolved: "success",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      console.warn("Error formatting date:", error?.message);
      return dateString
    }
  }

  const handleRowClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };


  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      // Optimistically update the UI (optional, but makes it feel faster)
      setTickets(tickets.map(ticket =>
        ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      setSelectedTicket(prevState => ({ ...prevState, status: newStatus })); // Update the status in the popup too
      setError(null);

      //Close the Dialog if status is updated to resolve or closed
      if (newStatus === 'resolved') {
          setIsDialogOpen(false);
      }

    } catch (err) {
      console.error("Error updating ticket status:", err?.message);
      setError(`Failed to update status: ${err?.message}`);
      // Handle error (e.g., display an error message)
    }
  };



  // Filter tickets based on active tab
  const filteredTickets = Array.isArray(tickets) ? tickets.filter(ticket => {
    if (activeTab === "all") return true;
    return ticket.status === activeTab;
  }) : [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Ticketing System"
        description="Manage support tickets for negative feedback"
        count={filteredTickets?.length}  //Use ?. here too
      />

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      {error && (
        <div className="text-red-500">Error: {error}</div>
      )}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and manage all support tickets created from negative feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Feedback ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets?.map((ticket) => (  //Use ?. here too
                <TableRow key={ticket?.ticket_id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(ticket)}>
                  <TableCell className="font-medium">{ticket?.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">#{ticket?.feedback_id}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(ticket?.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(ticket?.status)}</TableCell>
                </TableRow>
              )) || (
                <tr>
                  <TableCell colSpan={4} className="text-center">No tickets found.</TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket Details Dialog (Popup) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription>
              Details for Feedback ID #{selectedTicket?.feedback_id}
            </DialogDescription>
          </DialogHeader>

          {/* Display "No" Response Questions */}
          {selectedTicket && (
            <div>
              <p>
                <strong>Description:</strong> {selectedTicket?.description}
              </p>

              {/* Example of displaying the relevant question (you'll need to adjust this
                  based on how your data is structured and how you fetch the question text) */}
              {selectedTicket?.apq_id && (
                <p>Related Asset Parameter Question ID: {selectedTicket?.apq_id}</p>
              )}
              {selectedTicket?.cmq_id && (
                <p>Related Category Master Question ID: {selectedTicket?.cmq_id}</p>
              )}

              {/* Action Buttons */}
              {activeTab === "all" && selectedTicket?.status === 'open' && (
                <Button onClick={() => handleUpdateStatus(selectedTicket?.ticket_id, "in-progress")}>
                  Mark as In Progress
                </Button>
              )}

              {activeTab === "in-progress" && selectedTicket?.status === 'in-progress' && (
                <Button onClick={() => handleUpdateStatus(selectedTicket?.ticket_id, "resolved")}>
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}