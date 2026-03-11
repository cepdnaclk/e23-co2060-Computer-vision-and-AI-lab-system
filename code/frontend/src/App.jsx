import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import Home from "./pages/Home";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/catalog" element={<Catalog />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}