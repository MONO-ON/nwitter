import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
      // 스토리지에 저장된 사진 파일의 url을 이용해서 트위터뿐만아니라, 사진도 삭제한다.
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));
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
    <div className="nweet">
      {/* 수정하고 있으면, form을 보여준다. */}
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
