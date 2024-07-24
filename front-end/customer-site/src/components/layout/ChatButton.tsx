"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatIcon } from "@/icons/ChatIcon";
import { DotIcon } from "@/icons/DotIcon";
import { CloseIcon } from "@/icons/CloseIcon";
import { SendIcon } from "@/icons/SendIcon";
import * as signalR from "@microsoft/signalr";
import { SaveMessage } from "@/app/api/chat/route";
import jwt from "jsonwebtoken";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { fromUser: string; message1: string }[]
  >([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const userData = JSON.parse(
    window.localStorage.getItem("customer") as string
  );
  const isListenerSet = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [isChatOpen]);

  useEffect(() => {
    const startConnection = async () => {
      const accessTokenFactory = () => {
        const secret = "KjNhBHePnuzAIC67D8AlSBrvHHPlV2og4ymSY5jwtQ8=";
        const payload = {
          aud: "https://food-order-chat.service.signalr.net",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          sub: userData.userId.toString(),
        };

        return jwt.sign(payload, secret);
      };

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://food-order-chat.service.signalr.net/client/?hub=chatHub", {
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
          accessTokenFactory,
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      newConnection.onclose(() => {
        console.log("Connection closed.");
      });

      newConnection.onreconnecting(() => {
        console.log("Connection lost. Attempting to reconnect...");
      });

      newConnection.onreconnected(() => {
        console.log("Connection reestablished.");
      });

      try {
        await newConnection.start();
        console.log("Connection started.");
        const user = userData.name;
        const groupId = `group_${userData.userId}`;
        await newConnection.invoke("JoinGroup", groupId, user);
        console.log(`${user} has joined ${groupId}`);
      } catch (err) {
        console.error("Connection failed:", err);
      }

      setConnection(newConnection);
    };

    if (!connection) {
      startConnection();
    }

    return () => {
      const cleanUpConnection = async () => {
        if (connection) {
          const groupId = `group_${userData.userId}`;
          if (connection.state === signalR.HubConnectionState.Connected) {
            try {
              await connection.invoke("LeaveGroup", groupId);
              console.log("Left group:", groupId);
            } catch (err) {
              console.error("Failed to leave group:", err);
            }
          }
          try {
            await connection.stop();
            console.log("Connection stopped.");
          } catch (err) {
            console.error("Error stopping connection: ", err);
          }
        }
      };

      cleanUpConnection();
    };
  }, []);

  useEffect(() => {
    if (connection && !isListenerSet.current) {
      connection.on("ReceiveMessage", (user, message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromUser: user, message1: message },
        ]);
      });
      isListenerSet.current = true;
    }
  }, [connection]);

  const handleButtonClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const user = userData.name;
    const groupId = `group_${userData.userId}`;
    const now = new Date();
    now.setHours(now.getHours() + 7);

    if (connection?.state === signalR.HubConnectionState.Connected) {
      try {
        const isAdminInGroup = await connection.invoke<boolean>("CheckAdminInGroup", groupId, "Admin");
        console.log(isAdminInGroup);

        connection
          .invoke("SendMessage", groupId, user, message)
          .catch((err) => console.log(err.toString()));

        SaveMessage({
          FromUser: user,
          ToUser: "Admin",
          Message1: message,
          Timestamp: now,
          UserId: userData.userId,
          IsRead: isAdminInGroup ? 1 : 0,
        }).catch((err) => console.log(err.toString()));

        setMessage("");
      } catch (err: any) {
        console.log(err.toString());
      }
    } else {
      console.error(
        "Cannot send message, connection is not in the 'Connected' state."
      );
    }
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
              <CloseIcon className="w-4 hover:fill-red-600 transition" />
            </button>
          </div>
          <div className="flex-1 overflow-y-scroll h-[275px] p-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  msg.fromUser === userData.name
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <span
                  className={`max-w-full p-2 rounded-lg break-words ${
                    msg.fromUser === userData.name
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message1}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
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
              disabled={!message}
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
