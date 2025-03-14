import type { SocialMediaCategory, ServiceType, Service, User, UserProfile, Transaction, SupportTicket } from "./types"

// Mock data for social media categories
export const categories: SocialMediaCategory[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    placeholder: "https://www.instagram.com/username",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "tiktok",
    placeholder: "https://www.tiktok.com/@username",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "send",
    placeholder: "https://t.me/username",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "twitter",
    placeholder: "https://twitter.com/username",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    placeholder: "https://www.youtube.com/channel/channelid",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    placeholder: "https://www.facebook.com/username",
  },
]

// Mock data for service types
export const serviceTypes: ServiceType[] = [
  // Instagram service types
  { id: "instagram_followers", name: "Followers", categoryId: "instagram" },
  { id: "instagram_likes", name: "Likes", categoryId: "instagram" },
  { id: "instagram_views", name: "Views", categoryId: "instagram" },
  { id: "instagram_comments", name: "Comments", categoryId: "instagram" },

  // TikTok service types
  { id: "tiktok_followers", name: "Followers", categoryId: "tiktok" },
  { id: "tiktok_likes", name: "Likes", categoryId: "tiktok" },
  { id: "tiktok_views", name: "Video Views", categoryId: "tiktok" },

  // Telegram service types
  { id: "telegram_members", name: "Channel Members", categoryId: "telegram" },
  { id: "telegram_post_views", name: "Post Views", categoryId: "telegram" },

  // Twitter service types
  { id: "twitter_followers", name: "Followers", categoryId: "twitter" },
  { id: "twitter_likes", name: "Likes", categoryId: "twitter" },
  { id: "twitter_retweets", name: "Retweets", categoryId: "twitter" },

  // YouTube service types
  { id: "youtube_subscribers", name: "Subscribers", categoryId: "youtube" },
  { id: "youtube_views", name: "Video Views", categoryId: "youtube" },
  { id: "youtube_likes", name: "Likes", categoryId: "youtube" },

  // Facebook service types
  { id: "facebook_likes", name: "Page Likes", categoryId: "facebook" },
  { id: "facebook_followers", name: "Followers", categoryId: "facebook" },
]

// Mock data for services
export const services: Service[] = [
  // Instagram Followers services
  {
    id: "instagram_followers_instant",
    name: "Instant Instagram Followers | Fast | HQ",
    serviceTypeId: "instagram_followers",
    rate: 5.99,
    minOrder: 100,
    maxOrder: 50000,
    averageTime: "1-2 days",
    timeInHours: 36,
  },
  {
    id: "instagram_followers_organic",
    name: "Organic Instagram Followers | Slow | Real",
    serviceTypeId: "instagram_followers",
    rate: 9.99,
    minOrder: 50,
    maxOrder: 10000,
    averageTime: "3-5 days",
    timeInHours: 96,
  },

  // Instagram Likes services
  {
    id: "instagram_likes_instant",
    name: "Instant Instagram Likes | Fast | HQ",
    serviceTypeId: "instagram_likes",
    rate: 1.99,
    minOrder: 50,
    maxOrder: 25000,
    averageTime: "30 minutes",
    timeInHours: 0.5,
  },
  {
    id: "instagram_likes_real",
    name: "Real Instagram Likes | Slow | Organic",
    serviceTypeId: "instagram_likes",
    rate: 3.99,
    minOrder: 25,
    maxOrder: 5000,
    averageTime: "1-2 days",
    timeInHours: 36,
  },

  // TikTok Followers services
  {
    id: "tiktok_followers_instant",
    name: "Instant TikTok Followers | Fast",
    serviceTypeId: "tiktok_followers",
    rate: 6.99,
    minOrder: 100,
    maxOrder: 30000,
    averageTime: "1-2 days",
    timeInHours: 36,
  },

  // TikTok Views services
  {
    id: "tiktok_views_instant",
    name: "Instant TikTok Views | Fast",
    serviceTypeId: "tiktok_views",
    rate: 0.99,
    minOrder: 500,
    maxOrder: 100000,
    averageTime: "1-6 hours",
    timeInHours: 3,
  },

  // Telegram Post Views services
  {
    id: "telegram_post_views_last1",
    name: "Telegram Post View | Last 1 Post | Best | Always Working",
    serviceTypeId: "telegram_post_views",
    rate: 0.77,
    minOrder: 10,
    maxOrder: 500000,
    averageTime: "1 hour 46 minutes",
    timeInHours: 1.77,
  },
  {
    id: "telegram_post_views_last5",
    name: "Telegram Post View | Last 5 Post | Best | Always Working",
    serviceTypeId: "telegram_post_views",
    rate: 3.0,
    minOrder: 10,
    maxOrder: 10000000,
    averageTime: "54 minutes",
    timeInHours: 0.9,
  },
  {
    id: "telegram_post_views_last10",
    name: "Telegram Post View | Last 10 Post | Best | Always Working",
    serviceTypeId: "telegram_post_views",
    rate: 5.0,
    minOrder: 10,
    maxOrder: 10000000,
    averageTime: "28 minutes",
    timeInHours: 0.47,
  },
  {
    id: "telegram_post_views_last20",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    serviceTypeId: "telegram_post_views",
    rate: 9.0,
    minOrder: 10,
    maxOrder: 10000000,
    averageTime: "6 hours",
    timeInHours: 6,
  },

  // YouTube Subscribers services
  {
    id: "youtube_subscribers_real",
    name: "Real YouTube Subscribers | Slow | Organic",
    serviceTypeId: "youtube_subscribers",
    rate: 15.99,
    minOrder: 50,
    maxOrder: 5000,
    averageTime: "7-14 days",
    timeInHours: 240,
  },

  // YouTube Views services
  {
    id: "youtube_views_fast",
    name: "Fast YouTube Views | High Retention",
    serviceTypeId: "youtube_views",
    rate: 2.99,
    minOrder: 1000,
    maxOrder: 100000,
    averageTime: "1-3 days",
    timeInHours: 48,
  },
]

// Mock user data
export const mockUser: User = {
  id: "1",
  name: "Demo User",
  email: "demo@example.com",
  balance: 0, // Starting with $0 balance
}

// Mock user profile data
export const mockUserProfile: UserProfile = {
  id: "1",
  username: "johndoe",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  avatar: "/placeholder.svg?height=100&width=100",
  balance: 250.75,
  joinDate: "2023-01-15",
}

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    type: "deposit",
    amount: 100.0,
    status: "completed",
    date: "2025-03-05T14:30:00Z",
    description: "Added funds via Credit Card",
  },
  {
    id: "txn-002",
    type: "order",
    amount: -25.5,
    status: "completed",
    date: "2025-03-04T10:15:00Z",
    description: "Payment for Order #ORD-7829",
  },
  {
    id: "txn-003",
    type: "deposit",
    amount: 50.0,
    status: "completed",
    date: "2025-02-28T16:45:00Z",
    description: "Added funds via Credit Card",
  },
  {
    id: "txn-004",
    type: "order",
    amount: -15.75,
    status: "completed",
    date: "2025-02-25T09:20:00Z",
    description: "Payment for Order #ORD-7825",
  },
  {
    id: "txn-005",
    type: "withdrawal",
    amount: -30.0,
    status: "pending",
    date: "2025-03-06T11:10:00Z",
    description: "Withdrawal to Bank Account",
  },
]

// Mock support tickets
export const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket-001",
    subject: "Order Delivery Delay",
    message: "My order #ORD-7829 is taking longer than the estimated time. Can you please check the status?",
    status: "open",
    date: "2025-03-06T09:15:00Z",
    replies: [
      {
        id: "reply-001",
        message: "Thank you for reaching out. We are checking your order status and will update you shortly.",
        isAdmin: true,
        date: "2025-03-06T10:30:00Z",
      },
    ],
  },
  {
    id: "ticket-002",
    subject: "Payment Issue",
    message: "I tried to add funds but the transaction failed, yet the amount was deducted from my card.",
    status: "in-progress",
    date: "2025-03-02T14:20:00Z",
    replies: [
      {
        id: "reply-002",
        message: "We apologize for the inconvenience. Our finance team is investigating this issue.",
        isAdmin: true,
        date: "2025-03-02T15:45:00Z",
      },
      {
        id: "reply-003",
        message: "Any updates on this? It's been a few days now.",
        isAdmin: false,
        date: "2025-03-05T11:30:00Z",
      },
      {
        id: "reply-004",
        message:
          "We've confirmed the issue and the funds will be credited to your account within 24 hours. We apologize for the delay.",
        isAdmin: true,
        date: "2025-03-05T13:15:00Z",
      },
    ],
  },
  {
    id: "ticket-003",
    subject: "Account Verification",
    message: "I need help verifying my account to increase my order limits.",
    status: "closed",
    date: "2025-02-20T08:45:00Z",
    replies: [
      {
        id: "reply-005",
        message: "Please provide a government-issued ID and a utility bill for verification.",
        isAdmin: true,
        date: "2025-02-20T10:30:00Z",
      },
      {
        id: "reply-006",
        message: "I have uploaded the requested documents to my profile.",
        isAdmin: false,
        date: "2025-02-21T09:15:00Z",
      },
      {
        id: "reply-007",
        message: "Your account has been successfully verified. Your order limits have been increased.",
        isAdmin: true,
        date: "2025-02-22T11:45:00Z",
      },
    ],
  },
]

// Helper functions
export function getServiceTypesByCategory(categoryId: string): ServiceType[] {
  return serviceTypes.filter((type) => type.categoryId === categoryId)
}

export function getServicesByType(serviceTypeId: string): Service[] {
  return services.filter((service) => service.serviceTypeId === serviceTypeId)
}

export function getServiceById(serviceId: string): Service | undefined {
  return services.find((service) => service.id === serviceId)
}

export function getCategoryById(categoryId: string): SocialMediaCategory | undefined {
  return categories.find((category) => category.id === categoryId)
}

export function getServiceTypeById(serviceTypeId: string): ServiceType | undefined {
  return serviceTypes.find((type) => type.id === serviceTypeId)
}

// Calculate estimated completion time based on quantity and service
export function calculateEstimatedTime(service: Service, quantity: number): string {
  // Calculate time in hours based on quantity
  const timeInHours = (service.timeInHours / 1000) * quantity

  if (timeInHours < 1) {
    // Convert to minutes if less than 1 hour
    const minutes = Math.ceil(timeInHours * 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else if (timeInHours < 24) {
    // Display in hours if less than 24 hours
    const hours = Math.ceil(timeInHours)
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  } else {
    // Display in days if 24 hours or more
    const days = Math.ceil(timeInHours / 24)
    return `${days} day${days !== 1 ? "s" : ""}`
  }
}

// Calculate total price based on quantity and service rate
export function calculateTotalPrice(service: Service, quantity: number): number {
  return (service.rate / 1000) * quantity
}

