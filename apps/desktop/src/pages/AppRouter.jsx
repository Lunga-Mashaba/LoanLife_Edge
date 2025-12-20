import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout.jsx';
import Portfolio from '../components/dashboard/Portfolio.jsx';
import LoanDetail from '../components/digitalTwin/LoanDetail.jsx';
import Settings from './Settings.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/loan/:id" element={<LoanDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
