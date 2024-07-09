import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Main from './Components/Main/Main';
import Login from './Components/Member/Login';
import SignUp from './Components/Member/SignUp';
// import { useEffect } from 'react';
// import axios from 'axios'

function App() {

  // useEffect(() => {
  //   axios.get("/api/test")
  // }, [])

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />

        {/* Member */}
        <Route path="/login" element={<Login title={"로그인"} />} />
        <Route path="/signup" element={<SignUp title={"회원가입"} />} />

        {/* Board */}
        {/* <Route path="/board/list" element={<BoardList />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/detail/:id" element={<BoardDetail />} />
        <Route path="/board/update/:id" element={<BoardUpdate />} /> */}

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
