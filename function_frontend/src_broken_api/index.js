import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import TestPages from './pages/TestPages';
import TestCard from './components/TestCard';
import KirishHeader from './pages/KirishHeader';
import Saythaqida from './pages/Saythaqida';
import Matematika from './pages/Matematika';
import Attempts from './pages/Attempts';
import { AuthProvider } from './context/AuthContext';

const appRouter = createBrowserRouter([
  {
    element: <App />,
    errorElement: <div>error</div>,
    children: [
      { element: <Home />, path: '/' },
      { element: <Account />, path: '/account' },
      { element: <TestPages />, path: '/test' },
      { element: <TestPages />, path: '/iqtisod' },
      { element: <Matematika />, path: '/matematika' },
      { element: <TestCard />, path: '/card' },
      { element: <KirishHeader />, path: '/hae' },
      { element: <Saythaqida />, path: '/syt' },
      { element: <Matematika />, path: '/mtm' },
      { element: <Attempts />, path: '/attempts' },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  </React.StrictMode>
);
