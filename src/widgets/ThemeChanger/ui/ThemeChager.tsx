import { ConfigProvider, Switch, ThemeConfig } from "antd";
import { Theme, useTheme } from "@/app/providers/ThemeProvider";
import { classNames } from "@/shared/lib/classNames/classNames";
import styles from './ThemeChager.module.scss'

export const ThemeChanger = () => {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme!==Theme.DARK
  const bglight = 'lightyellow'
  const bgdark = 'black'
  const token: ThemeConfig['token'] = {}
  token.colorPrimary = isLight ? bglight : bgdark
  token.colorTextQuaternary = isLight ? bglight : bgdark
  return (
    <ConfigProvider theme={{token:token}}>
      <Switch 
      className={classNames(styles.switch, {checked: isLight})}
      checked={isLight}
      onChange={toggleTheme}
      />
    </ConfigProvider>
    
  )
};