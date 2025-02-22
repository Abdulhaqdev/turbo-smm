"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const services = [
  {
    id: "6550",
    name: "Telegram Post View | Last 1 Post | Best | Always Working",
    details: "Min order: 10  Max order: 500 000",
    rate: "$0.0077",
    time: "1 hour 46 minutes",
    timeColor: "text-emerald-500",
  },
  {
    id: "6551",
    name: "Telegram Post View | Last 5 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.03",
    time: "54 minutes",
    timeColor: "text-blue-500",
  },
  {
    id: "6531",
    name: "Telegram Post View | Last 10 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.05",
    time: "28 minutes",
    timeColor: "text-blue-500",
  },
  {
    id: "6525",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },
	{
    id: "6510",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },
	{
    id: "65532",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },{
    id: "652532",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },{
    id: "65221",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },
	{
    id: "654221",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },
	{
    id: "655221",
    name: "Telegram Post View | Last 20 Post | Best | Always Working",
    details: "Min order: 10  Max order: 10 000 000",
    rate: "$0.09",
    time: "6 hours",
    timeColor: "text-emerald-500",
  },
]

function page() {

  return (
    <div className="space-y-1 container">
      {/* Desktop View */}
      <div className="  hidden sm:block rounded-lg border border-zinc-800 bg-[#101013] text-white">
        <div className="grid grid-cols-[80px,1fr,160px,160px,140px] items-center border-b border-zinc-800 ">
          <div className="p-4 text-sm font-medium text-zinc-400">#</div>
          <div className="p-4 text-sm font-medium text-zinc-400">ID - Service</div>
          <div className="p-4 text-sm font-medium text-zinc-400">Rate per 1000</div>
          <div className="p-4 text-sm font-medium text-zinc-400">Average time</div>
          <div className="p-4 w-[140px]"></div>
        </div>
        <div className="divide-y divide-zinc-800">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="grid grid-cols-[80px,1fr,160px,160px,140px] items-center hover:bg-zinc-900/50 transition-colors group"
            >
              <div className="p-4 text-sm font-medium text-zinc-500">{index + 1}</div>
              <div className="p-4 min-w-[200px] space-y-1">
                <div className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors">
                  {service.name}
                </div>
                <div className="text-xs text-zinc-500">{service.details}</div>
              </div>
              <div className="p-4 text-sm text-zinc-100 group-hover:text-white transition-colors">{service.rate}</div>
              <div className={cn("p-4 text-sm", service.timeColor)}>{service.time}</div>
              <div className="p-4">
                <Button className="w-full bg-[#155DFC] hover:bg-[#155DFC]/90 text-white transition-colors">
                  Buy now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden  space-y-3">
        {services.map((service, index) => (
          <div key={service.id} className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-zinc-500">#{index + 1}</div>
                </div>
                <div className="text-sm font-medium text-zinc-100">{service.name}</div>
                <div className="text-xs text-zinc-500">{service.details}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-zinc-400">Rate per 1000</div>
                <div className="text-zinc-100">{service.rate}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-zinc-400">Average time</div>
                <div className={service.timeColor}>{service.time}</div>
              </div>
            </div>
            <div className="border-t border-zinc-800 p-3">
              <Button className="w-full bg-[#155DFC] hover:bg-[#155DFC]/90 text-white transition-colors">
                Buy now
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center pb-4 pt-2">
        <div className="w-full overflow-auto">
          <div className="flex justify-center min-w-[320px]">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="text-white bg-zinc-900 border-zinc-800"
                  />
                </PaginationItem>
                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      className={cn(
                        "text-white border-zinc-800 transition-all duration-200 ease-in-out h-8 w-8 sm:h-9 sm:w-9 text-sm sm:text-base",
                        page === 1
                          ? "bg-[#155DFC] border-[#155DFC] hover:bg-[#155DFC] hover:text-white hover:border-[#155DFC]"
                          : "bg-zinc-900 hover:bg-white hover:text-zinc-900 hover:border-zinc-300",
                      )}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis
                    className="text-white bg-zinc-900 border border-zinc-800
                      transition-all duration-200 ease-in-out h-8 w-8 sm:h-9 sm:w-9"
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
										className="text-white bg-zinc-900 border-zinc-800"

                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
