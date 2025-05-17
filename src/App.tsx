import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
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
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useNavigate, useLocation } from 'react-router-dom';
import { history } from './utils';
import UsersDashboard from "./pages/UserMangement/userManagement";
import DocumentsDashboard from "./pages/DocumentManagement/documentManagement";
import DocumentDetails from "./pages/DocumentManagement/docDetails";
import CreateUser from "./pages/UserMangement/CreateUser";
import CreateDepartment from "./pages/DepartmentManagement/CreateDepartment";
import CreateCategory from "./pages/DocumentManagement/CreateCategory";
import CreateDocument from "./pages/DocumentManagement/CreateDocument";

// Import department management components
import DepartmentDashboard from './pages/DepartmentManagement/DepartmentDashboard';
import DepartmentUsers from './pages/DepartmentManagement/DepartmentUsers';

function HistorySetter() {
  history.navigate = useNavigate();
  history.location = useLocation();
  return null; // This component doesn't render anything, it just sets values
}

export default function App() {
  return (
    <>
      <Router>
      <HistorySetter />
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/users-dashboard" element={<UsersDashboard/>} />
            <Route path="/doc-dashboard" element={<DocumentsDashboard/>} />
            <Route path="/doc-details" element={<DocumentDetails/>} />

            {/* New Routes */}
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/create-department" element={<CreateDepartment />} />
            <Route path="/create-category" element={<CreateCategory />} />
            <Route path="/create-document" element={<CreateDocument />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Department Management Routes */}
            <Route path="/departments" element={<DepartmentDashboard />} />
            <Route path="/departments/create" element={<CreateDepartment />} />
            <Route path="/departments/:departmentId/users" element={<DepartmentUsers />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
