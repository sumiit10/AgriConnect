import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import EquipmentList from './pages/EquipmentList.jsx';
import EquipmentDetails from './pages/EquipmentDetails.jsx';
import EquipmentForm from './pages/EquipmentForm.jsx';
import MyEquipment from './pages/MyEquipment.jsx';
import MyRentals from './pages/MyRentals.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="equipment" element={<EquipmentList />} />
      <Route path="equipment/:id" element={<EquipmentDetails />} />
      <Route element={<ProtectedRoute />}>
        <Route path="rentals" element={<MyRentals />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route element={<ProtectedRoute ownerOnly />}>
        <Route path="owner/equipment" element={<MyEquipment />} />
        <Route path="owner/equipment/new" element={<EquipmentForm />} />
        <Route path="owner/equipment/:id/edit" element={<EquipmentForm />} />
      </Route>
      <Route path="/my-equipment" element={<Navigate to="/owner/equipment" replace />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}
