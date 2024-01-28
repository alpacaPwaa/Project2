import { Flex, Icon, MenuDivider, MenuItem } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { auth } from "../../../../firebase/clientApp";

type UserListProps = {};

const UserList: React.FC<UserListProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
  };

  const goToProfile = () => {
    router.push(`/${user?.displayName}`); // Use router.push to navigate to the profile page
  };

  return (
    <>
      <MenuItem fontSize="10pt" onClick={goToProfile}>
        <Flex alignItems="center">
          <Icon fontSize={22} mr="8px" ml="7px" as={CgProfile} />
          Profile
        </Flex>
      </MenuItem>
      <MenuDivider />
      <MenuItem fontSize="10pt" onClick={logout}>
        <Flex alignItems="center">
          <Icon fontSize={22} mr="8px" ml="7px" as={RiLogoutBoxRLine} />
          Log Out
        </Flex>
      </MenuItem>
    </>
  );
};
export default UserList;
