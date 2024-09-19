import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/pages/MainPage";
import { Layout } from "./components/Layout";
import MatchPage from "./components/pages/MatchPage";
import { AppProvider } from "./components/AppContext";
import StatsPage from "./components/pages/Stats";

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<MainPage />} />
                        <Route
                            path="/match-details/:id"
                            element={<MatchPage />}
                        />
                        <Route
                            path="/stats"
                            element={<StatsPage />}
                        />
                    </Route>
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
