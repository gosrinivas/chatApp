import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore.js";

const Layout = ({ children }) => {
  const {theme}=useThemeStore();
  return (
  <div data-theme={theme}>
      <Navbar />
      {/* Add padding to reserve space for the Navbar */}
      <div className="pt-16">{children}</div>
    </div>
  );
};

export default Layout;
