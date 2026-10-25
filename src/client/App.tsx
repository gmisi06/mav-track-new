import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import SideBar from "./shared/components/SideBar";
import VehicleMap from "./features/vehicles/components/VehicleMap";
import BottomSheet from "./shared/components/BottomSheet";
import { StackProvider } from "./StackContext";
import TripSearch from "./features/trips/TripSearch";
import StackPane from "./shared/components/StackPane";
import { setPanelOpen } from "./store/slices/panelSlice";
import { useIsMobile } from "./shared/hooks/useIsMobile";
import type { RootState } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  // Desktopon az oldalsáv állapota a store-ban van, hogy a térkép is megnyithassa.
  const showSideBar = useSelector((state: RootState) => state.panel.open);
  const setShowSideBar = (open: boolean) => dispatch(setPanelOpen(open));

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
