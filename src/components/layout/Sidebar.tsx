// import { Link, useLocation, useNavigate } from "react-router-dom";
// import eneologo from "../../assets/logo1.webp";
// import { navigationLinks } from "./navigationData";
// import { type JSX } from "react";
// import {
//   Settings,
//   ChevronRight,
//   LayoutDashboard,
//   Users2,
//   Boxes,
//   Map,
//   LogOut,
// } from "lucide-react";
// import { cn } from "../../lib/utils";

// interface SidebarProps {
//   onItemClick?: () => void;
// }

// const iconMapping: Record<string, JSX.Element> = {
//   dashboard: <LayoutDashboard className="w-5 h-5" />,
//   utilisateur: <Users2 className="w-5 h-5" />,
//   actifs: <Boxes className="w-5 h-5" />,
//   carte: <Map className="w-5 h-5" />,
//   parametres: <Settings className="w-5 h-5" />,
// };

// const Sidebar = ({ onItemClick }: SidebarProps) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isActiveLink = (href: string) => {
//     return (
//       location.pathname === href ||
//       (href !== "/" && location.pathname.startsWith(href))
//     );
//   };
//   const handleLogout = () => {
//     // AuthService.logout();
//     navigate("/login");
//   };

//   return (
//     <div className="fixed w-72 h-full bg-gradient-to-br bg-cyan-90 from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-slate-800 shadow-2xl">
//       {/* Header Section */}
//       <div className="relative p-6 pb-4">
//         {/* Decorative background elements */}
//         <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-4 translate-x-4"></div>
//         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>

//         {/* Logo Container */}
//         <div className="relative z-10 flex flex-row gap-2 items-center">
//           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/20 transition-transform hover:scale-105">
//             <img
//               src={eneologo}
//               alt="ENEO Logo"
//               className="w-14 h-14 object-cover rounded-full"
//             />
//           </div>

//           {/* Title */}
//           <div className="mt-4 text-center">
//             <h2 className="text-2xl  font-bold text-teal-700 uppercase tracking-wider leading-tight">
//               ARCTIC-ELEC
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Section */}
//       <div className="mt-3 px-4 pb-6">
//         <div className="space-y-2">
//           {navigationLinks.map((group, groupIndex) => (
//             <div key={groupIndex} className="space-y-1">
//               {group.items.map((link) => {
//                 const isActive = isActiveLink(link.href);

//                 return (
//                   <Link
//                     key={link.name}
//                     to={link.href}
//                     onClick={onItemClick}
//                     className={cn(
//                       "group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-out",
//                       "hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:translate-x-1",
//                       "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-800",
//                       isActive
//                         ? "bg-white text-teal-900 shadow-lg transform translate-x-1 font-semibold"
//                         : "text-black dark:text-white "
//                     )}
//                   >
//                     {/* Background gradient for active state */}
//                     {isActive && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-50 rounded-xl opacity-100"></div>
//                     )}

//                     {/* Icon Container */}
//                     <div
//                       className={cn(
//                         "relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
//                         isActive
//                           ? "bg-cyan-100 text-teal-700"
//                           : "text-black dark:text-white"
//                       )}
//                     >
//                       {link.iconName && iconMapping[link.iconName]}
//                     </div>

//                     {/* Text */}
//                     <span
//                       className={cn(
//                         "relative z-10 ml-3 text-sm font-medium transition-colors duration-300",
//                         isActive
//                           ? "text-teal-900"
//                           : "text-black dark:text-gray-100"
//                       )}
//                     >
//                       {link.name}
//                     </span>

//                     {/* Active indicator */}
//                     {isActive && (
//                       <div className="relative z-10 ml-auto">
//                         <ChevronRight className="w-4 h-4 text-teal-600" />
//                       </div>
//                     )}

//                     {/* Hover effect background */}
//                     <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </Link>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* deconnexion */}
//       <div className="absolute bottom-0 left-0 w-full  flex items-center justify-center">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 text-red-600 text-sm "
//         >
//           <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//           <span>Déconnexion</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import { Link, useLocation, useNavigate } from "react-router-dom";
import eneologo from "../../assets/logo1.webp";
import { navigationLinks } from "./navigationData";
import { type JSX } from "react";
import {
  Settings,
  ChevronRight,
  LayoutDashboard,
  Users2,
  Boxes,
  Map,
  LogOut,
  ChartBar,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  onItemClick?: () => void;
}

const iconMapping: Record<string, JSX.Element> = {
  dashboard: <LayoutDashboard className="w-5 h-5" />,
  utilisateur: <Users2 className="w-5 h-5" />,
  actifs: <Boxes className="w-5 h-5" />,
  carte: <Map className="w-5 h-5" />,
  rapport: <ChartBar className="w-5 h-5" />,
  parametres: <Settings className="w-5 h-5" />,
};

const Sidebar = ({ onItemClick }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (href: string) => {
    return (
      location.pathname === href ||
      (href !== "/" && location.pathname.startsWith(href))
    );
  };

  const handleLogout = () => {
    // AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="fixed w-72 h-full bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-slate-800 shadow-2xl">
      {/* Header Section */}
      <div className="relative p-6 pb-4">
        {/* Logo Container */}
        <div className="relative z-10 flex flex-row gap-2 items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/20 transition-transform hover:scale-105">
            <img
              src={eneologo}
              alt="ENEO Logo"
              className="w-14 h-14 object-cover rounded-full"
            />
          </div>

          {/* Title */}
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-teal-700 uppercase tracking-wider leading-tight">
              ARCTIC-ELEC
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mt-3 px-4 pb-20">
        <div className="space-y-2">
          {navigationLinks.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.items.map((link) => {
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={onItemClick}
                    className={cn(
                      "group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-out",
                      "hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:translate-x-1",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-800",
                      isActive
                        ? "bg-white text-teal-900 shadow-lg transform translate-x-1 font-semibold"
                        : "text-black dark:text-white"
                    )}
                  >
                    {/* Background gradient for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-50 rounded-xl opacity-100" />
                    )}

                    {/* Icon Container */}
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-cyan-100 text-teal-700"
                          : "text-black dark:text-white"
                      )}
                    >
                      {link.iconName && iconMapping[link.iconName]}
                    </div>

                    {/* Text */}
                    <span
                      className={cn(
                        "relative z-10 ml-3 text-sm font-medium transition-colors duration-300",
                        isActive
                          ? "text-teal-900"
                          : "text-black dark:text-gray-100"
                      )}
                    >
                      {link.name}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="relative z-10 ml-auto">
                        <ChevronRight className="w-4 h-4 text-teal-600" />
                      </div>
                    )}

                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 bg-red-500/10 hover:bg-red-50/20 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
