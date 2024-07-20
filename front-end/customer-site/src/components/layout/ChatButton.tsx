"use client";
import React, { useState, useEffect, useRef, SetStateAction } from "react";
import { ChatIcon } from "@/icons/ChatIcon";
import { DotIcon } from "@/icons/DotIcon";
import { CloseIcon } from "@/icons/CloseIcon";
import { SendIcon } from "@/icons/SendIcon";
import * as signalR from "@microsoft/signalr";
import { SaveMessage } from "@/app/api/chat/route";
import { error } from "console";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ fromUser: string, message1: string }[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const userData = JSON.parse(localStorage.getItem("customer") as string);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7133/chatHub", {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
        accessTokenFactory: () => userData.userId,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.start().then(() => {
        newConnection.on("ReceiveMessage", (user, message) => {
            setMessages((preMessages) => [
                ...preMessages,
                { fromUser: user, message1: message },
            ]);
        });
    }).catch((err) => console.error("Connection failed: ", err));

    setConnection(newConnection);

    return () => {
        newConnection.stop();
    };
  }, [userData.userId]);

  const handleButtonClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    const user = userData.name;
    const userId = userData.userId;
    const now = new Date();
    now.setHours(now.getHours() + 7);

    connection?.invoke("SendMessage", userId.toString(), user, message).catch((err) => 
        console.log(err.toString())
    );

    SaveMessage({
        FromUser: user,
        ToUser: "Admin",
        Message1: message,
        Timestamp: now,
        UserID: userId,
        IsRead: 0,
    }).catch((err) => console.log(err.toString()));
    
    setMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5">
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-4 py-4 rounded-full shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition"
      >
        <ChatIcon className="w-6" />
      </button>
      {isChatOpen && (
        <div className="fixed bottom-16 right-10 bg-white w-80 h-96 shadow-lg rounded-lg">
          <div className="flex justify-between items-center bg-blue-500 p-3 rounded-t-lg">
            <DotIcon className="w-3" />
            <h3 className="text-lg font-semibold">Chat with us</h3>
            <button onClick={handleButtonClick} className="text-red-500">
              <CloseIcon className="w-4 hover:fill-red-600 transition " />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-[275px] p-3">
            {messages.map((msg, index) => (
              <div key={index} className="flex justify-end mb-2">
                <span className="max-w-full bg-blue-500 rounded-lg p-2 text-white break-words">
                  {msg.message1}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center p-2 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg mr-2"
              value={message}
              onChange={handleMessageChange}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <SendIcon className="w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
