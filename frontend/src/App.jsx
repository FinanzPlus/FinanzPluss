import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Layouts
import MainLayout from '@/components/common/MainLayout';

// Composants de sécurité et légaux
import CookieBanner from '@/components/common/CookieBanner';

// Pages publiques
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import LoanSimulator from '@/pages/LoanSimulator';
import LoanComparator from '@/pages/LoanComparator';
import BorrowingCapacity from '@/pages/BorrowingCapacity';
import About from '@/pages/About';
import Reviews from '@/pages/Reviews';
import Contact from '@/pages/Contact';
import Appointments from '@/pages/Appointments';
import NotFound from '@/pages/NotFound';

// Pages légales
import Impressum from '@/pages/Impressum';
import Datenschutz from '@/pages/Datenschutz';
import AGB from '@/pages/AGB';
import Cookies from '@/pages/Cookies';

// Pages utilisateur
import Profile from '@/pages/Profile';
import UserDashboard from '@/pages/user/UserDashboard';

// Pages admin
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Styles
import '@/styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques avec layout */}
          <Route element={<MainLayout />}>
            {/* Pages principales */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Services financiers */}
            <Route path="/kreditrechner" element={<LoanSimulator />} />
            <Route path="/kreditvergleich" element={<LoanComparator />} />
            <Route path="/kreditfahigkeit" element={<BorrowingCapacity />} />
            
            {/* Informations */}
            <Route path="/uber-uns" element={<About />} />
            <Route path="/bewertungen" element={<Reviews />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/termine" element={<Appointments />} />
            
            {/* Pages légales */}
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Espace utilisateur */}
            <Route path="/profil" element={<Profile />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            
            {/* Espace admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <CookieBanner />
      </Router>
    </AuthProvider>
  );
}

export default App;

// Made with Bob
