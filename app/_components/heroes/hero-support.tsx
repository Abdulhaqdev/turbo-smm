"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

// Define TypeScript interface for translations
interface HeroSupportTranslations {
  title: string;
  description: string;
  button: string;
}

export default function HeroSupport() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('heroSupport') as (key: keyof HeroSupportTranslations) => string;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-16 md:py-24 max-w-screen-xl mx-auto">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <svg
              width="38"
              height="49"
              viewBox="0 0 38 49"
              fill={mounted ? (resolvedTheme === "dark" ? "#FFFFFF" : "#000000") : "#FFFFFF"}
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground dark:text-white"
            >
              <path d="M12.0001 19.5196C12.0001 20.6216 12.2561 21.6656 12.7121 22.5936C11.7321 23.8496 11.1221 25.4076 11.0401 27.1056C9.15805 25.1296 8.00005 22.4576 8.00005 19.5216C8.00005 12.6996 14.2441 7.30759 21.3181 8.75959C25.4821 9.61559 28.8561 12.9696 29.7441 17.1276C30.0121 18.3836 30.0621 19.6136 29.9261 20.7896C29.8101 21.7856 28.9361 22.5216 27.9321 22.5216H27.8421C26.6581 22.5216 25.8261 21.4676 25.9561 20.2916C26.0441 19.5016 25.9981 18.6716 25.7961 17.8256C25.2001 15.3196 23.1561 13.2896 20.6461 12.7116C16.0741 11.6616 11.9981 15.1256 11.9981 19.5216L12.0001 19.5196ZM4.22005 16.9296C4.76805 13.7436 6.32605 10.8396 8.74205 8.5736C11.8001 5.70759 15.8041 4.29159 20.0021 4.55159C27.9081 5.06359 34.0901 11.9896 33.9981 20.2816C33.9601 23.7536 31.0521 26.5176 27.5821 26.5176H22.7701C22.2821 24.8596 20.7661 23.6396 18.9501 23.6396C16.7401 23.6396 14.9501 25.4296 14.9501 27.6396C14.9501 29.8496 16.7401 31.6396 18.9501 31.6396C20.0261 31.6396 21.0001 31.2096 21.7181 30.5176H27.5821C33.2201 30.5176 37.9181 26.0276 37.9981 20.3916C38.1461 9.94959 30.3021 1.20959 20.2601 0.561595C14.9321 0.215595 9.87805 2.02559 6.00805 5.65759C3.01005 8.46759 1.01605 12.1876 0.298053 16.1896C0.0800526 17.4056 1.04205 18.5216 2.27605 18.5216C3.22005 18.5216 4.06205 17.8636 4.22005 16.9316V16.9296ZM19.0001 34.5196C11.6101 34.5196 5.21605 39.1036 3.09005 45.9236C2.76005 46.9776 3.35005 48.0996 4.40405 48.4296C5.45605 48.7476 6.57805 48.1676 6.90805 47.1156C8.48605 42.0556 13.4561 38.5196 18.9981 38.5196C24.5401 38.5196 29.5121 42.0556 31.0881 47.1156C31.3561 47.9716 32.1441 48.5196 32.9981 48.5196C33.1961 48.5196 33.3941 48.4896 33.5941 48.4296C34.6481 48.0996 35.2361 46.9776 34.9081 45.9236C32.7821 39.1036 26.3881 34.5196 18.9981 34.5196H19.0001Z" />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {t('title')}
          </h2>
          <p className="mb-8 text-muted-foreground text-base md:text-lg">
            {t('description')}
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-xl text-lg transition-colors duration-200">
            {t('button')}
          </Button>
        </div>
      </div>
    </section>
  );
}