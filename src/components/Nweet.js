import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  // true, false를 위한 것. editing 모드인지 아닌지 알려주는 것이다.(=nweet을 수정하고 있는지 아닌지를 뜻한다.)
  const [editing, setEditing] = useState(false);
  // input에 입력된 text를 업데이트 해주는 것이다.
  // input의 값을 수정하는 것이다.
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  // nweet을 지우는 기능.
  const onDeleteClick = async () => {
      // 먼저 유저를 확인하고, nweet을 지우길 원하는지 확인한다.
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    // 확인을 누르면, ok는 true
    if (ok) {
      await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <div>
      {/* 수정하고 있으면, form을 보여준다. */}
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  required
                  onChange={onChange}
                />
                {/* 그리고 nweet을 업데이트할 수 있다. */}
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
        {/* 주인인 사람만 이 form을 볼 수 있게 한다.*/}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
