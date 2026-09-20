// src/app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../shared/ui/Layout';
import DashboardPage from '../pages/DashboardPage';
import CabinetPage from '../pages/CabinetPage';
import SymptomsPage from '../pages/SymptomsPage';
import EmergencyPage from '../pages/EmergencyPage';
import SheltersPage from '../pages/SheltersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="cabinet" element={<CabinetPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="shelters" element={<SheltersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;