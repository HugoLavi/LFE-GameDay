import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EquipesPage from "./pages/Equipes";
import PlanningPage from "./pages/Planning";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/equipes" element={<EquipesPage />} />
      <Route path="/planning" element={<PlanningPage />} />
    </Routes>
  );
}
