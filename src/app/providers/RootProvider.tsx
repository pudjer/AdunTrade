import { FC, PropsWithChildren, Suspense, memo } from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { ThemeProvider } from "./ThemeProvider";





export const RootProvider: FC<PropsWithChildren> = memo(({children}) => {
  return (
      <ThemeProvider>
        <Suspense fallback={<div style={{backgroundColor: 'black', width: '100vh', height: '100vh'}}/>}>
          <ErrorBoundary>
              <BrowserRouter>
                {children}
              </BrowserRouter>
          </ErrorBoundary>
        </Suspense>
      </ThemeProvider>
  );
})