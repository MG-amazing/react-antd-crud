import axios from 'axios'
import { message } from 'antd'

// 创建实例
const service = axios.create({
    baseURL: '/api', // 配合 vite 代理
    timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 👉 token（你接ruoyi必须有）
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data

        // 👉 适配 ruoyi 返回格式
        if (res.code !== 200) {
            message.error(res.msg || '请求失败')

            // 👉 token失效
            if (res.code === 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }

            return Promise.reject(res)
        }

        return res
    },
    (error) => {
        message.error(error.message || '网络错误')
        return Promise.reject(error)
    }
)

export default service
