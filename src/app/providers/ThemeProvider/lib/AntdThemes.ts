import { ThemeConfig } from 'antd/es/config-provider/context';
import { Theme } from './ThemeContext';
import { theme } from 'antd';

type AntdThemesT = {
    [Item in Theme]: ThemeConfig
}

export const commonTheme: ThemeConfig = {
  token: {
    colorInfo: "#c88138",
    colorPrimary: "#c88138",
    colorWarning: "#f28881",
    colorTextBase: "#fff4b3",
  },
  
}

export const AntdThemes: AntdThemesT = {
    [Theme.DARK]: {
      components: {
        Layout: {
          siderBg: '#231b14',
          triggerBg: '#161b14'
        }
      },
      algorithm: theme.darkAlgorithm
    },
    [Theme.LIGHT]: {
      components: {
        Layout: {
          siderBg: '#cfcfcf',
          triggerBg: '#9c9c9c'
        }
      },
      token: {
        colorTextBase: "#363214",
      }
    }
};
