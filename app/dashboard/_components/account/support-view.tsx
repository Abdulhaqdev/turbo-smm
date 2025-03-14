"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle, // Yangi qo‘shildi
  DialogDescription, // Yangi qo‘shildi (ixtiyoriy, lekin tavsiya qilinadi)
} from "@/components/ui/dialog";
import { MessageSquare, Plus, Send, User, CheckCircle, Clock, AlertCircle } from "lucide-react";

export function SupportView() {
  const { supportTickets, addSupportTicket, addTicketReply } = useStore();
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  // Handle new ticket submission
  const handleSubmitTicket = () => {
    if (subject.trim() && message.trim()) {
      addSupportTicket({
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubject("");
      setMessage("");
      setIsNewTicketOpen(false);
    }
  };

  // Handle reply submission
  const handleSubmitReply = () => {
    if (activeTicketId && replyMessage.trim()) {
      addTicketReply(activeTicketId, replyMessage.trim());
      setReplyMessage("");
    }
  };

  // Get active ticket
  const activeTicket = activeTicketId ? supportTickets.find((ticket) => ticket.id === activeTicketId) : null;

  // Render ticket list view
  if (!activeTicketId) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Support Tickets</h3>
            <p className="text-sm text-muted-foreground">View and manage your support requests</p>
          </div>
          <Button onClick={() => setIsNewTicketOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {supportTickets.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h4 className="font-medium mb-2">No support tickets</h4>
            <p className="text-sm text-muted-foreground mb-4">You haven't created any support tickets yet.</p>
            <Button onClick={() => setIsNewTicketOpen(true)}>Create Your First Ticket</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setActiveTicketId(ticket.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{ticket.subject}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(ticket.status)}
                    <span className="text-xs capitalize">{ticket.status}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.message}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(ticket.date)}</span>
                  <span>{ticket.replies?.length || 0} replies</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Ticket Dialog */}
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Support Ticket</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new support request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Enter ticket subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitTicket}>Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Render ticket detail view
  return (
    <div className="flex flex-col h-full">
      {activeTicket && (
        <>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{activeTicket.subject}</h3>
              <div className="flex items-center gap-1">
                {getStatusIcon(activeTicket.status)}
                <span className="text-xs capitalize">{activeTicket.status}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Created on {formatDate(activeTicket.date)}</p>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {/* Original message */}
            <div className="flex gap-4 mb-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p>{activeTicket.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(activeTicket.date)}</p>
              </div>
            </div>

            {/* Replies */}
            {activeTicket.replies?.map((reply) => (
              <div key={reply.id} className={`flex gap-4 mb-6 ${reply.isAdmin ? "flex-row" : "flex-row-reverse"}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    reply.isAdmin ? "bg-blue-500" : "bg-primary"
                  }`}
                >
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className={`rounded-lg p-4 text-sm ${reply.isAdmin ? "bg-blue-500/10" : "bg-muted"}`}>
                  <p>{reply.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(reply.date)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply input */}
          {activeTicket.status !== "closed" && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your reply..."
                  className="min-h-[80px]"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <Button className="shrink-0" onClick={handleSubmitReply} disabled={!replyMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => setActiveTicketId(null)}>
              Back to Tickets
            </Button>
          </div>
        </>
      )}
    </div>
  );
}