import styles from "./SideBar.module.css";

const SideBar = ({
  showSideBar,
  setShowSideBar,
  children,
}: {
  showSideBar: boolean;
  setShowSideBar: (v: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => setShowSideBar(!showSideBar)}
          className="info-button"
        >
          <span className="MNR2007">Ù</span>
          <b> {showSideBar ? "Bezárás" : "Információk"}</b>
        </button>
      </div>

      <aside className={`sidebar ${showSideBar ? "open" : ""}`}>
        {children}
      </aside>
    </>
  );
};

export default SideBar;
