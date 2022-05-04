export const ROUTER = {
  home: '/',
  login: '/login',
  register: '/register',
  develop: '/develop',
  tools: '/tools',
  services: '/services',
  apps: '/apps',
};

export const ROUTER_KEYS = {
  home: 'home',
  login: 'login',
  register: 'register',
  develop: 'develop',
  tools: 'tools',
  services: 'services',
  apps: 'apps',
};

export const ROUTER_ENTRY: IRouter.Item[] = [
  {
    url: ROUTER.home,
    key: ROUTER_KEYS.home,
    text: '首页',
  },
];
