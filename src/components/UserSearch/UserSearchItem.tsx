import { firestore } from "@/firebase/clientApp";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  InputGroup,
  InputRightElement,
  Button,
  Input,
  Text,
  Icon,
  Stack,
  Box,
  AspectRatio,
  Image,
  InputLeftElement,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaUserAlt, FaUserCircle } from "react-icons/fa";
import { TbUserSearch } from "react-icons/tb";

type UserSearchItemProps = {};

const UserSearchItem: React.FC<UserSearchItemProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [errorSearch, setErrorSearch] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const router = useRouter();

  const fetchUserList = async () => {
    setLoadMoreLoading(true);
    const list: User[] = [];

    try {
      let querySnapshot;
      const displayNameFilter = searchQuery.toLowerCase(); // Convert search query to lowercase

      querySnapshot = await getDocs(
        query(
          collection(firestore, "users"),
          orderBy("displayName"),
          limit(10 * currentPage)
        )
      );

      querySnapshot.forEach((doc) => {
        const user = doc.data() as User;

        // Null check for user.displayName
        if (user.displayName) {
          const userDisplayName = user.displayName.toLowerCase(); // Convert display name to lowercase
          if (userDisplayName.includes(displayNameFilter)) {
            // Filter results based on display name
            list.push(user);
          }
        }
      });

      if (list.length === 0) {
        setErrorSearch("No users match the display name."); // Set the error message
        setUserList([]); // Clear the user list
      } else {
        setErrorSearch(""); // Clear the error message
        setUserList(list);
      }
    } catch (error: any) {
      console.log("error", error);
    }

    setSearchLoading(false);
    setLoadMoreLoading(false);
  };

  const onSearchUser = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchQuery) {
      if (event.key === "Enter") {
        setSearchLoading(true);
        setCurrentPage(1); // Reset page to 1 when searching
        fetchUserList();
      }
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      setSearchLoading(true);
      setCurrentPage(1); // Reset page to 1 when searching
      fetchUserList();
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <Flex mb={6} mt="130px" flexDirection="column" width="30%">
        <InputGroup>
          <InputLeftElement
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
          >
            <Button
              size="sm"
              variant="ghost"
              color="gray.500"
              position="relative"
              onClick={handleSearch}
              isLoading={searchLoading}
            >
              <SearchIcon fontSize="md" position="absolute" />
            </Button>
          </InputLeftElement>
          <Input
            pl="2.5rem"
            variant="flushed"
            placeholder="Enter Username"
            fontSize="14px"
            _placeholder={{ color: "gray.500" }}
            height="40px"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onSearchUser}
          />
        </InputGroup>
        {errorSearch && (
          <Text
            color="red.500"
            fontWeight={600}
            fontSize="10pt"
            textAlign="center"
            p={2}
          >
            {errorSearch}
          </Text>
        )}
      </Flex>

      <Stack spacing={4} width="30%">
        {userList.map((user) => {
          return (
            <Flex
              key={user.uid}
              cursor="pointer"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Link href={`/${user.displayName}`}>
                  <Flex alignItems="center">
                    {user?.photoURL ? (
                      <Box
                        borderRadius="full"
                        overflow="hidden"
                        boxSize="36px"
                        mr={3}
                      >
                        <AspectRatio ratio={1 / 1}>
                          <Image
                            src={user.photoURL}
                            alt="User Photo"
                            objectFit="cover"
                            boxSize="100%"
                            borderRadius="full"
                          />
                        </AspectRatio>
                      </Box>
                    ) : (
                      <Icon
                        as={FaUserCircle}
                        fontSize={36}
                        color="gray.300"
                        mr={3}
                      />
                    )}
                    {user?.displayName ? (
                      <Text fontSize="11pt">{user.displayName}</Text>
                    ) : (
                      <Text fontSize="11pt">{user?.email?.split("@")[0]}</Text>
                    )}
                  </Flex>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/${user.displayName}`)}
                >
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon fontSize={14} as={FaUserAlt} />
                    <Text pl={2} fontSize="10pt">
                      Visit
                    </Text>
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  );
};
export default UserSearchItem;
