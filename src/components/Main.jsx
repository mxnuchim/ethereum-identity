import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Tag,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function Main({ account, logIn, connect, getRecord, profile, loaded }) {
  let history = useHistory();
  const toast = useToast();
  async function handleFunction() {
    toast({
      title: `Please Wait!`,
      description: "Fetching your profile..",
      position: "top-right",
      status: "info",
      duration: 4000,
      variant: "left-accent",
      isClosable: true,
    });
    await connect();
    console.log(loaded, profile);
    !loaded &&
      toast({
        title: `Network Error`,
        description: "Unable to fetch your profile, Try again!",
        position: "top-right",
        status: "error",
        duration: 4000,
        variant: "left-accent",
        isClosable: true,
      });
    profile && loaded && history.push("/profile");
  }
  return (
    <>
      <Flex m={8} justifyContent="flex-end">
        <Tag fontFamily="Inter">{account}</Tag>
      </Flex>
      <Box mt="9rem" align="center" maxH="100vh" w="full">
        <Text
          position="relative"
          color="#000"
          fontWeight="400"
          fontFamily="Epilogue"
          fontSize={["5vw", "3vw", "1.7vw"]}
          boxShadow={"rgba(149, 157, 165, 0.1) 0px 8px 24px"}
        >
          A profile 100% owned by you
        </Text>
        <Heading
          color="#000"
          lineHeight="8rem"
          fontWeight="600"
          fontFamily="Epilogue"
          fontSize="13vw"
        >
          Be your self
        </Heading>

        {account === "0x00000" ? (
          <Button
            fontFamily="Inter"
            mt="4rem"
            boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
            color="#000"
            onClick={logIn}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            fontFamily="Inter"
            mt="4rem"
            boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
            color="#000"
            onClick={handleFunction}
          >
            Your Profile
          </Button>
        )}
      </Box>
    </>
  );
}

export default Main;
