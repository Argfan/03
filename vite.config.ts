import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
//   resolve: {
//     extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
//     alias: {
//         '@': join(__dirname, './src'),
//     },
// },
})
