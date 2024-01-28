import PagesNav from "@/components/Pages/PagesNav";
import ProfilePage from "@/components/Profile/ProfileItem";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type profileProps = {};

const index: React.FC<profileProps> = () => {
  const router = useRouter();
  const userProfile = router.query.profile;

  useEffect(() => {}, [userProfile]);

  return (
    <>
      <ProfilePage userProfile={userProfile as string} />
      <PagesNav userProfile={userProfile as string} />
    </>
  );
};
export default index;
