import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import AppProviders from "./context/AppProviders";
import { Layout } from "./components/layout/Layout";
import Utilisateur from "./components/pages/utilisateur/Utilisateur";
import Actifs from "./components/pages/actifs/Actifs";
import Cartographie from "./components/pages/cartographie/Cartographie";
import Parametres from "./components/pages/parametres/Parametres";
import Rapport from "./components/pages/rapports/Rapport";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import { ThemeProvider } from "./context/ThemeProvider";
import CollectorPerformancePage from "./components/pages/collecteurs/CollectorPerformancePage";

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  return <>{element}</>;
};
const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  return <>{element}</>;
};
export default function App() {
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
              <Route path="/utilisateur" element={<Utilisateur />} />
              <Route path="/actifs" element={<Actifs />} />
              <Route path="/carte" element={<Cartographie />} />
              <Route path="/rapport" element={<Rapport />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route
                path="/collecteurs"
                element={<CollectorPerformancePage />}
              />
            </Route>
          </Routes>
        </Router>
      </AppProviders>
    </ThemeProvider>
  );
}
