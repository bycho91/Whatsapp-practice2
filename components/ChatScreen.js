import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Avatar, Typography, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "@/components/Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState, useRef } from "react";
import firebase from "firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container className="w-full">
      <Header className="bg-white z-50 flex p-[11px] items-center border-b-[1px] border-[whitesmoke]">
        {recipient ? (
          <UserAvatar src={recipient?.photoURL} />
        ) : (
          <UserAvatar src={recipientEmail[0]} />
        )}

        <HeaderInfo className="ml-[15px] flex-1">
          <h3 className="font-bold">{recipientEmail}</h3>
          <p className="text-[15px] text-gray-400">
            {recipientSnapshot ? (
              <p>
                Last active:{" "}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  "Unavailable"
                )}
              </p>
            ) : (
              <p>Loading last active</p>
            )}
          </p>
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer className="p-[30px] bg-[#e2ece9] min-h-[90%]">
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input
          className="focus:bg-gray-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  top: 0;
`;

const UserAvatar = styled(Avatar)``;
const HeaderInfo = styled.div``;
const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
const MessageContainer = styled.div``;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
