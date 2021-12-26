import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import * as firestore from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      // collection이랑 비슷하다. 기본적으로 reference에서 폴더를 만들 수 있다.
      // 사진의 이름을 랜덤으로 해준다. (uuid 사용)
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );

      // getDownloadURL은 promise를 리턴하는데, promise는 "날 기다려줘"라는 의미이다.
      attachmentUrl = await getDownloadURL(attachmentRef).then();
    }
    const nweetObj = {
      text: nweet,
      // firebase에서 시간 선택할 때, 아시아 동북3으로 선택해서 한국 시간으로 저장된다.
      createAt: firestore.serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    // collection에 document(데이터)를 추가해준다.
    await firestore.addDoc(firestore.collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    // event 안에서 target 안으로 가서 파일을 받아오는 것을 의미한다.
    const {
      target: { files },
    } = event;
    // 기본적으로 이건 많은 파일을 원하는 만큼 가질 수 있다. 그런데 우리의 input은 한 개의 파일만 받으므로,
    // 모든 파일 중에 첫번째 파일만 받도록 한 것이다.(files[0])
    const theFile = files[0];
    // 위의 파일을 가지고 reader를 만든 다음,
    const reader = new FileReader();
    // 그리고 우리는 reader에 eventlistner를 추가한다.
    // 파일 로딩이 끝날 때, 또는 읽는 것이 끝나면, finishedEvent를 갖게 되는 것이다.
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    // readAsDataURL을 사용해서 파일을 읽는다.
    // 최종적으로, 데이터를 얻게된다.
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
