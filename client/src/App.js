import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Main from './Components/Main/Main';
import Login from './Components/Member/Login';
import SignUp from './Components/Member/SignUp';
import BoardList from './Components/Board/BoardList';
import TeamMain from './Components/Team/TeamMain';
import StadiumMain from './Components/Stadium/StadiumMain';
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
        <Route path="/board" element={<BoardList title={"자유게시판"} />} />
        {/* 
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/detail/:id" element={<BoardDetail />} />
        <Route path="/board/update/:id" element={<BoardUpdate />} /> 
        */}

        {/* Team */}
        <Route path="/team" element={<TeamMain title={"팀 관리"} />} />

        {/* Stadium */}
        <Route path="/stadium" element={<StadiumMain title={"구장 찾기"} />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
