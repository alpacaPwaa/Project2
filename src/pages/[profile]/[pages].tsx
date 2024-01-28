import { UserPage, userPageState } from "@/atoms/pageAtoms";
import PagesNav from "@/components/Pages/PagesNav";
import ProfilePage from "@/components/Profile/ProfileItem";
import { firestore } from "@/firebase/clientApp";
import { Flex, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

type userPagesProps = { pagesData: UserPage };

const userPages: React.FC<userPagesProps> = ({ pagesData }) => {
  const [userPageStateValue, setUserPageStateValue] =
    useRecoilState(userPageState);
  const router = useRouter();
  const userPages = router.query.pages;
  const userProfile = router.query.profile;

  const getPagesData = async (pageId: string) => {
    console.log("GETTING PAGE DATA");

    try {
      const pagesDocRef = doc(firestore, "pages", pageId as string);
      const pagesDoc = await getDoc(pagesDocRef);

      if (pagesDoc.exists()) {
        setUserPageStateValue((prev) => ({
          ...prev,
          currentPages: {
            id: pagesDoc.id,
            ...pagesDoc.data(),
          } as UserPage,
        }));
      } else {
        console.log("Page not found in the database");
      }
    } catch (error: any) {
      console.error("getPageData error", error.message);
    }
  };

  useEffect(() => {
    if (userPages) {
      const pageId = userPages.toString();
      getPagesData(pageId);
    }
  }, [userPages]);

  return (
    <>
      <ProfilePage userProfile={userProfile as string} />
      <PagesNav userProfile={userProfile as string} />

      <Flex mt="100px" width="100%" justifyContent="center" alignItems="center">
        <Flex alignItems="center" justifyContent="flex-start">
          <Text>{userPageStateValue.currentPages?.pageName}</Text>
        </Flex>
      </Flex>
    </>
  );
};
export default userPages;
