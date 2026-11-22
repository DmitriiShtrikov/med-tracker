// src/app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute'; // Импортируем защиту
import Layout from '../shared/ui/Layout';
import DashboardPage from '../pages/DashboardPage';
import CabinetPage from '../pages/CabinetPage';
import SymptomsPage from '../pages/SymptomsPage';
import EmergencyPage from '../pages/EmergencyPage';
import SheltersPage from '../pages/SheltersPage';
import AddMedicinePage from '../pages/AddMedicinePage';
import EditMedicinePage from '../pages/EditMedicinePage';
import LoginPage from '../pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичный роут (Вход) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Защищенные роуты (Доступны только с токеном) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="cabinet" element={<CabinetPage />} />
            <Route path="symptoms" element={<SymptomsPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="shelters" element={<SheltersPage />} />
            <Route path="add" element={<AddMedicinePage />} />
            <Route path="edit/:id" element={<EditMedicinePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;