import styled from "styled-components";
import { Circle } from "better-react-spinkit";

const Loading = () => {
  return (
    <LoadingContainer className="grid place-content-center h-screen w-full">
      <div className="flex flex-col items-center">
        <img
          src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
          alt="whatsapp logo"
          className="h-[300px] w-[300px] mb-5"
        />
        <Circle color="#3cbc28" size={60} />
      </div>
    </LoadingContainer>
  );
};

export default Loading;

const LoadingContainer = styled.div``;
