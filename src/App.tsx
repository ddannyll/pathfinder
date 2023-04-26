import { HashRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/ui/Home'

function App() {
    console.log('test')
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
            </Routes>
        </HashRouter>
    )
}

export default App
