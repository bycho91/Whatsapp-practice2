import Head from "next/head";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInWithGoogle = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <Container className="grid w-screen h-screen place-items-center bg-[whitesmoke]">
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer className="flex flex-col justify-center items-center bg-white shadow-2xl rounded-sm p-20 space-y-10">
        <img
          src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
          alt="whatsapp logo"
          className="w-[300px] h-[300px]"
        />
        <h1 className="font-bold text-3xl">WhatsApp v2</h1>
        <LoginButton variant="outlined" onClick={signInWithGoogle}>
          Sign in with Google
        </LoginButton>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div``;
const LoginContainer = styled.div``;
const LoginButton = styled(Button)``;
