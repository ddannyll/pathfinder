import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/ui/Home'

function App() {
    console.log('test')
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
