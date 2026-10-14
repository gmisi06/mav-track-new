import { useEffect, useState } from "react";
import "./App.css";
import SideBar from "./shared/components/SideBar";
import VehicleMap from "./features/vehicles/components/VehicleMap";
import BottomSheet from "./shared/components/BottomSheet";
import { StackProvider } from "./StackContext";
import TripSearch from "./features/trips/TripSearch";
import StackPane from "./shared/components/StackPane";

function App() {
  const [showSideBar, setShowSideBar] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <main className="main">
      <StackProvider initialView={{ id: "search", component: <TripSearch /> }}>
        <VehicleMap />
        {isMobile ? (
          <BottomSheet>
            <StackPane />
          </BottomSheet>
        ) : (
          <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar}>
            <StackPane />
          </SideBar>
        )}
      </StackProvider>
    </main>
  );
}

export default App;
