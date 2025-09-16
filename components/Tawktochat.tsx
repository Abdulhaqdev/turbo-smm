/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    __lc?: {
      license?: number;
      integration_name?: string;
      product_name?: string;
      asyncInit?: boolean;
    };
    LiveChatWidget?: {
      on: (event: string, callback: () => void) => void;
      once: (event: string, callback: () => void) => void;
      off: (event: string, callback: () => void) => void;
      get: (property: string) => any;
      call: (method: string, ...args: any[]) => void;
      init: () => void;
      [key: string]: unknown;
    };
  }
}

export default function LiveChatScript() {
  useEffect(() => {
    // LiveChat konfiguratsiyasi
    window.__lc = window.__lc || {};
    window.__lc.license = 19303269;
    window.__lc.integration_name = "manual_channels";
    window.__lc.product_name = "livechat";

    // LiveChat API yaratish
    function createLiveChatAPI() {
      const api: any = {
        _q: [],
        _h: null,
        _v: "2.0",
        on: function(...args: any[]) { return i(["on", args]) },
        once: function(...args: any[]) { return i(["once", args]) },
        off: function(...args: any[]) { return i(["off", args]) },
        get: function(...args: any[]) {
          if (!api._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
          return i(["get", args]);
        },
        call: function(...args: any[]) { return i(["call", args]) },
        init: function() {
          const script = document.createElement("script");
          script.async = true;
          script.type = "text/javascript";
          script.src = "https://cdn.livechatinc.com/tracking.js";
          document.head.appendChild(script);
        }
      };

      function i(args: any[]) {
        return api._h ? api._h.apply(null, args) : api._q.push(args);
      }

      return api;
    }

    // LiveChatWidget yaratish
    if (!window.__lc.asyncInit) {
      const liveChatAPI = createLiveChatAPI();
      window.LiveChatWidget = window.LiveChatWidget || liveChatAPI;
      liveChatAPI.init();
    }

    // Cleanup function
    return () => {
      // LiveChat scriptini olib tashlash
      const existingScript = document.querySelector('script[src="https://cdn.livechatinc.com/tracking.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // LiveChat widget ni yashirish
      const liveChatFrame = document.querySelector('#livechat-compact-container');
      if (liveChatFrame) {
        liveChatFrame.remove();
      }
    };
  }, []);

  return null; // UI ko'rinmaydi
}