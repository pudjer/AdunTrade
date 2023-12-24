import { Layout, Menu } from 'antd';
import { classNames } from '@/shared/lib/classNames/classNames';
import { HomeOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.scss';
import { LangSelect } from '@/widgets/LangSelect/ui/LangSelect';
import { useState } from 'react';
import { ThemeChanger } from '@/widgets/ThemeChanger';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation();
  const nav = useNavigate()
  return (
    <Sider
    breakpoint='xs'
    color='red'
    collapsible
    collapsed={collapsed}
    onCollapse={(value) => setCollapsed(value)}
    className={classNames(styles.sider)}
    >
      <div className={classNames(styles.container)}>
        <Menu style={{borderRadius: 6}}
        items={[
          { key: 1, label: t('Предметы'), icon: <ShopOutlined />, onClick: ()=>nav('items')},
          { key: 2, label: t('Профиль'), icon: <UserOutlined />, onClick: ()=>nav('user')},
          { key: 3, label: t('Дом'), icon: <HomeOutlined />, onClick: ()=>nav('')}

                ]}
      />
      <LangSelect />
      <ThemeChanger />
      </div>
    </Sider>
  );
};
