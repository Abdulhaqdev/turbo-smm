"use client"

import { useStore } from "@/lib/store"
import { ArrowDownLeft, ArrowUpRight, CreditCard, ShoppingBag } from "lucide-react"

export function TransactionsView() {
  const { transactions } = useStore()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "order":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Transaction History</h3>
        <p className="text-sm text-muted-foreground">View your recent financial transactions</p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h4 className="font-medium mb-2">No transactions yet</h4>
          <p className="text-sm text-muted-foreground">Your transaction history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.type === "deposit"
                      ? "Deposit"
                      : transaction.type === "withdrawal"
                        ? "Withdrawal"
                        : "Order Payment"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  <p className="text-xs text-muted-foreground">{transaction.description}</p>
                </div>
              </div>
              <p className={`font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

