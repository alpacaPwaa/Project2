import AuthModal from "@/components/Modal/Auth/AuthModal";
import { Flex } from "@chakra-ui/react";
import React from "react";
import MenuWrapper from "./ProfileMenu/MenuWrapper";

type RightContentProps = {
  user: any;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        <MenuWrapper />
      </Flex>
    </>
  );
};
export default RightContent;
