"use client"

import { useState } from "react"
// import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "../_components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "../_components/ui/use-toast"
import { MessageSquare, HelpCircle, FileQuestion } from "lucide-react"
import { Header } from '../_components/header'

export default function SupportPage() {
  const { toast } = useToast()

  const [subject, setSubject] = useState<string>("")
  const [orderId, setOrderId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = () => {
    // Validate form
    if (!subject || !message) {
      toast({
        title: "Incomplete form",
        description: "Please select a subject and enter a message.",
        variant: "destructive",
      })
      return
    }

    // Simulate form submission
    setIsSubmitting(true)

    setTimeout(() => {
      // Show success toast
      toast({
        title: "Support ticket submitted",
        description: "We've received your message and will respond shortly.",
        variant: "success",
      })

      // Reset form
      setSubject("")
      setOrderId("")
      setMessage("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">Support</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </CardTitle>
                <CardDescription>Get help with your orders or account</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="account">Account Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="order-id">Order ID (Optional)</Label>
                    <Input
                      id="order-id"
                      placeholder="Enter order ID if applicable"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue in detail"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    FAQ
                  </CardTitle>
                  <CardDescription>Frequently asked questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">How long do orders take to complete?</h3>
                      <p className="text-sm text-muted-foreground">
                        Order completion times vary by service. You can see the average time for each service on the
                        services page.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">What payment methods do you accept?</h3>
                      <p className="text-sm text-muted-foreground">
                        We currently accept credit and debit cards for payments.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Is my order guaranteed?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, all orders are guaranteed. If we cannot deliver, you will receive a full refund.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All FAQs
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5" />
                    Knowledge Base
                  </CardTitle>
                  <CardDescription>Guides and tutorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">How to place your first order</h3>
                      <p className="text-sm text-muted-foreground">
                        A step-by-step guide to placing your first order on TurboSMM.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Understanding service metrics</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn what the different metrics and terms mean for our services.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Tips for maximizing results</h3>
                      <p className="text-sm text-muted-foreground">
                        Best practices for getting the most out of your social media marketing.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Browse Knowledge Base
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

