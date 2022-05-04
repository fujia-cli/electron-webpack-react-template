import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { Home } from '@pages/home';
import { LoginAndRegisterPage } from '@pages/login-register';
import { ROUTER } from './constants';
import { DevelopPage } from '@pages/develop';
import { ToolPage } from '@pages/tools';
import { ServicePage } from '@pages/services';
import { ApplicationPage } from '@pages/applications';

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} caseSensitive>
          <Route index element={<DevelopPage />} />
          <Route path={ROUTER.tools} element={<ToolPage />} />
          <Route path={ROUTER.services} element={<ServicePage />} />
          <Route path={ROUTER.apps} element={<ApplicationPage />} />
        </Route>
        <Route path={ROUTER.login} element={<LoginAndRegisterPage />} />
        <Route path={ROUTER.register} element={<LoginAndRegisterPage />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </HashRouter>
  );
};

export default Router;
