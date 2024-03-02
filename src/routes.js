import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const Interaction = lazy(() => import('pages/interaction/Interaction'));
const Process = lazy(() => import('pages/process/Process'));
const Client = lazy(() => import('pages/client/Client'));
const Quora = lazy(() => import('pages/quora/Quora.js'));
const Job = lazy(() => import('pages/job/Job.js'));
const Account = lazy(() => import('pages/account/Account.js'));
const Tag = lazy(() => import('pages/tag/Tag.js'));
const Link = lazy(() => import('pages/link/Link.js'));

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
    path: '/job',
    component: Job,
  },
  {
    path: '/quora',
    component: Quora,
  },
  {
    path: '/account',
    component: Account,
  },
  {
    path: '/tag',
    component: Tag,
  },
  {
    path: '/link',
    component: Link,
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
