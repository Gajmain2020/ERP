/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router";

//icon import
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import CampaignIcon from "@mui/icons-material/Campaign";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";

const sidebarButtonStyle =
  "w-full px-3 flex gap-5  text-md hover:bg-zinc-400/60 transition-all delay-150 hover:text-black rounded-lg py-2 active:outline-none active:ring active:ring-zinc-900/50 font-semibold items-center cursor-pointer";

const sidebarComponentStyle =
  "backdrop-blur fixed sm:hidden xs:hidden left-0 top-16 w-1/5 mt-2 xl:flex lg:flex md:flex border-rounded p-2 flex-col gap-2  min-h-[89vh] bg-white/30 text-white flex rounded-md";

const active = " bg-zinc-200/70 text-zinc-900";

//! taking Base url for navigation
var baseUrl = location.pathname.split("/");
baseUrl = baseUrl.slice(0, 4).join("/") + "/";

const teacherSidebarOption = [
  {
    title: "Divider",
  },
  {
    title: "Classes",
    icon: <SchoolIcon />,
    url: "classes",
  },
  {
    title: "Add Attendence",
    icon: <LocalLibraryIcon />,
    url: "attendence",
  },
  {
    title: "Divider",
  },
  {
    title: "Assignments",
    icon: <AssignmentTurnedInIcon />,
    url: "assignments",
  },
  {
    title: "Test Paper",
    icon: <DescriptionIcon />,
    url: "test-paper",
  },
  {
    title: "Divider",
  },
  {
    title: "Notice",
    icon: <NotificationImportantIcon />,
    url: "notice",
  },
  {
    title: "Announcement",
    icon: <CampaignIcon />,
    url: "announcement",
  },
  {
    title: "Divider",
  },
  {
    title: "Student Validation",
    icon: <HowToRegIcon />,
    url: "student-validation",
  },
  {
    title: "Complaints",
    icon: <GppMaybeIcon />,
    url: "complaints",
  },
];

function Sidebar({ token, setToken }) {
  const location = useLocation().pathname.split("/");
  const userType = location[1];

  return (
    <>
      {userType === "teacher" && <TeacherSidebar />}
      {userType === "student" && <StudentSidebar />}
      {userType === "admin" && <AdminSidebar />}
    </>
  );
}

function AdminSidebar() {
  return <>hello world</>;
}

function TeacherSidebar() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={sidebarComponentStyle}>
        <div
          onClick={() => navigate(baseUrl)}
          className={
            !location.pathname.split("/")[4]
              ? sidebarButtonStyle + active
              : sidebarButtonStyle
          }
        >
          <div className="ml-2 p-0">
            <HomeIcon />
          </div>
          <div className="h-full truncate">Homepage</div>
        </div>

        {teacherSidebarOption.map((option) => (
          <>
            {option.title !== "Divider" ? (
              <SidebarButton
                title={option.title}
                url={option.url}
                icon={option.icon}
              />
            ) : (
              <Divider />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

function StudentSidebar() {
  return (
    <div>
      <div className={sidebarComponentStyle}>
        {/* single sidebar button  */}
        <div
          className={
            location[4] ? sidebarButtonStyle : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <HomeIcon />
          </div>
          <div className="h-full truncate">Homepage</div>
        </div>
        <Divider />
        <div
          className={
            location[4] !== "classes"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <SchoolIcon />
          </div>
          <div className="h-full">Classes</div>
        </div>
        <div
          className={
            location[4] !== "attendance"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <LocalLibraryIcon />
          </div>
          <div className="h-full truncate">Add Attendance</div>
        </div>
        <Divider />
        <div
          className={
            location[4] !== "assignment"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <AssignmentTurnedInIcon />
          </div>
          <div className="h-full truncate">Assignments</div>
        </div>
        <div
          className={
            location[4] !== "test-papers"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <DescriptionIcon />
          </div>
          <div className="h-full truncate">Test Papers</div>
        </div>
        <Divider />
        <div
          className={
            location[4] !== "notice"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <NotificationImportantIcon />
          </div>
          <div className="h-full truncate">Notice</div>
        </div>
        <div
          className={
            location[4] !== "announcement"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <CampaignIcon />
          </div>
          <div className="h-full truncate">Announcement</div>
        </div>
        <Divider />
        <div
          className={
            location[4] !== "student-validation"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <HowToRegIcon />
          </div>
          <div className="h-full truncate">Student Validation</div>
        </div>
        <div
          className={
            location[4] !== "complaints"
              ? sidebarButtonStyle
              : sidebarButtonStyle + active
          }
        >
          <div className="ml-2 p-0">
            <GppMaybeIcon />
          </div>
          <div className="h-full truncate">Complaints</div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <>
      <div className="border"></div>
    </>
  );
}

function SidebarButton({ title, url, icon }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(baseUrl + url)}
      className={
        location.pathname.split("/")[4] !== url
          ? sidebarButtonStyle
          : sidebarButtonStyle + active
      }
    >
      <div className="ml-2 p-0">{icon}</div>
      <div className="h-full truncate">{title}</div>
    </div>
  );
}

export default Sidebar;
