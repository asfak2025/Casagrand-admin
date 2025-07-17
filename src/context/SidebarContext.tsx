import { createContext, useContext, useState, useEffect } from "react";
import {
  GridIcon,
  UsersIcon,
  AgentIcon,
  UserCircleIcon,
  // ListIcon,
  // TableIcon,
  // PageIcon,
  CreditCardIcon,
  // CalenderIcon // Uncomment if needed later
} from "../icons"; // Adjust import paths based on your project structure
import { BookOpen, Building2, FileUpIcon } from "lucide-react";
//import Callhistory from "../pages/Calls/Callhistory";
import { Phone, PhoneCallIcon, TicketIcon } from "lucide-react";
import { AtomIcon, Settings } from "lucide-react";
type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
  setSidebarItems: (items: NavItem[]) => void;
  sidebarItems: NavItem[];
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export interface NavSubItem {
  name: string;
  path: string;
  pro: boolean;
}

export interface NavItem {
  icon?: React.ReactNode;
  name: string;
  path?: string;
  subItems?: NavSubItem[];
}

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/home", pro: false }],
  },
  {
    name: "Admin",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "Admin Users", path: "/adminusers", pro: false },
      { name: "Screen Configuration", path: "/screenconfig", pro: false },
      
    ],
  },
  {
    name: "Organization",
    icon: <Building2 />,
    subItems: [
      { name: "Organization", path: "/organization", pro: false },
      { name: "Org by Id", path: "/orgbyid", pro: false },
      
    ],
  },
  // Uncomment if needed
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  {
    name: "User",
    icon: <UsersIcon />,
    subItems: [
      { name: "Get Users", path: "/user", pro: false },
      { name: "Get Users by ID", path: "/userbyid", pro: false },
      { name: "User Search", path: "/usersearch", pro: false },
      // { name: "Tools", path: "/tools", pro: false },
      // { name: "Work Flow", path: "/workflow", pro: false },
      // { name: "Integration", path: "/integration", pro: false },
      { name: "Api Key", path: "/apikey", pro: false },
      // { name: "Knowledge Base", path: "/knbase", pro: false },
      { name: "Notification", path: "/notification", pro: false },
    ],
  },
  {
    name: "Phone",
    icon: <Phone />,
    subItems: [
      { name: "Get All Phones", path: "/getAllPhones", pro: false },
     
    ],
  },
   {
    name:"Payments",
    icon:<CreditCardIcon/>,
    path:"/payment"
  },
  {
    name:"Integration",
    icon:<AtomIcon/>,
    subItems:[
      { name: "Integration", path: "/allIntegration", pro: false },
      { name: "User Integration", path: "/userIntegrations", pro: false },
    ]
    
  },
  {
    name: "Tools",
    icon: <Settings />,
    subItems: [
      { name: "Get Tools", path: "/getTools", pro: false },
      { name: "Get Tools By Id", path: "/getToolsById", pro: false },
     
      
    ],
  },
  {
    icon: <AgentIcon />,
    name: "Agents",
    path: "/agent",
  },
  {
    icon:<TicketIcon />,
    name:"Tickets",
    path:"/AllTickets"
  },
 
 
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },

  {
    name: "Phone",
    icon: <Phone />,
    subItems: [
      { name: "Get Phones", path: "/phones", pro: false },
    ],
  },
  {
    name: "Knowledge",
    icon: <BookOpen />,
    subItems: [
      { name: "Get Knowledge", path: "/kn", pro: false },
    ],
  },
  {
    name: "Calls",
    icon: <PhoneCallIcon />,
    subItems: [
      { name: "Callhistory", path: "/Callhistory", pro: false },
      { name: "CallhistoryById", path: "/CallhistoryById/:callId", pro: false },
    ]
    
  },
  {
    icon: <AgentIcon />,
    name: "Agents",
    subItems: [
      { name: "User Agent", path: "/UserAgent", pro: false },
      { name: "User Agent by ID", path: "/UserAgentbyId", pro: false },
    ]
  },
  {
    icon:<FileUpIcon/>,
    name:"Upload File",
    path:"/uploadFile"
  }
];


export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const [sidebarItems,setSidebarItems] = useState(navItems)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        sidebarItems,
        setSidebarItems
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
