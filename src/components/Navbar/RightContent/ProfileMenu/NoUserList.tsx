import React from "react";
import { MenuItem, Flex, Icon } from "@chakra-ui/react";
import { MdOutlineLogin } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AuthModalState } from "@/atoms/authModalAtoms";

type NoUserListProps = {
  setModalState: (value: AuthModalState) => void;
};

const NoUserList: React.FC<NoUserListProps> = ({ setModalState }) => {
  return (
    <>
      <MenuItem
        fontSize="10pt"
        _hover={{ bg: "blue.500", color: "white" }}
        onClick={() => setModalState({ open: true, view: "login" })}
      >
        <Flex alignItems="center" width="220px">
          <Icon fontSize={22} mr="8px" ml="8px" as={RiLogoutBoxRLine} />
          Log In / Sign Up
        </Flex>
      </MenuItem>
    </>
  );
};
export default NoUserList;
