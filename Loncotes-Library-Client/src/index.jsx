import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MaterialList from "./components/tickets/MaterialList";
import MaterialDetails from "./components/tickets/MaterialDetails";
import CreateMaterial from "./components/tickets/CreateMaterial";
import { PatronList } from "./components/tickets/PatronList";
import { PatronDetails } from "./components/tickets/PatronDetails";
import { EditPatron } from "./components/tickets/Forms/EditPatron";
import { CheckoutList } from "./components/tickets/CheckoutList";
import { NewCheckout } from "./components/tickets/Forms/NewCheckout";
import { OverdueCheckouts } from "./components/tickets/OverdueCheckouts";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="materials">
          <Route index element={<MaterialList />} />
          <Route path=":id" element={<MaterialDetails />} />
          <Route path="create" element={<CreateMaterial />} />
        </Route>
        <Route path="patrons">
          <Route index element={<PatronList />} />
          <Route path=":id" element={<PatronDetails />} />
          <Route path="edit/:id" element={<EditPatron />} />
        </Route>
        <Route path="checkouts">
          <Route index element={<CheckoutList />} />
          <Route path=":id" element={<NewCheckout />} />
          <Route path="overdue" element={<OverdueCheckouts />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
