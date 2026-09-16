import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CarsPage } from "@/features/cars/pages/CarsPage";


export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CarsPage />} />      
    </Routes>
  </BrowserRouter>
);
