import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";

import Dashboard from "./pages/Dashboard";
import Receber from "./pages/Receber";
import Pagar from "./pages/Pagar";

import HistoricoPagar from "./pages/HistoricoPagar";
import HistoricoReceber from "./pages/HistoricoReceber";

import Contas from "./pages/Contas";
import Login from "./pages/Login";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />

        <Route path="receber" element={<Receber />} />

        <Route path="pagar" element={<Pagar />} />

        <Route
          path="historico"
          element={<HistoricoPagar />}
        />

        <Route
          path="historico-pagar"
          element={<HistoricoPagar />}
        />

        <Route
          path="historico-receber"
          element={<HistoricoReceber />}
        />

        <Route path="contas" element={<Contas />} />
      </Route>

    </Routes>
  </BrowserRouter>
);