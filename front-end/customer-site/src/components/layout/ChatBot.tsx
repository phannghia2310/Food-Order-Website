"use client";
import React, { useState } from "react";
import { BotIcon } from "@/icons/BotIcon";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-20 right-5">
      <button
        onClick={handleButtonClick}
        className="bg-green-500 text-white px-4 py-4 rounded-full shadow-lg hover:bg-green-700 hover:-translate-y-1 transition z-0"
      >
        <BotIcon className="w-6" />
      </button>
      {isOpen && (
        <div className="fixed bottom-28 right-10 bg-white w-80 h-96 shadow-lg rounded-lg z-50">
          <iframe
            allow="microphone;"
            width="320"
            height="384"
            className="rounded-lg"
            src="https://console.dialogflow.com/api-client/demo/embedded/6aa2db68-4bec-4b02-ad0c-a6fac628158a"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
