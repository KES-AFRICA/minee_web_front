import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import AppProviders from "./context/AppProviders";
import { Layout } from "./components/layout/Layout";
import Actifs from "./components/pages/actifs/Actifs";
import Parametres from "./components/pages/parametres/Parametres";
import Rapport from "./components/pages/rapports/Rapport";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import { ThemeProvider } from "./context/ThemeProvider";
import CollectorPerformancePage from "./components/pages/collecteurs/CollectorPerformancePage";
import { useThemeStore } from "@/store/themeStore.ts";
import { useEffect } from "react";
import Maps from "@/components/pages/cartographie/Maps.tsx";
import { ToastContainer } from "react-toastify";
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  return <>{element}</>;
};
const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  return <>{element}</>;
};
export default function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <ThemeProvider>
      <AppProviders>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={<PublicRoute element={<LoginForm />} />}
            />
            <Route element={<PrivateRoute element={<Layout />} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/immobilisations" element={<Actifs />} />
              <Route path="/systeme_information_graphique" element={<Maps />} />
              <Route path="/rapport" element={<Rapport />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="/parametres/:tab" element={<Parametres />} />
              <Route
                path="/suivi_inventaire"
                element={<CollectorPerformancePage />}
              />
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </AppProviders>
    </ThemeProvider>
  );
}
