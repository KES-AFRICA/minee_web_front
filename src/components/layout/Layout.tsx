import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-slate-800">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 relative z-30">
            <div className="fixed w-72 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-teal-100">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col lg:ml-0 relative">
            {/* Header */}
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

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              <div
                className={cn(
                  "min-h-full px-4 py-6 lg:px-8 lg:py-8",
                  "bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-800/50 dark:to-slate-900/50",
                  "transition-all duration-300 ease-in-out"
                )}
              >
                {/* Content Container */}
                <div className="max-w-7xl mx-auto">
                  <Outlet />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Sheet Content */}
        <SheetContent
          side="left"
          className="w-72 p-0 border-none shadow-2xl bg-transparent backdrop-blur-sm"
        >
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-teal-100">
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
