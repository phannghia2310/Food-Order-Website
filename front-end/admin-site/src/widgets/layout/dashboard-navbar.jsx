import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { getUnreadMessagesCount, getUnreadMessages } from "@/api/messageApi";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [user, setUser] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [connection, setConnection] = useState(null);

  const fetchUnread = async () => {
    const user = localStorage.getItem('user');
    setUser(user);

    await getUnreadMessagesCount().then(response => setUnreadMessagesCount(response.data));
    await getUnreadMessages().then(response => setUnreadMessages(response.data));
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  useEffect(() => {
    const setupConnection = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://app-food-order.azurewebsites.net/chatHub", {
          transport: HttpTransportType.WebSockets,
          withCredentials: false,
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

      newConnection.on("UpdateContact", async (user, message) => {
        await fetchUnread();
      });

      try {
        await newConnection.start();
        console.log("SignalR Connected.");
        setConnection(newConnection);
      } catch (err) {
        console.error("Connection failed: ", err);
      }
    };

    setupConnection();

    return () => {
      const cleanup = async () => {
        if (connection) {
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
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
  };

  const timeSince = (date) => {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  }

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}/${page}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          {user ? (
            <>
              <Link to="/auth/sign-in">
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                  onClick={handleSignOut}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
                  Sign Out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  Sign In
                </Button>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="grid xl:hidden"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
              </Link>
            </>
          )}
          <Menu>
            <MenuHandler>
              <div className="relative text-[12px]">
                <IconButton variant="text" color="blue-gray">
                  <ChatBubbleLeftRightIcon className="relative h-5 w-5 text-blue-gray-500" />
                </IconButton>
                <span className="absolute top-0 right-1 px-1 bg-red-800 rounded-full">{unreadMessagesCount}</span>
              </div>

            </MenuHandler>
            <MenuList className="w-max h-[260px] border-0">
              {unreadMessages.length > 0 ? (
                unreadMessages.map((message, index) => (
                  <MenuItem key={index} className="flex items-center gap-3">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-1 font-normal"
                      >
                        <strong>{message.fromUser}</strong>
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-1 font-normal"
                      >
                        {message.message1}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center gap-1 text-xs font-normal opacity-60"
                      >
                        <ClockIcon className="h-3.5 w-3.5" /> {timeSince(message.timestamp)}
                      </Typography>
                    </div>
                  </MenuItem>
                ))
              ) : (
                <MenuItem className="flex items-center gap-3">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    No new messages
                  </Typography>
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
