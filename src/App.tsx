import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Insights from './pages/Insights';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
