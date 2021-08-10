import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import Chat from "@/components/Chat";

const Sidebar = ({ photo }) => {
  const [user] = useAuthState(auth);

  //THIS CREATES A REAL TIME LISTENER TO ALL THE CHATS WITH LOGIN EMAIL
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Who would you like to chat with?");

    if (!input) return null;

    //Validates whether Email is valid, Chat already exists, and input is not user's email
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      //ADD CHAT INTO THE DATABASE (CHATS COLLECTION)
      db.collection("chats").add({
        users: [user.email, input],
      });
    } else {
      alert("Chat already exists or email is invalid");
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  // the double '!!' converts the statement into one that returns true if truthy and false if falsey

  return (
    <SidebarContainer className="flex flex-col w-[20%] max-w-[400px] min-w-[300px]">
      <Header className="flex justify-between items-center sticky z-10 bg-white top-0 border-b-[1px] border-[whitesmoke] mb-2">
        <IconButton>
          <UserAvatar onClick={() => auth.signOut()} src={photo} />
        </IconButton>
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchContainer className="flex items-center p-[15px] rounded-md">
        <SearchIcon />
        <SearchInput
          className="outline-none ml-2 flex-1"
          placeholder="Search in chats"
        />
      </SearchContainer>

      <NewChatButton onClick={createChat}>Start a new chat</NewChatButton>

      {/* LIST OF CHATS */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div``;
const Header = styled.div``;
const UserAvatar = styled(Avatar)`
  &&& {
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  }
`;
const IconsContainer = styled.div``;
const SearchContainer = styled.div``;
const SearchInput = styled.input``;
const NewChatButton = styled(Button)`
  &&& {
    border-bottom: 1px solid whitesmoke;
    border-top: 1px solid whitesmoke;
  }
`;
