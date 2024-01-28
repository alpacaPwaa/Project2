import { auth } from "@/firebase/clientApp";
import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import RightContent from "./RightContent/RightContent";
import { FaLink } from "react-icons/fa6";
import MiddleContent from "./MiddleContent";
import { useRouter } from "next/router";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  const goToHome = () => {
    router.push(`/`);
  };

  return (
    <Flex
      bg="white"
      padding="0px 20px"
      height="70px"
      justifyContent={{ md: "space-between" }}
      alignItems="center"
      boxShadow="base"
      position="fixed"
      top="0"
      left="0"
      right="0"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        onClick={goToHome}
        cursor="pointer"
      >
        <Flex>
          <Icon fontSize="20pt" as={FaLink} />
        </Flex>
        <Flex display={{ base: "none", md: "unset" }} ml={3}>
          <Text fontSize="20pt">LinkBioMi</Text>
        </Flex>
      </Flex>
      <MiddleContent />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
