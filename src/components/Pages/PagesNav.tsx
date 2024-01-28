import { PageSnippet, userPageState } from "@/atoms/pageAtoms";
import { auth, firestore } from "@/firebase/clientApp";
import { Flex, Text } from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";

type PagesNavProps = { userProfile: string };

const PagesNav: React.FC<PagesNavProps> = ({ userProfile }) => {
  const [userData, setUserData] = useState<any>(null);
  const mySnippets = useRecoilValue(userPageState).mySnippets;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userPageStateValue, setUserPageStateValue] =
    useRecoilState(userPageState);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userProfile) {
          console.error("User profile is undefined or null");
          return;
        }

        const userDocRef = collection(firestore, "users");
        const userQuery = query(
          userDocRef,
          where("displayName", "==", userProfile)
        );
        const userDocSnapshot = await getDocs(userQuery);

        if (!userDocSnapshot.empty) {
          const userData = userDocSnapshot.docs[0].data();
          setUserData(userData);
        } else {
          console.error(
            "User document does not exist for displayName:",
            userProfile
          );
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userProfile]);

  const getMySnippets = async () => {
    const snippetQuery = query(
      collection(firestore, `usersPages/${userProfile}/pageSnippets`)
    );

    const snippetDocs = await getDocs(snippetQuery);
    return snippetDocs.docs.map((doc) => ({ ...doc.data() }));
  };

  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippets = await getMySnippets();
      setUserPageStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as PageSnippet[],
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("Error getting user snippets", error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSnippets();
    //eslint-disable-next-line
  }, [userPageStateValue]);

  return (
    <Flex width="100%" justifyContent="center" mt={2}>
      <Flex width="60%" justifyContent="flex-start" alignItems="center">
        <Flex
          p={2}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          _hover={{ color: "blue.500" }}
          onClick={() => router.push(`/${userProfile}`)}
        >
          <Text wordBreak="break-word" fontSize="14px">
            My Page
          </Text>
        </Flex>
        {mySnippets
          .filter((item) => item.creatorName === userProfile)
          .map((snippet, index) => (
            <Flex
              key={index}
              borderRadius="md"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              p={2}
              ml={3}
              cursor="pointer"
              _hover={{ color: "blue.500" }}
              onClick={() =>
                router.push(`/${user?.displayName}/${snippet.pageId}`)
              }
            >
              <Flex align="center">
                <Text wordBreak="break-word" fontSize="14px">
                  {snippet.pageId}
                </Text>
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};
export default PagesNav;
