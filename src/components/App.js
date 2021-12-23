import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

export default function App() {
  const [init, setInit] = useState(false);
  // 아래처럼 islLoggedIn을 없애고, userObj를 불리언으로 사용해서 존재할 때 로그인이 되도록할 수 있다.
  // 이렇게 하면, 하나의 랜더링을 줄인 것이다.
  /* const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); */

  // userObj는 어플리케이션의 상단에 위치해야한다. 다른 페이지에서 userObj를 원할 수도 있기 때문이다. (Home, Profile 등)
  // 그리고 나서, router로 보낼 수 있다. router가 스크린으로 뿌려줄 수 있다.
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // state의 변화를 다루고 있다.
    // 로그인, 로그아웃 할 때 일어난다.
    // 또 어플리케이션이 초기화될 때 발생한다. 총 3개의 staterk 있다.
    authService.onAuthStateChanged((user) => {
      if (user) {
        // user를 얻어야 로그인이 된다.
        /* setIsLoggedIn(true); */
        setUserObj(user);
      } else {
        // 어떤 user도 받지 못하면 로그인할 수 없다.
        /* setIsLoggedIn(false); */
      }
      setInit(true);
    });
  }, [])
  return (
    <>
      {init ? <AppRouter /* isLoggedIn={isLoggedIn} */ isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}