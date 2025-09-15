"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      customStyle?: {
        visibility?: {
          desktop?: {
            position?: string;
            xOffset?: number;
            yOffset?: number;
          };
          mobile?: {
            position?: string;
            xOffset?: number;
            yOffset?: number;
          };
        };
      };
      [key: string]: unknown;
    };
  }
}

export default function TawkToScript() {
  useEffect(() => {
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/68c508ec5ec5391930b3b617/1j50qln1n";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
window.Tawk_API = window.Tawk_API || {};
window.Tawk_API.customStyle = {
  visibility: {
    desktop: {
      position: 'br', // br, bl, cr, cl
      xOffset: 20,    // o'ng/chap tomondagi masofa
      yOffset: 100     // yuqori/pastki tomondagi masofa
    },
    mobile: {
      position: 'br',
      xOffset: 10,
      yOffset: 100
    }
  }
};
    return () => {
      document.body.removeChild(s1);
    };
  }, []);

  return null; // UI ko'rinmaydi
}