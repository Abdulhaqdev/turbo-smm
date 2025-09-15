"use client";
import { useEffect } from "react";

export default function TawkToScript() {
  useEffect(() => {
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/68c508ec5ec5391930b3b617/1j50qln1n";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);

    return () => {
      document.body.removeChild(s1);
    };
  }, []);

  return null; // UI ko'rinmaydi
}