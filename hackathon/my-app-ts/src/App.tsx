

import React from 'react';
import Contents from "./components/Contents"
import {LoginForm} from "./components/LoginForm"
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";

const App = () => {
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  
  // ログイン状態を監視して、stateをリアルタイムで更新する
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });
  
  return (
    <>
      <LoginForm />
      {/* ログインしていないと見られないコンテンツは、loginUserがnullの場合表示しない */}
      {loginUser ? <Contents /> : null}
    </>
  );
};
export default App;
