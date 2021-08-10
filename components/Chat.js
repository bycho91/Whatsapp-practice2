import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const Chat = ({ id, users }) => {
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  return (
    <ChatContainer className="flex p-4 w-full items-center space-x-3 hover:bg-[whitesmoke] hover:cursor-pointer">
      {recipient ? (
        <UserAvatar src={recipient.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p className="font-bold">{recipientEmail}</p>
    </ChatContainer>
  );
};

export default Chat;

const ChatContainer = styled.div``;
const UserAvatar = styled(Avatar)``;
