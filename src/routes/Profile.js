import { authService } from "fbase";
import React from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const onLogOutClick = () => {
    authService.signOut();
  };
  return (
    <>
      <button onClick={onLogOutClick} ><Link to="/">Log Out</Link></button>
    </>
  );
};
