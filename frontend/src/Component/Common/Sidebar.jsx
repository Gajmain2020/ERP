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
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

import { Deparatments } from "../../Constants/Constants";
import { useEffect, useState } from "react";

const teacherSidebarOption = [
  {
    title: "Divider",
  },
  // {
  //   title: "Classes",
  //   icon: <SchoolIcon />,
  //   url: "classes",
  // },
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
    title: "Find Student",
    icon: <PersonSearchIcon />,
    url: "find-student",
  },
  {
    title: "Complaints",
    icon: <GppMaybeIcon />,
    url: "complaints",
  },
];

const studentSidebarOption = [
  {
    title: "Divider",
  },
  {
    title: "Attendance",
    icon: <SchoolIcon />,
    url: "attendance",
  },
  {
    title: "Time Table",
    icon: <EventNoteIcon />,
    url: "time-table",
  },
  {
    title: "Assesment Results",
    icon: <AssessmentIcon />,
    url: "assesment-results",
  },
  {
    title: "Results",
    icon: <FactCheckIcon />,
    url: "results",
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
    title: "PYQ(s)",
    icon: <DescriptionIcon />,
    url: "pyq",
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
    title: "Events",
    icon: <EmojiEventsIcon />,
    url: "events",
  },
  {
    title: "Complaints",
    icon: <GppMaybeIcon />,
    url: "complaints",
  },
];

const departmentAdminSidebarOption = [
  {
    title: "Divider",
  },
  {
    title: "Courses",
    icon: <SchoolIcon />,
    url: "courses",
  },
  {
    title: "Time Table",
    icon: <EventNoteIcon />,
    url: "time-table",
  },
  {
    title: "Divider",
  },
  {
    title: "Students",
    icon: <SupervisedUserCircleIcon />,
    url: "students",
  },
  {
    title: "Teachers",
    icon: <Diversity2Icon />,
    url: "teachers",
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
    title: "Complaints",
    icon: <GppMaybeIcon />,
    url: "complaints",
  },
];

const sidebarButtonStyle =
  "w-full px-3 flex gap-5  text-md hover:bg-zinc-400/60 transition-all delay-150 hover:text-black rounded-lg py-2 active:outline-none active:ring active:ring-zinc-900/50 font-semibold items-center cursor-pointer";

const sidebarComponentStyle =
  "backdrop-blur fixed sm:hidden xs:hidden left-0 top-16 w-1/5 mt-2 xl:flex lg:flex md:flex border-rounded p-2 flex-col gap-2 min-h-[89vh] bg-white/30 text-white flex rounded-md ";

const active = " bg-zinc-200/70 text-zinc-900";

function Sidebar() {
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    var tempBaseUrl = location.join("/");
    tempBaseUrl = tempBaseUrl + "/";
    setBaseUrl(tempBaseUrl);
  }, []);

  const location = useLocation().pathname.split("/");
  const userType = location[1];
  const department = location[2];
  return (
    <>
      {userType === "teacher" && <TeacherSidebar baseUrl={baseUrl} />}
      {userType === "student" && <StudentSidebar baseUrl={baseUrl} />}
      {(userType === "admin" || userType === "Admin") && (
        <AdminSidebar department={department} baseUrl={baseUrl} />
      )}
    </>
  );
}

function AdminSidebar({ department, baseUrl }) {
  if (Deparatments.includes(department)) {
    return <DepartmentAdminSidebar department={department} />;
  }
  return <>hello world</>;
}

function DepartmentAdminSidebar({ department, baseUrl }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex overflow-auto">
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

          {departmentAdminSidebarOption.map((option) => (
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
    </>
  );
}

function TeacherSidebar({ baseUrl }) {
  const navigate = useNavigate();

  return (
    <div className="flex overflow-auto">
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
                baseUrl={baseUrl}
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

function StudentSidebar({ baseUrl }) {
  const navigate = useNavigate();

  return (
    <div className="flex overflow-auto ">
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

        {studentSidebarOption.map((option) => (
          <>
            {option.title !== "Divider" ? (
              <SidebarButton
                title={option.title}
                url={option.url}
                icon={option.icon}
                baseUrl={baseUrl}
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

function Divider() {
  return (
    <>
      <div className="border"></div>
    </>
  );
}

function SidebarButton({ title, url, icon, baseUrl }) {
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
