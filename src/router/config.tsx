import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import About from "../pages/about/page";
import Services from "../pages/services/page";
import Gallery from "../pages/gallery/page";
import Contact from "../pages/contact/page";
import Booking from "../pages/booking/page";
import Privacy from "../pages/privacy/page";
import BookingPolicies from "../pages/booking-policies/page";
import BlogListing from "../pages/blog/page";
import BlogDetail from "../pages/blog/detail/page";
import FindBooking from "../pages/find-booking/page";
import Admin from "../pages/admin/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/booking",
    element: <Booking />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/booking-policies",
    element: <BookingPolicies />,
  },
  {
    path: "/blog",
    element: <BlogListing />,
  },
  {
    path: "/blog/:slug",
    element: <BlogDetail />,
  },
  {
    path: "/find-booking",
    element: <FindBooking />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;