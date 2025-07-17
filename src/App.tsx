import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AppProvider } from "./context/appContext";
import Agent from "./pages/Agents/agents";
import User from "./pages/User/User";
import UserID from "./pages/User/UserbyID";
import './index.css';
import AdminUsers from "./pages/AdminUsers";
import UserDetails from "./components/UserProfile/AdminDetails";
import Tools from "./pages/User/Tools";
import WorkFlow from "./pages/User/WorkFlow";
import Integration from "./pages/User/Integration";
import ApiKey from "./pages/User/ApiKey";
import Knbase from "./pages/User/Knbase";
import Phones from "./pages/Phone/Phones";
import Kn from "./pages/Knowledge/Kn";
import KnbyID from "./pages/Knowledge/KnbyID";
import AllPayments from "./pages/Payments/AllPayments";
import Payment from "./pages/Payments/Payment";
import ScreenConfiguration from "./pages/Admin/screenAccess";
import Callhistory from "./pages/Calls/Callhistory";
import CallhistoryById from "./pages/Calls/CallhistoryById";
import UserSearch from "./pages/User/UserSearch";
import GetTools from "./pages/Tools/GetTools";
import AllIntegration from "./pages/Integration/AllIntegration";
import IntegrationById from "./pages/Integration/Integration";
import GetToolsById from "./pages/Tools/GetToolsById";
import UserAgent from "./pages/Agent/UserAgent";
import AllUserIntegration from "./pages/Integration/AllUserIntegration";
import UserIntegration from "./pages/Integration/UserIntegration";
import AllTickets from "./pages/Tickets/AllTickets";
import TicketById from "./pages/Tickets/TicketById";
import UserAgentbyId from "./pages/Agent/UserAgentbyId";
import GetAllPhones from "./pages/Phone/getAllPhones";
import Notification from "./pages/User/Notification";
import UploadFile from "./pages/FileUpload/UploadFile";
import Organization from "./pages/Organization/Organization ";
import OrgById from "./pages/Organization/orgById";
import AgentById from "./pages/Organization/OrgAgent";
export default function App() {


  return (
    <>
      <AppProvider>
        <Router>
          <ScrollToTop />
          <ToastContainer
            position="top-right"
            style={{ zIndex: 999999 }} // <-- This makes sure it's on top
          />
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route index path="/home" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />


              {/* <Route path="/calendar" element={<Calendar />} /> */}


              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* File Upload */}
              <Route path='/uploadFile' element={<UploadFile/>}/>

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Call- History */}
              <Route path="/Callhistory" element={<Callhistory />} />
              <Route path="/CallhistoryById/:callId?" element={<CallhistoryById />} />

              {/*user Agents */}
              <Route path="/UserAgent" element={<UserAgent />} />


              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              {/* Payments */}
              <Route path="/payment" element={<AllPayments />} />
              <Route path="/paymentById/:orgId" element={<Payment />} />

              {/* Integration */}
              <Route path='/allIntegration' element={<AllIntegration />} />
              <Route path='/integrationById/:integrationId' element={<IntegrationById />} />
              <Route path='/userIntegrations' element={<AllUserIntegration />} />
              <Route path='/userIntegrationById/:integrationId/:orgId' element={<UserIntegration />} />

              {/* Ticktes */}
              <Route path="/allTickets" element={<AllTickets />} />
              <Route path="/ticketById/:ticketId" element={<TicketById />} />

              {/* admin screens */}
              <Route path={'/agent'} element={<Agent />} />
              <Route path={'/user'} element={<User />} />
              <Route path={'/userbyid'} element={<UserID />} />
              {/* <Route path="/addAdmin" element={<CreateUser/>}/> */}
              <Route path="/adminusers" element={<AdminUsers />} />
              <Route path={'/adminbyid/:roleId'} element={<UserDetails />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/workflow" element={<WorkFlow />} />
              <Route path="/integration" element={<Integration />} />
              <Route path="/apikey" element={<ApiKey />} />
              <Route path="/knbase" element={<Knbase />} />
              <Route path="/screenconfig" element={<ScreenConfiguration />} />
              <Route path="/usersearch" element={<UserSearch />} />
              <Route path="/getTools" element={<GetTools />} />
              <Route path="/getToolsById" element={<GetToolsById />} />
              <Route path="/UserAgentbyId" element={<UserAgentbyId />} />
              <Route path={'/phones'} element={<Phones />} />
              <Route path={'/kn'} element={<Kn />} />
              <Route path={'/knbyid'} element={<KnbyID />} />

              <Route path="/getToolsById" element={<GetToolsById />} />
              <Route path="/getAllPhones" element={<GetAllPhones />} />
              <Route  path="/notification" element={<Notification/>} />

              {/* Casa Grand Admin Page*/}
              <Route path="/organization" element={<Organization />} />
              <Route path="/orgbyid" element={<OrgById />} />
              <Route path="/agentbyid" element={<AgentById />} />
              
            </Route>

            {/* Auth Layout */}
            <Route path="/" element={<SignIn />} />
            {/* <Route path="/signup" element={<SignUp />} /> */}

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Router>
      </AppProvider>
    </>
  );
}
