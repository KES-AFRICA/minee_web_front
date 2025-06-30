import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useEffect, useState, createContext, useContext } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-slate-800">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          {/* Desktop Sidebar */}
          <aside
            className={cn(
              "hidden lg:block shrink-0 relative z-30 transition-all duration-300 ease-in-out",
              isCollapsed ? "w-20" : "w-72"
            )}
          >
            <div className="fixed h-full">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Fixed Header */}
            <div className="sticky top-0 z-20 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-teal-200/50 dark:border-teal-700/50 shadow-sm">
              <Header
                mobileMenuTrigger={
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden transition-all duration-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      {isSidebarOpen ? (
                        <X className="h-8 w-8 text-black" />
                      ) : (
                        <Menu className="h-8 w-8 text-black dark:text-white" />
                      )}
                      <span className="sr-only">
                        {isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                      </span>
                    </Button>
                  </SheetTrigger>
                }
              />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto">
              <div
                className={cn(
                  "min-h-full px-4 py-6 lg:px-8 lg:py-8",
                  "bg-gradient-to-br from-white/30 to-cyan-50/30 dark:from-gray-800/30 dark:to-slate-900/30"
                )}
              >
                {/* Content Container */}
                <div className="mx-auto">
                  <Outlet />
                </div>
              </div>
            </div>
          </main>

          {/* Mobile Sidebar Sheet Content */}
          <SheetContent
            side="left"
            className="w-72 p-0 border-none shadow-2xl bg-transparent backdrop-blur-sm"
          >
            <div className="h-full">
              <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarContext.Provider>
  );
};
