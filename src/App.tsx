import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import AppProviders from "./context/AppProviders";
import { Layout } from "./components/layout/Layout";
import Utilisateur from "./components/pages/utilisateur/Utilisateur";
import Actifs from "./components/pages/actifs/Actifs";
import Parametres from "./components/pages/parametres/Parametres";
import Rapport from "./components/pages/rapports/Rapport";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import { ThemeProvider } from "./context/ThemeProvider";
import AssetMapPage from "./components/pages/cartographie/components/AssetMapPage";

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  // const isAuthenticated = AuthService.getToken() !== null;
  // return isAuthenticated ? element : <Navigate to="/login" replace />;
  return <>{element}</>;
};
const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  // const { isAuthenticated } = useAuth();

  // return isAuthenticated ? <Navigate to="/" /> : <>{element}</>;
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
              <Route path="/carte" element={<AssetMapPage />} />
              <Route path="/rapport" element={<Rapport />} />
              <Route path="/parametres" element={<Parametres />} />
            </Route>
          </Routes>
        </Router>
      </AppProviders>
    </ThemeProvider>
  );
}
