import * as firestore from "@firebase/firestore";
import { getStorage, ref } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import { React, useEffect, useState } from "react";

const Home = ({ userObj }) => {
  // form을 위한 State이다. (onSubmit함수에서 form을 submit할 때 사용함.)
  // 어떤 collection에 내 데이터를 저장할 지 지정해주는 것은 중요하다. 때론 많은 collection을 가질 수도 있기 때문이다.
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();

  useEffect(() => {
    // onSnapshot은 데이터베이스에 무슨일이 있을 때, 알림을 받는다.
    // snapshot으로 지켜보고 있기 때문에, 무언가를 지우거나, 업데이트를 하든, 뭘 하든 실행이 되는 것이다.
    firestore.onSnapshot(
      firestore.collection(dbService, "nweets"),
      (snapshot) => {
        // forEach를 쓰는 방법이 있고, 이 방법이 있는데, 이 방법이 재랜더링이 일어나지 않아서 한번만 발생한다. 즉, 더 빠르게 실행된다.
        // query가 아닌 snapshot을 사용하기 때문에, 실시간으로 보여줄 수 있다.
        // 새로운 스냅샷을 받을 때, 아래와 같은 배열을 만든다.
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // 그 다음, state에 배열을 집어넣는다.
        setNweets(nweetArray);
      }
    );
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    await fileRef.putSt

    // collection에 document(데이터)를 추가해준다.
    /* await firestore.addDoc(firestore.collection(dbService, "nweets"), {
      text: nweet,
      // 아시아 동북3으로 선택해서 한국 시간으로 저장된다.
      createAt: firestore.serverTimestamp(),
      creatorId: userObj.uid,
    }); */
    setNweet("");
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
  const onClearAttachment = () => setAttachment(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          // 일반적으로 데이터의 id를 키로 사용한다.
          // 화면에 작성한 nweet들을 띄워준다.
          // Nweet 컴포넌트를 만든다. 두 개의 prop(속성)을 가진다. nweetObj와 isOwner
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
