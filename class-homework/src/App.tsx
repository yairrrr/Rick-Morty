import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import CharactersPage from './pages/CharactersPage'
import EpisodesPage from './pages/EpisodesPage'
import NotFoundPage from './pages/NotFoundPage'

// Which page shows at which address. All pages sit inside Layout.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CharactersPage />} />
        <Route path="episodes" element={<EpisodesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
