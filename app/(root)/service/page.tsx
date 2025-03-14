"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const services = [
  {
    id: "6550",
    name: "Telegram Post Ko'rishlari | Oxirgi 1 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 500 000",
    rate: "$0.0077",
    time: "1 soat 46 daqiqa",
    timeColor: "text-emerald-500",
  },
  {
    id: "6551",
    name: "Telegram Post Ko'rishlari | Oxirgi 5 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.03",
    time: "54 daqiqa",
    timeColor: "text-blue-500",
  },
  {
    id: "6531",
    name: "Telegram Post Ko'rishlari | Oxirgi 10 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.05",
    time: "28 daqiqa",
    timeColor: "text-blue-500",
  },
  {
    id: "6525",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "6 soat",
    timeColor: "text-emerald-500",
  },
  {
    id: "6510",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "6 soat",
    timeColor: "text-emerald-500",
  },
  {
    id: "65532",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "6 soat",
    timeColor: "text-emerald-500",
  },
  {
    id: "652532",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "6 soat",
    timeColor: "text-emerald-500",
  },
  {
    id: "65221",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "1 soat",
    timeColor: "text-emerald-500",
  },
  {
    id: "654221",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "6 soat",
    timeColor: "text-emerald-500",
  },
  {
    id: "655221",
    name: "Telegram Post Ko'rishlari | Oxirgi 20 Post | Eng Yaxshi | Doim Ishlaydi",
    details: "Minimal buyurtma: 10  Maksimal buyurtma: 10 000 000",
    rate: "$0.09",
    time: "20 daqiqa",
    timeColor: "text-blue-500",
  },
];

function page() {
  return (
    <main className="max-w-screen-xl mx-auto">
      <div className="space-y-1 container">
        {/* Desktop View */}
        <div className="hidden sm:block rounded-lg border border-zinc-800 dark:bg-[#101013] text-white">
          <div className="grid grid-cols-[30px,1fr,120px,120px,110px] md:grid-cols-[50px,1fr,150px,150px,140px] items-center border-b border-zinc-800">
            <div className="p-4 text-sm font-medium dark:text-zinc-400 text-black ">#</div>
            <div className="p-4 text-sm font-medium dark:text-zinc-400 text-black">
              ID - Xizmat
            </div>
            <div className="p-4 text-sm font-medium dark:text-zinc-400 text-black">
              1k uchun narx
            </div>
            <div className="p-4 text-sm font-medium dark:text-zinc-400 text-black">
             {` O'rtacha vaqt`}
            </div>
            <div className="p-4 w-[140px]"></div>
          </div>
          <div className="divide-y divide-zinc-800">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="grid grid-cols-[30px,1fr,120px,120px,110px] md:grid-cols-[50px,1fr,150px,150px,140px] items-center  dark:hover:bg-zinc-900/50  hover:bg-slate-100 transition-colors group"
              >
                <div className="p-4 text-sm font-medium text-zinc-500">
                  {index + 1}
                </div>
                <div className="p-4 min-w-[200px] space-y-1">
                  <div className="text-sm font-medium dark:text-zinc-200 text-black dark:group-hover:text-white group-hover:text-slate-800  transition-colors">
                    {service.name}
                  </div>
                  <div className="text-xs text-zinc-500">{service.details}</div>
                </div>
                <div className="py-4 px-1 text-center text-sm dark:text-zinc-100 text-black dark:group-hover:text-white group-hover:text-slate-800 transition-colors">
                  {service.rate}
                </div>
                <div className={cn("p-4 text-sm", service.timeColor)}>
                  {service.time}
                </div>
                <div className="p-4 ">
                  <Button className="w-full bg-[#155DFC] hover:bg-[#155DFC]/90 text-white transition-colors">
                  Olish
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="rounded-lg border border-zinc-800 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-zinc-500">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-black dark:text-zinc-500">
                    {service.name}
                  </div>
                  <div className="text-xs text-black dark:text-zinc-500">
                    {service.details}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-zinc-400">1000 ta uchun narx</div>
                  <div className="text-zinc-100">{service.rate}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-zinc-400">{`O'rtacha vaqt`}</div>
                  <div className={service.timeColor}>{service.time}</div>
                </div>
              </div>
              <div className="border-t border-zinc-800 p-3">
                <Button className="w-full bg-[#155DFC] hover:bg-[#155DFC]/90 text-white transition-colors">
                  Olish
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center pb-4 pt-2">
          <div className="w-full overflow-auto">
            <div className="flex justify-center min-w-[200px]">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className="text-black dark:text-white dark:bg-zinc-900 bg-white border-zinc-800"
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
                            : "text-black dark:text-white dark:bg-zinc-900 bg-white hover:bg-white hover:text-zinc-900 hover:border-zinc-300"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationEllipsis
                      className="text-black dark:text-white dark:bg-zinc-900 bg-white border border-zinc-800
                      transition-all duration-200 ease-in-out h-8 w-8 sm:h-9 sm:w-9"
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className="text-black dark:text-white dark:bg-zinc-900 bg-white border-zinc-800"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default page;