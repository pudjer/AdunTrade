import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Sidebar } from '@/widgets/Sidebar';
import style from './PageLayout.module.scss';
import { memo } from 'react';
import { AppRoutes } from '../routes/Routes';

export const PageLayout =memo(() => {
  return (
    <Layout hasSider>
      <Sidebar />
      <Layout>
        <Content className={classNames(style.content)}>
          <AppRoutes/>
        </Content>
      </Layout>
    </Layout>
  );
});
