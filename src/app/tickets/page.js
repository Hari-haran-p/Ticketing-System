"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Filter,
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios"; // Import axios
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAGE_SIZE = 10; // Number of tickets per page

export default function TicketingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [ticketQuestions, setTicketQuestions] = useState([]); // Added State
  const [dialogMode, setDialogMode] = useState(null); // Added State
  /*
   *Modes: "UPDATE" : Shows Description and  overall Ticket Status
   * "QUESTIONS" : Show Question section in Ticket and Questions
   */

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at"); // Default sort by created date
  const [sortOrder, setSortOrder] = useState("desc"); // Default descending order

  // Add Loading State
  const [loading, setLoading] = useState(false);
  const getTickets = async () => {
    try {
      const response = await axios.get("/api/admin/tickets"); // Your actual API endpoint
      setTickets(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err?.message);
      setError(`Failed to load tickets: ${err?.message}`);
      setTickets([]);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  // Memoized filtered tickets (for search and status filter)
  const filteredTicketsMemo = useMemo(() => {
    let filtered = Array.isArray(tickets) ? [...tickets] : []; // Create a copy

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === activeTab);
    }

    // Filter by search term (title or feedback_id)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.title?.toLowerCase().includes(term) ||
          String(ticket.feedback_id)?.includes(term)
      );
    }

    return filtered;
  }, [tickets, activeTab, searchTerm]);

  // Memoized sorted tickets (for sorting)
  const sortedTickets = useMemo(() => {
    const sorted = [...filteredTicketsMemo]; // Use filteredTicketsMemo here!
    sorted.sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1; // Ascending or descending
      if (sortBy === "feedback_id") {
        return order * (Number(a.feedback_id) - Number(b.feedback_id)); // Numeric sort
      } else {
        // Assuming string or date sort (using localeCompare for strings and getTime for dates)
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return order * aValue.localeCompare(bValue); //For string
        } else if (aValue instanceof Date && bValue instanceof Date) {
          return order * (aValue.getTime() - bValue.getTime()); //For Date
        } else {
          return 0; // Handle cases where the values being compared are not strings or dates
        }
      }
    });
    return sorted;
  }, [filteredTicketsMemo, sortBy, sortOrder]);

  // Pagination: Calculate total pages
  const totalPages = Math.ceil(sortedTickets.length / PAGE_SIZE);

  // Pagination: Get tickets for the current page
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedTickets.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedTickets, currentPage]);

  //Hande Search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page after searching
  };

  //Reset search term when tab changes
  useEffect(() => {
    setSearchTerm(""); //Clear search term here
    setCurrentPage(1); // Ensure you also reset the current page
  }, [activeTab]); //Run Use Effect only when active Tab changes

  const getStatusBadge = (status) => {
    const variants = {
      open: "secondary",
      "in-progress": "warning",
      resolved: "success",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (error) {
      console.warn("Error formatting date:", error?.message);
      return dateString;
    }
  };
  // API Function for Questions and set them when clicked
  const fetchTicketQuestions = async (ticketId) => {
    try {
      const response = await axios.get(
        `/api/admin/ticket-questions?ticketId=${ticketId}`
      ); // Replace with your actual endpoint
      setTicketQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching ticket questions:", error?.message);
      setError(`Failed to fetch ticket questions: ${error?.message}`);
      setTicketQuestions([]);
    }
  };
  const handleQuestionsClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
    fetchTicketQuestions(ticket.ticket_id); // Load Questions
    setDialogMode("QUESTIONS");
  };
  const handleRowClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
    setDialogMode("UPDATE");
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setLoading(true); //Start loading
    try {
      const updateTicketStatus = async (ticketId, newStatus) => {
        try {
          const response = await axios.put(`/api/admin/tickets/${ticketId}`, {
            status: newStatus,
          });
          return response.data;
        } catch (error) {
          console.error(
            `Error updating ticket status for ID ${ticketId}:`,
            error?.message
          );
          throw new Error(`Failed to update ticket status: ${error?.message}`);
        }
      };

      await updateTicketStatus(ticketId, newStatus);
      setTickets(
        tickets.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );
      setSelectedTicket((prevState) => ({ ...prevState, status: newStatus }));
      setError(null);

      if (newStatus === "resolved") {
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Error updating ticket status:", err?.message);
      setError(`Failed to update status: ${err?.message}`);
      // Handle error (e.g., display an error message)
    } finally {
      setLoading(false); //Stop loading
    }
  };

  const getTableItemStatus = (question) => {
    const variants = {
      open: "secondary",
      "in-progress": "warning",
      resolved: "success",
    };
    return (
      <Badge variant={variants[question.status] || "outline"}>
        {question.status}
      </Badge>
    );
  };

  const handleUpdateQuestionStatus = async (ticketQuestionId, newStatus) => {
    try {
      setLoading(true); //Start loading
      await axios.put(`/api/admin/ticket-questions/${ticketQuestionId}`, {
        status: newStatus,
      }); //Replace to your API

      // Update the ticketQuestions state to reflect the change
      setTicketQuestions((prevQuestions) => {
        const updatedQuestions = prevQuestions.map((question) =>
          question.ticket_question_id === ticketQuestionId
            ? { ...question, status: newStatus }
            : question
        );

        //Check for All ticket to set to Resolved
        const allResolved = updatedQuestions.every(
          (q) => q.status === "resolved"
        );

        //If All Questions was set to Resolved: set the tickets with the function
        if (allResolved && newStatus === "resolved") {
          toast.success("All question in the ticket are resolved");
        } else if (selectedTicket.status === "resolved") {
          toast.error(
            "The tickets are already resolved if you want to continue then revert it"
          );
        } else if (allResolved) {
          handleUpdateStatus(selectedTicket?.ticket_id, "resolved");
        }

        return updatedQuestions; //Return to the questions
      });
    } catch (error) {
      console.error("Error updating ticket question status:", error?.message);
      setError(`Failed to update ticket question status: ${error?.message}`);
    } finally {
      setLoading(false); //Stop loading
    }
  };

  // Filter tickets based on active tab
  const filteredTickets = Array.isArray(tickets)
    ? tickets.filter((ticket) => {
        if (activeTab === "all") return true;
        return ticket.status === activeTab;
      })
    : [];

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // If already sorting by this field, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new field, set the sort field and default to descending order
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <ToastContainer />
      <PageHeader
        title="Ticketing System"
        description="Manage support tickets for negative feedback"
        count={filteredTickets?.length}
      />

      <div className="flex items-center justify-between">
        <Tabs
          defaultValue="all"
          className="w-[400px]"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-md"
          />
        </div>
      </div>

      {error && <div className="text-red-500">Error: {error}</div>}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            View and manage all support tickets created from negative feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSortChange("title")}
                  className="cursor-pointer"
                >
                  <Button className="cursor-pointer" variant="ghost">
                    Title{" "}
                    {sortBy === "title" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4 inline-block" />
                      ) : (
                        <ChevronDown className="h-4 w-4 inline-block" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead
                  onClick={() => handleSortChange("feedback_id")}
                  className="cursor-pointer"
                >
                  <Button className="cursor-pointer" variant="ghost">
                    Feedback ID{" "}
                    {sortBy === "feedback_id" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4 inline-block" />
                      ) : (
                        <ChevronDown className="h-4 w-4 inline-block" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead
                  onClick={() => handleSortChange("created_at")}
                  className="cursor-pointer"
                >
                  <Button className="cursor-pointer" variant="ghost">
                    Created{" "}
                    {sortBy === "created_at" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4 inline-block" />
                      ) : (
                        <ChevronDown className="h-4 w-4 inline-block" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead
                  variant="ghost"
                  onClick={() => handleSortChange("status")}
                  className="cursor-pointer"
                >
                  Status{" "}
                  {sortBy === "created_at" &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="h-4 w-4 inline-block" />
                    ) : (
                      <ChevronDown className="h-4 w-4 inline-block" />
                    ))}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets?.map((ticket) => (
                <TableRow
                  key={ticket?.ticket_id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{ticket?.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">#{ticket?.feedback_id}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(ticket?.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(ticket?.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/*Button with Question Modal Pop Up*/}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDialogMode("QUESTIONS");
                          handleQuestionsClick(ticket);
                        }}
                        disabled={loading}
                      >
                        Questions
                      </Button>
                      {/*Button with Ticket Modal Pop Up*/}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDialogMode("UPDATE");
                          handleRowClick(ticket);
                        }}
                        disabled={loading}
                      >
                        Ticket
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) || (
                <tr>
                  <TableCell colSpan={5} className="text-center">
                    No tickets found.
                  </TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <p className="text-center">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Ticket Details Dialog (Popup) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription>
              Details for Feedback ID #{selectedTicket?.feedback_id}
            </DialogDescription>
          </DialogHeader>

          {/* Conditionally render content based on mode */}
          {dialogMode === "QUESTIONS" &&
          selectedTicket &&
          ticketQuestions &&
          ticketQuestions.length > 0 ? (
            // If "Questions" was clicked: show questions and individual statuses
            <div>
              {ticketQuestions?.map((question) => (
                <div key={question.ticket_question_id} className="mb-4">
                  <p>
                    <strong>Question:</strong> {question.question}
                  </p>
                  <p>
                    <strong>Response:</strong> {question.response}
                  </p>
                  <p>
                    <strong>Status:</strong> {getStatusBadge(question.status)}
                  </p>

                  {/* Action Buttons to update the Status */}
                  {question.status === "open" && (
                    <Button
                      onClick={() =>
                        handleUpdateQuestionStatus(
                          question.ticket_question_id,
                          "in-progress"
                        )
                      }
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Mark as In Progress
                    </Button>
                  )}
                  {question.status === "in-progress" && (
                    <>
                      <Button
                        onClick={() =>
                          handleUpdateQuestionStatus(
                            question.ticket_question_id,
                            "resolved"
                          )
                        }
                        disabled={loading}
                      >
                        {" "}
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Mark as Resolved
                      </Button>
                      <Button
                        onClick={() =>
                          handleUpdateQuestionStatus(
                            question.ticket_question_id,
                            "open"
                          )
                        }
                        disabled={loading}
                      >
                        {" "}
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Revert to Open
                      </Button>
                    </>
                  )}
                  {question.status === "resolved" && (
                    <Button
                      onClick={() =>
                        handleUpdateQuestionStatus(
                          question.ticket_question_id,
                          "in-progress"
                        )
                      }
                      disabled={loading}
                    >
                      {" "}
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Revert to In Progress
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : dialogMode === "UPDATE" && selectedTicket ? (
            // If Row was clicked: show overall ticket update options
            <div>
              <p>
                <strong>Description:</strong> {selectedTicket?.description}
              </p>
              {activeTab === "all" && selectedTicket?.status === "open" && (
                <Button
                  onClick={() =>
                    handleUpdateStatus(selectedTicket?.ticket_id, "in-progress")
                  }
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mark as In Progress
                </Button>
              )}

              {activeTab === "in-progress" &&
                selectedTicket?.status === "in-progress" && (
                  <>
                    <Button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedTicket?.ticket_id,
                          "resolved"
                        )
                      }
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Mark as Resolved
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateStatus(selectedTicket?.ticket_id, "open")
                      }
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Revert to Open
                    </Button>
                  </>
                )}

              {activeTab === "resolved" &&
                selectedTicket?.status === "resolved" && (
                  <Button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedTicket?.ticket_id,
                        "in-progress"
                      )
                    }
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Revert to In Progress
                  </Button>
                )}
            </div>
          ) : (
            <p>Please select a ticket.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// add all the error handling stuff what is missed
