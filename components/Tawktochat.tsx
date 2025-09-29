"use client";
import { useEffect } from "react";
import Image from "next/image";

export default function TelegramChatButton() {

  useEffect(() => {
    // Ensure the Telegram button is styled and visible
    const telegramButton = document.querySelector(".telegram-chat-button");
    if (telegramButton) {
      telegramButton.setAttribute("style", "position: fixed; bottom: 80px; right: 20px; z-index: 1000;");
    }

    // Cleanup function to remove any added styles
    return () => {
      const telegramButton = document.querySelector(".telegram-chat-button");
      if (telegramButton) {
        telegramButton.removeAttribute("style");
      }
    };
  }, []);

  return (
    <a
      href={`https://t.me/turbosmm_uz`}
      target="_blank"
      rel="noopener noreferrer"
      className="telegram-chat-button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "60px",
        height: "60px",
        backgroundColor: "#0088cc",
        borderRadius: "50%",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s",
      }}
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
        alt="Telegram Chat"
        width={60}
        height={60}
      />
    </a>
  );
}