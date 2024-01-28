import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";

type SearchInputProps = {};

const SearchInput: React.FC<SearchInputProps> = () => {
  return (
    <Flex flexGrow={1} m={2} align="center">
      <InputGroup m="auto">
        <InputLeftElement
          position="absolute"
          top="50%"
          left="0.5rem"
          transform="translateY(-50%)"
          color="gray.400"
        >
          <SearchIcon />
        </InputLeftElement>
        <Input
          isDisabled
          pl="2.5rem"
          placeholder="Search Unavailable"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          height="40px"
          bg="gray.50"
          borderRadius="full"
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
