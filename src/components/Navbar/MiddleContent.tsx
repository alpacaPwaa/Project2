import { Flex, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineMessage, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiDonateHeart } from "react-icons/bi";
import { FaPenNib } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoLinkOutline } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import { PiLinkSimpleBold, PiPenNib } from "react-icons/pi";
import { TiHeartOutline } from "react-icons/ti";

type MiddleContentProps = {};

const MiddleContent: React.FC<MiddleContentProps> = () => {
  const router = useRouter();

  const goToSearch = () => {
    router.push(`/`);
  };

  const goToAbout = () => {
    router.push(`/about`);
  };

  const goToBlog = () => {
    router.push(`/blog`);
  };

  const goToContact = () => {
    router.push(`/contact`);
  };

  const goToLink = () => {
    router.push(`/links`);
  };

  const goToSupport = () => {
    router.push(`/support`);
  };

  return (
    <Flex width="100%" justifyContent="center" position="relative">
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        bottom="-9"
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{
            cursor: "pointer",
            color: "blue.500",
          }}
          onClick={goToSearch}
          color={router.pathname === "/" ? "blue.500" : ""}
          borderBottom={router.pathname === "/" ? "2px" : "none"}
          pb={2}
          px={12}
        >
          <Icon as={MdOutlineSearch} fontSize={28} />
          <Text fontSize="10pt">Search</Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{
            cursor: "pointer",
            color: "blue.500",
          }}
          onClick={goToAbout}
          color={router.pathname === "/about" ? "blue.500" : ""}
          borderBottom={router.pathname === "/about" ? "2px" : "none"}
          pb={2}
          px={12}
        >
          <Icon as={AiOutlineQuestionCircle} fontSize={28} />
          <Text fontSize="10pt">About</Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{
            cursor: "pointer",
            color: "blue.500",
          }}
          onClick={goToBlog}
          color={router.pathname === "/blog" ? "blue.500" : ""}
          borderBottom={router.pathname === "/blog" ? "2px" : "none"}
          pb={2}
          px={12}
        >
          <Icon as={PiPenNib} fontSize={28} />
          <Text fontSize="10pt">Blog</Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{
            cursor: "pointer",
            color: "blue.500",
          }}
          onClick={goToContact}
          color={router.pathname === "/contact" ? "blue.500" : "black"}
          borderBottom={router.pathname === "/contact" ? "2px" : "none"}
          pb={2}
          px={12}
        >
          <Icon as={AiOutlineMessage} fontSize={28} />
          <Text fontSize="10pt">Contact</Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{
            cursor: "pointer",
            color: "blue.500",
          }}
          onClick={goToLink}
          color={router.pathname === "/links" ? "blue.500" : ""}
          borderBottom={router.pathname === "/links" ? "2px" : "none"}
          pb={2}
          px={12}
        >
          <Icon as={IoLinkOutline} fontSize={28} />
          <Text fontSize="10pt">Links</Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{
            cursor: "pointer",
            color: "blue.500",
          }}
          onClick={goToSupport}
          color={router.pathname === "/support" ? "blue.500" : ""}
          borderBottom={router.pathname === "/support" ? "2px" : "none"}
          pb={2}
          px={12}
        >
          <Icon as={TiHeartOutline} fontSize={28} />
          <Text fontSize="10pt">Support</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default MiddleContent;
