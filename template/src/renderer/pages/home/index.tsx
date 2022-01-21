import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { shell } from 'electron';

import { useAppSelector } from '@store/hooks';
import { selectAppName } from '@store/globalSlice';
import { getAppPath } from '@utils/appPath';

const Home = () => {
  const appName = useAppSelector(selectAppName);
  const navigate = useNavigate();
  const [appPath, setAppPath] = useState('');

  const handleLink = (routeName: string) => {
    return () => {
      if (routeName === 'counter') {
        navigate('/counter');
      } else if (routeName === 'github') {
        shell.openExternal('https://github.com/fushenguang/marathon');
      }
    };
  };

  useEffect(() => {
    getAppPath().then((rootPath: string) => {
      if (rootPath) {
        setAppPath(rootPath);
      }
    });
  }, []);

  return (
    <section style={{ padding: 24 }}>
      <h1>{appName}</h1>
      <h1>应用的根路径： {appPath}</h1>
      <div onClick={handleLink('counter')}>计数器</div>
      <div onClick={handleLink('github')}>github</div>
    </section>
  );
};

export default Home;
