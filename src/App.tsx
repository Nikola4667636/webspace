import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Planets from "./pages/Planets";
import Missions from "./pages/Missions";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="planets" element={<Planets />} />
        <Route path="missions" element={<Missions />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
