import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {ConfigProvider} from "antd";
import jaJP from 'antd/es/locale/ja_JP';
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

// 👇 设置全局语言
dayjs.locale('ja')
createRoot(document.getElementById('root')!).render(
    <ConfigProvider locale={jaJP}>
    <App />
    </ConfigProvider>
)
