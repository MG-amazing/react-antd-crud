import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserPage from '@/page/user'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserPage />} />
            </Routes>
        </BrowserRouter>
    )
}
