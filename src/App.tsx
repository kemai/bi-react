// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { appRoutes } from "./routes";
import NotFound from "./pages/404";

export default function App() {
  return (
    <>
      <Routes>
        {/* Tutte le rotte “normali” dentro a Layout */}
        <Route element={<Layout />}>
          {appRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* La pagina 404 full-screen */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
