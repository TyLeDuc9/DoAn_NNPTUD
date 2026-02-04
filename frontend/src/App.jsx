import './App.css'
import { AppRoutes } from './routes/AppRoutes'
import { GlobalLoading } from "./components/Loading/GlobalLoading";
function App() {

  return (
    <>
      <AppRoutes />
      <GlobalLoading />
    </>
  )
}
export default App
