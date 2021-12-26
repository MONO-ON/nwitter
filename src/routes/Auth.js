import React from "react";
import * as auth from "@firebase/auth";
import { authService } from "fbase";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  // value값을 가져와서 쓰기 위해, State를 사용한다.
  // useState는 Hook이다. 훅을 호출해 함수 컴포넌트 안에 state를 추가한다.
  // 이 state는 컴포넌트가 다시 랜더링 되어도 그대로 유지된다.

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new auth.GithubAuthProvider();
    }
    const data = await auth.signInWithPopup(authService, provider);
    console.log(data);
  };
  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
