import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

const Chat = ({ id, users }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  return (
    <ChatContainer
      className="flex p-4 w-full items-center space-x-3 hover:bg-[whitesmoke] hover:cursor-pointer"
      onClick={enterChat}
    >
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
