import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const Interaction = lazy(() => import('pages/interaction/Interaction'));
const Process = lazy(() => import('pages/process/Process'));
const Client = lazy(() => import('pages/client/Client'));
const Configuration = lazy(() => import('pages/configuration/Configuration.js'));

const routes = [
  {
    path: '/client',
    component: Client,
  },
  {
    path: '/interaction',
    component: Interaction,
  },
  {
    path: '/process',
    component: Process,
  },
  {
    path: '/configuration',
    component: Configuration,
  },
];

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Suspense fallback={<div className="lazy-loading">Loading...</div>}>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Suspense>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
