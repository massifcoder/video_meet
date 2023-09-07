import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Front from './components/front'
import Extra from './components/extra';
import Header from './components/frontComp/header'
import Meeting from './components/meeting';
import SideBar from './components/frontComp/sideBar';
import LoginPage from './components/login';

function App() {

  return (
    <div className="bg-[#1a1225] text-white min-h-screen w-screen h-full">

      <Router>
        <Header />
        <div className="flex relative justify-normal w-full h-fit">
          <SideBar />
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/meet' element={<Front />} />
            <Route path='/call/:room' element={<Meeting />} />
            <Route path='/mail' element={<Extra />} />
            <Route path='/account' element={<Extra />} />
            <Route path='/calender' element={<Extra />} />
            <Route path='/bell' element={<Extra />} />
          </Routes>
        </div>
      </Router>

    </div>
  )
}

export default App
