import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';
import { AntdThemes, commonTheme } from '../lib/AntdThemes';
import { Theme } from '../lib/ThemeContext';

export const AntdProvider = (props: {children: ReactNode, theme: Theme}) => {
    return (
        <ConfigProvider theme={commonTheme}>
            <ConfigProvider theme={AntdThemes[props.theme]}>
                {props.children}
            </ConfigProvider>
        </ConfigProvider>
    );
};
