import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import { ReactNotifications } from 'react-notifications-component'
import axios from "axios";
import Navbar from './components/utils/navbar';
import Home from './components/home/home';
import Login from './components/auths/login';
import Register from './components/auths/register';
import ActivateAccount from "./components/utils/activateAccount";
import ResetPassword from "./components/utils/resetPassword";
import Books from "./components/bts/books";
import BooksByLevel from "./components/bts/booksByLevel";
import Book from "./components/bts/book";
import CreateFields from "./components/bts/createFields";
import DesignNavbar from "./components/design/designNavbar";
import Topic from "./components/topics/topic";
import Topics from "./components/topics/topics";
import Subtopic from "./components/subtopics/subtopic";
import CreateNote from "./components/subtopics/createNote";
import Footer from "./components/design/footer";
import './components/utils/notifications.css';
import 'react-notifications-component/dist/theme.css';
// import 'animate.css';
import BookVerified from "./components/utils/bookVerified";
import Profile from "./components/user/profile";
import Search from "./components/search/search";
import ScrollToTop from "./components/utils/scrollToTop";
import Question from "./components/questions/question";
import ExplainGPT from "./components/explaingpt/explainGPT";
import Levels from "./components/levels/levels";

const Layout = ()=>{
  return (
    <>
    <ReactNotifications />
    <ScrollToTop />
    <NotificationContainer />
    <DesignNavbar />
    <Outlet />
    <Footer />
    </>
  )
}

const Layout1 = ()=>{
  return (
    <>
    <ReactNotifications />
    <ScrollToTop />
    <NotificationContainer />
    <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/books",
        element: <Books />
      },
      {
        path: "/books/:level",
        element: <BooksByLevel />
      },
      {
        path: "/book/:name/:id",
        element: <Book />
      },
      {
        path: "/create-fields",
        element: <CreateFields />
      },
      {
        path: "/topics",
        element: <Topics />
      },
      {
        path: "/levels",
        element: <Levels />
      },
      {
        path: "/topic/:name/:id",
        element: <Topic />
      },
      {
        path: "/subtopic/:tname/:name/:id/:tid",
        element: <Subtopic />
      },
      {
        path: "/user/:username",
        element: <Profile />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/question/:qname/:qid",
        element: <Question />
      },
    ]
  },
  {
    path: "/",
    element: <Layout1 />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Register />
      },
      {
        path: "/addnote/:stname/:stid/:fil/:lil",
        element: <>
        <DesignNavbar />
        <CreateNote />
        </>
      },
      {
        path: "/verify-book",
        element: <BookVerified />
      },
      {
        path: "/auth/activate-account",
        element: <>
        <DesignNavbar />
        <ActivateAccount />
        </>
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />
      },
    ]
  },
  
]);

function App() {
  return (
    <div className="App scroll-smooth">
      <div className="hidden !text-[#2e9efb] !text-[#c47ae0] !text-[#fac865] !text-[#76e199] !text-[#ff627b] !text-[#4edfe2] !text-[#fd6f6f]"></div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
