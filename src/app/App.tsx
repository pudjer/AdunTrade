import { classNames } from '@/shared/lib/classNames/classNames';
import { PageLayout } from './PageLayout/PageLayout';
import { useTheme } from './providers/ThemeProvider';
import './styles/reset.scss';



function App() {
  const { theme } = useTheme();
  
  return (
      <div className={classNames('app', {}, [theme])}>
        <PageLayout />
      </div>
  );
}

export default App;
