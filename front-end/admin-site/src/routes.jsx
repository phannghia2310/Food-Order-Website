import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  UserIcon,
  Squares2X2Icon,
  CubeIcon,
  ShoppingCartIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { Home, User, Category, Product, Status, Order, Contact, Chat } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import PrivateRoute from "@/configs/private-route";
import { element } from "prop-types";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: (
      //     <PrivateRoute>
      //       <Profile />
      //     </PrivateRoute>
      //   ),
      // },
      {
        icon: <UserIcon {...icon} />,
        name: "user",
        path: "/user",
        element: (
          <PrivateRoute>
            <User />
          </PrivateRoute>
        ),
      },
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "category",
        path: "/category",
        element: (
          <PrivateRoute>
            <Category />
          </PrivateRoute>
        ),
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "product",
        path: "/product",
        element: (
          <PrivateRoute>
            <Product />
          </PrivateRoute>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "status",
        path: "/status",
        element: (
          <PrivateRoute>
            <Status />
          </PrivateRoute>
        ),
      }, 
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "order",
        path: "/order",
        element: (
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        ),
      },
      {
        icon: <PaperAirplaneIcon {...icon} />,
        name: "contact",
        path: "/contact",
        element: (
          <PrivateRoute>
            <Contact />
          </PrivateRoute>
        ),
      }, 
      {
        icon: <ChatBubbleLeftRightIcon {...icon} />,
        name: "chat",
        path: "/chat",
        element: (
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        ),
      }
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      // {
      //   icon: <RectangleStackIcon {...icon} />,
      //   name: "sign up",
      //   path: "/sign-up",
      //   element: <SignUp />,
      // },
    ],
  },
];

export default routes;
