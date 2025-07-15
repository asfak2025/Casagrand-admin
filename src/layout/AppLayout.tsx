import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useEffect } from "react";
import { getFromLocalStorage } from "../components/encryption/encryption";

type AccessRole = {
  pathName: string;
  pageAccess: string;
  // add other properties if needed
};

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const accessRoles: AccessRole[] = getFromLocalStorage("accessRoles") || [];

  const navigate = useNavigate();

  
  const location = useLocation();
  useEffect(() => {

    const token=localStorage.getItem("token")
    if (!token) {
      console.log("Checking token in localStorage");
      // navigate("/");
    }
    const roleScreen = accessRoles.find((item: AccessRole) => item.pathName === location.pathname);


    console.log(roleScreen)
    if(roleScreen && roleScreen.pageAccess==="BLOCK"){
      navigate("/home")
    }
    
    
  }, [location.pathname]);
  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
