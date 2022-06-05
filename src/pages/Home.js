import React, { useEffect, useState } from "react";
import { collection, where, query, onSnapshot, addDoc, Timestamp, orderBy, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

export default function Home(){
    const [ users, setUsers ] = useState([]);
    const [ chat, setChat ] = useState("");
    const [ text, setText ] = useState("");
    const [ img, setImage ] = useState();
    const [ messages, setMessages ] = useState("");

    const user1 = auth.currentUser.uid;

    useEffect(() => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]))

        const unsub = onSnapshot(q, snapshot => {
            let users = [];
            snapshot.forEach(doc => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub;
    }, []);

    const selectUser = async (user) => {
        setChat(user);

        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        const messagesRef = collection(db, "messages", id, "chat");

        const q = query(messagesRef, orderBy("createdAt", "asc"));

        onSnapshot(q, querySnapshot => {
            let messages = [];

            querySnapshot.forEach(doc => {
                messages.push(doc.data());
            });
            setMessages(messages);
        });

        // get last message between logged in user and selected user
        const docSnap = await getDoc(doc(db, "lastMsg", id));
        //if last message exists and message is from selected user 
        if(docSnap.data() && docSnap.data().from !== user1){
            //update last message doc, set unread to false
            await updateDoc(doc(db, "lastMsg", id), {
                unread: false,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user2 = chat.uid;
        
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        let url;

        if(img){
            const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`);

            const snap = await uploadBytes(imgRef, img);
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
            url = dlUrl;
        }

        await addDoc(collection(db, "messages", id, "chat"), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
        });

        await setDoc(doc(db, "lastMsg", id), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
            unread: true,
        })
        setText("");
    }

    return (
        <div className="home-container">
            <div className="users-container">
                {users.map(user => <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat}/>)}
            </div>
            <div className="messages-container">
                {chat ? (
                    <>
                        <div className="messages-user">
                            <h3>{chat.name}</h3>
                        </div>
                        <div className="messages">
                            { messages.length ? (messages.map((msg, i) => <Message key={i} msg={msg} user1={user1}/>)) : null}
                        </div>
                        <MessageForm handleSubmit={handleSubmit} text={text} setText={setText} setImg={setImage}/>
                    </>
                    ) : <h3 className="no-conv">Select a user to start conversation</h3>}
            </div>
        </div>
    )
}