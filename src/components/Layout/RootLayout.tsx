import { Outlet } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

export default function RootLayout() {
  return (
    <LayoutContext.Provider value={true}>
      {/* Garde la barre toujours montée */}
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </LayoutContext.Provider>
  );
}
