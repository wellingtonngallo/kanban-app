import { Button, Center, Stack, Text } from "@chakra-ui/react";
import React from "react";

import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../hooks/useAuth";

export const Login = (): JSX.Element => {
  const { handleGoogleSignIn } = useAuth();

  return (
    <Center p={8}>
      <Stack spacing={2} align={"center"} maxW={"md"} w={"full"}>
        <Button
          w={"full"}
          variant={"outline"}
          leftIcon={<FcGoogle />}
          onClick={handleGoogleSignIn}>
          <Center>
            <Text>Sign in with Google</Text>
          </Center>
        </Button>
      </Stack>
    </Center>
  );
};
