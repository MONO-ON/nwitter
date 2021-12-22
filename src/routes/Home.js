import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
} from "@firebase/firestore";
import { dbService } from "fbase";
import { React, useEffect, useState } from "react";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const q = query(collection(dbService, "nweets"));
    const dbNweets = await getDocs(q);
    dbNweets.forEach((doc) => console.log(doc.data()));
  };
  useEffect(() => {
    getNweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(`${nweet}`);
    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createAt: serverTimestamp(),
    });
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
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
        <input type="submit" value="Nweet" />
      </form>
    </div>
  );
};
export default Home;
