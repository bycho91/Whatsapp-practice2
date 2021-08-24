import styled from "styled-components";
import { Circle } from "better-react-spinkit";

const Loading = () => {
  return (
    <LoadingContainer className="grid place-content-center h-screen w-full">
      <div className="flex flex-col items-center">
        <Circle color="#3cbc28" size={100} />
      </div>
    </LoadingContainer>
  );
};

export default Loading;

const LoadingContainer = styled.div``;
