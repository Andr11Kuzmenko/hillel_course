import { useAppContext } from '../context/AppContext.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import MainContent from './MainContent.jsx'

export default function Layout() {
  const { theme } = useAppContext()

  return (
    <div className={`layout theme-${theme}`}>
      <Header />
      <div className="layout__body">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}
