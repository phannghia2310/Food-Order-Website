import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { getContacts, getMessages, saveMessage, markAsRead } from "@/api/messageApi";
import { HubConnectionBuilder, HttpTransportType, HubConnectionState } from "@microsoft/signalr";

export function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef();

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

  const fetchContacts = async () => {
    try {
      const contactsData = await getContacts();
      setContacts(contactsData.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const setupConnection = async () => {
      if (selectedContact) {
        const newConnection = new HubConnectionBuilder()
          .withUrl("https://localhost:7133/chatHub", {
            transport: HttpTransportType.WebSockets,
            withCredentials: false,
            accessTokenFactory: () => selectedContact?.id || "",
          })
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
          console.log("SignalR Connected.");
          setConnection(newConnection);
        } catch (err) {
          console.error("Connection failed: ", err);
        }
      }
    };

    setupConnection();

    return () => {
      const cleanup = async () => {
        if (connection) {
          const groupId = getGroupId(selectedContact);
          try {
            await connection.invoke("LeaveGroup", groupId);
            console.log("Left group:", groupId);
          } catch (err) {
            console.error("Failed to leave group:", err);
          }
          try {
            await connection.stop();
            console.log("Connection stopped.");
          } catch (err) {
            console.error("Error stopping connection: ", err);
          }
        }
      };
      cleanup();
    };
  }, [selectedContact]);

  useEffect(() => {
    const joinGroup = async () => {
      if (selectedContact && connection && connection.state === HubConnectionState.Connected) {
        const user = "Admin";
        const groupId = getGroupId(selectedContact);
        try {
          await connection.invoke("JoinGroup", groupId, user);
          console.log(`${user} has joined ${groupId}`);
        } catch (err) {
          console.error("Failed to join group:", err);
        }
      }
    };

    joinGroup();

    return () => {
      const leaveGroup = async () => {
        if (selectedContact && connection && connection.state === HubConnectionState.Connected) {
          const groupId = getGroupId(selectedContact);
          try {
            await connection.invoke("LeaveGroup", groupId);
            console.log("Left group:", groupId);
          } catch (err) {
            console.error("Failed to leave group:", err);
          }
        }
      };
      leaveGroup();
    };
  }, [selectedContact, connection]);

  useEffect(() => {
    if (connection) {
      const handleReceiveMessage = async (user, message) => {
        setMessages((prevMessages) => [...prevMessages, { fromUser: user, message1: message }]);
      };

      connection.on("ReceiveMessage", handleReceiveMessage);

      return () => {
        connection.off("ReceiveMessage", handleReceiveMessage);
      };
    }
  }, [connection]);

  useEffect(() => {
    if (connection) {
      connection.on("UpdateContact", async (user, message) => {
        await fetchContacts();
      })
    }
  }, [connection]);

  const handleMessageChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleContactClick = async (contact) => {
    setIsChatOpen(true);
    setSelectedContact(contact);

    try {
      const response = await getMessages(contact.id);
      setMessages(response.data);
      await markAsRead(contact.id);

      setTimeout(() => {
        fetchContacts();
      }, 300);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (connection && connection.state === HubConnectionState.Connected) {
      const user = "Admin";
      const groupId = getGroupId(selectedContact);
      const now = new Date();
      now.setHours(now.getHours() + 7);

      try {
        await connection.invoke("SendMessage", groupId, user, messageInput).catch((err) => console.log(err.toString()));

        saveMessage({
          FromUser: user,
          ToUser: selectedContact.contact,
          Message1: messageInput,
          Timestamp: now,
          UserId: selectedContact.id,
          IsRead: 1,
        }).catch((err) => console.log(err.toString()));

        setMessageInput("");
      } catch (err) {
        console.error("Error sending message: ", err.toString());
      }
    } else {
      console.error("Connection is not established.");
    }
  };

  const getGroupId = (contact) => {
    return `group_${contact.id}`;
  };

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString();
    } else {
      return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`;
    }
  };

  return (
    <section className="content">
      <div className="flex flex-row mt-[50px]">
        <div className="w-1/3">
          <div className="list-group">
            {contacts.map((contact) => (
              <a
                key={contact.contact}
                href="#"
                className="list-group-item list-group-item-action"
                onClick={() => handleContactClick(contact)}
              >
                <div className={`${contact.unreadMessagesCount === 0 ? "bg-white text-black" : "bg-blue-500 text-white"} p-4 mr-4 rounded-lg mb-2`}>
                  <div className="flex justify-between">
                    <h5 className="font-semibold text-[18px] mb-1">{contact.contact}</h5>
                    <small>{new Date(contact.lastMessageTimestamp).toLocaleTimeString()}</small>
                  </div>
                  <div className="flex justify-between">
                    <p className="mb-1">{contact.lastMessage}</p>
                    {contact.unreadMessagesCount > 0 && (
                      <>
                        <small className="bg-red-700 fw-bold py-1 px-2 rounded">
                          {contact.unreadMessagesCount}
                        </small>
                      </>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="w-2/3">
          <Card>
            <CardHeader color="gray">
              <Typography variant="h6" color="white" className="p-3">
                Chat with: <span id="contactName">{selectedContact?.contact || "Contact person"}</span>
              </Typography>
            </CardHeader>
            <CardBody className="h-[400px] overflow-y-scroll" id="chatMessages">
              {messages.map((message, index) => (
                <Tooltip key={index} content={formatDate(message.timestamp)} placement="top">
                  <div className={`flex mb-1 ${message.fromUser === "Admin" ? "justify-end" : "justify-start"}`}>
                    <Typography
                      className={`p-2 rounded ${message.fromUser === "Admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                      style={{ maxWidth: "75%", wordWrap: "break-word" }}
                    >
                      {message.message1}
                    </Typography>
                  </div>
                </Tooltip>
              ))}
              <div ref={messagesEndRef} />
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex items-center">
                <Input
                  type="text"
                  className="flex-grow"
                  placeholder="Enter message"
                  value={messageInput}
                  onChange={handleMessageChange}
                />
                <Button
                  color="blue"
                  onClick={handleSendMessage}
                  disabled={!messageInput}
                  className="w-1/6 ml-3"
                >
                  <i className="far fa-paper-plane mr-2"></i>Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Chat;
