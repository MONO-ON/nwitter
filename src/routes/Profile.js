import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ refreshUser, userObj }) => {
  const [newDisplayName, setnewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setnewDisplayName(value);
  };
  // db 데이터를 필터링 하는 과정이다.
  const getMyNweets = async () => {
    const nweets = await getDocs(
      query(
        collection(dbService, "nweets"),
        orderBy("createdAt"),
        where("creatorId", "==", userObj.uid)
      )
    );
    nweets.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
