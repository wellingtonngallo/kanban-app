import { Button, Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../hooks/useAuth";

export const Login = (): JSX.Element => {
  const { handleGoogleSignIn } = useAuth();

  return (
    <Flex
      p={8}
      alignItems="center"
      justifyContent="center"
      height="100%"
      flexDir="column"
      gap="1rem"
    >
      <Heading>Kanban APP</Heading>
      <Stack spacing={2} align={"center"} maxW={"md"} w={"full"}>
        <Button
          w={"full"}
          variant={"outline"}
          leftIcon={<FcGoogle />}
          onClick={handleGoogleSignIn}
        >
          <Center>
            <Text>Entrar com Google</Text>
          </Center>
        </Button>
      </Stack>
    </Flex>
  );
};
