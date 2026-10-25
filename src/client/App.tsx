import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import SideBar from "./shared/components/SideBar";
import VehicleMap from "./features/vehicles/components/VehicleMap";
import BottomSheet from "./shared/components/BottomSheet";
import { StackProvider } from "./StackContext";
import TripSearch from "./features/trips/TripSearch";
import StackPane from "./shared/components/StackPane";
import { setPanelOpen } from "./store/slices/panelSlice";

function App() {
  const dispatch = useDispatch();
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

  // Mobilon az alsó lap jelzi a saját állapotát, desktopon az oldalsáv.
  useEffect(() => {
    if (!isMobile) dispatch(setPanelOpen(showSideBar));
  }, [dispatch, isMobile, showSideBar]);

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
