
import { Routes, Route } from 'react-router-dom';
import  Layout  from './components/Layout';
import  HomePage  from './pages/HomePage';
import  DataSourcesPage  from './pages/DataSourcesPage';
import  BIQueryPage  from './pages/BIQueryPage';
import  ReportsPage  from './pages/ReportsPage';
import  SettingsPage  from './pages/SettingsPage';


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="data-sources" element={<DataSourcesPage />} />
        <Route path="query" element={<BIQueryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}
