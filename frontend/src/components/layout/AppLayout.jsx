import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Shared chrome for every authenticated page: Navbar on top, Footer at bottom,
// the routed page rendered in between via <Outlet />.
export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
