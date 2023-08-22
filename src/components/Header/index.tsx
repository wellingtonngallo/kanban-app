import React, { type ChangeEvent } from "react";
import { Flex, Image, Input, Text, Heading } from "@chakra-ui/react";

import { useAuth } from "../../hooks/useAuth";
import { DarkModeButton } from "../DarkModeButton";
import { useSearch } from "../../hooks/useSearch";

export const Header = (): JSX.Element => {
  const { user } = useAuth();
  const { setSearchTask } = useSearch();

  const findTask = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase();
    setSearchTask(value);
  };

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      align="center"
      px="6"
      boxShadow="var(--chakra-shadows-sm)"
    >
      <Flex
        justifyContent="space-between"
        width="100%"
        gap="1rem"
        alignItems="center"
      >
        <Heading>Kanban APP</Heading>
        <Flex alignItems="center" gap="1rem">
          <Input placeholder="Buscar tarefa" width={400} onChange={findTask} />
          <Text>{user.displayName}</Text>
          <Image
            src={user?.photoUrl ?? ""}
            borderRadius="full"
            boxSize="40px"
            alt="Foto do usuário"
            fallbackSrc="https://via.placeholder.com/40"
          />
          <DarkModeButton top={0} right={2} />
        </Flex>
      </Flex>
    </Flex>
  );
};
