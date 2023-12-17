import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [react({tsDecorators: true}), svgr()],
  resolve: {
    alias: {
       '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __IS_DEV__: JSON.stringify(true)
  }
})
