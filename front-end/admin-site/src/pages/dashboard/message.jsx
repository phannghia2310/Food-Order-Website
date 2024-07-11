import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { getContacts, getMessages, saveMessage, markAsRead } from "@/api/messageApi";
import { HubConnectionBuilder } from "@microsoft/signalr";

export function Chat() {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactsData = await getContacts();
        setContacts(contactsData.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchData();

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7133/chatHub")
      .build();

    newConnection.start().then(() => {
      newConnection.on("ReceiveMessage", (user, message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromUser: user, message1: message },
        ]);
      });
    }).catch((err) => console.error("Connection failed: ", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    getMessages(contact.contact).then(setMessages);
    markAsRead(contact.contact);
  };

  const handleSendMessage = () => {
    const user = "Admin";
    const contact = selectedContact.contact;
    const now = new Date();
    now.setHours(now.getHours() + 7);

    connection.invoke("SendMessage", user, messageInput).catch((err) =>
      console.error(err.toString())
    );

    saveMessage({
      FromUser: "Admin",
      ToUser: contact,
      Message1: messageInput,
      Timestamp: now,
      IsRead: 1,
    });

    setMessageInput("");
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
                className="list-group-item list-group-item-action mb-1"
                onClick={() => handleContactClick(contact)}
              >
                <div className="flex justify-between">
                  <h5 className="mb-1">{contact.contact}</h5>
                  <small>{new Date(contact.lastMessageTimestamp).toLocaleTimeString()}</small>
                </div>
                <div className="flex justify-between">
                  <p className="mb-1">{contact.lastMessage}</p>
                  {contact.unreadMessagesCount > 0 && (
                    <small className="bg-danger fw-bold py-1 px-2 rounded">
                      {contact.unreadMessagesCount}
                    </small>
                  )}
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
                <div key={index} className={`flex mb-1 ${message.fromUser === "Admin" ? "justify-end" : "justify-start"}`}>
                  <Typography
                    className={`p-2 rounded ${message.fromUser === "Admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                    style={{ maxWidth: "75%", wordWrap: "break-word" }}
                  >
                    {message.message1}
                  </Typography>
                </div>
              ))}
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex items-center">
                <Input
                  type="text"
                  className="flex-grow"
                  placeholder="Enter message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
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
