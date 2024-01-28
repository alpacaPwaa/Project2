import { userPageState } from "@/atoms/pageAtoms";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaCheck,
  FaFacebookSquare,
  FaRedditSquare,
  FaTumblrSquare,
  FaTwitterSquare,
  FaUserCircle,
  FaWhatsappSquare,
} from "react-icons/fa";
import { GoPaste } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import {
  FacebookShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useSetRecoilState } from "recoil";
import { auth, firestore, storage } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

type ProfilePageProps = {
  userProfile: string;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile }) => {
  const [user] = useAuthState(auth);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const setSnippetState = useSetRecoilState(userPageState);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [charsRemaining, setCharsRemaining] = useState(50);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const isNameEmpty = name.trim() === "";
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [updatedPhotoURL, setUpdatedPhotoURL] = useState<string | undefined>(
    ""
  );
  const [updatedDisplayName, setUpdatedDisplayName] = useState<
    string | undefined
  >("");
  const [createdAt, setCreatedAt] = useState<number | undefined>();
  const [pageCharsRemaining, setPageCharsRemaining] = useState(21);
  const [inputFocused, setInputFocused] = useState(false);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const link = `https://www.tumndig.com/${userProfile}`;
  const [md] = useMediaQuery("(min-width: 768px)");
  const [copied, setCopied] = useState(false);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // Check if userProfile is defined and not null
  //       if (!userProfile) {
  //         console.error("User profile is undefined or null");
  //         return;
  //       }

  //       // Log the userProfile and its type for debugging
  //       console.log("User profile:", userProfile);
  //       console.log("User profile type:", typeof userProfile);

  //       const userDocRef = doc(collection(firestore, "users"), userProfile);
  //       const userDocSnapshot = await getDoc(userDocRef);

  //       if (userDocSnapshot.exists()) {
  //         const userData = userDocSnapshot.data();

  //         // Log the retrieved userData for debugging
  //         console.log("Userdata");
  //         console.log(userData);

  //         // Log the user's email
  //         console.log("User email:", user?.email);

  //         setUpdatedDisplayName(userData.displayName);
  //         setUpdatedPhotoURL(userData.photoURL);
  //         setCreatedAt(userData.createdAt);
  //       } else {
  //         console.error(
  //           "User document does not exist for profile:",
  //           userProfile
  //         );
  //       }
  //     } catch (error) {
  //       console.log("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [userProfile]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is defined and not null
        if (!userProfile) {
          console.error("User is undefined or null");
          return;
        }

        // Log the user and its type for debugging
        console.log("User:", userProfile);
        console.log("User type:", typeof userProfile);

        // Log the user's email
        console.log("User email:", user?.email);

        // Fetch user data using email instead of uid
        const userDocRef = collection(firestore, "users");
        const userQuery = query(
          userDocRef,
          where("displayName", "==", userProfile)
        );
        const userDocSnapshot = await getDocs(userQuery);

        if (!userDocSnapshot.empty) {
          const userData = userDocSnapshot.docs[0].data();

          // Log the retrieved userData for debugging
          console.log("Userdata");
          console.log(userData);

          setUpdatedDisplayName(userData.displayName);
          setUpdatedPhotoURL(userData.photoURL);
          setCreatedAt(userData.createdAt);
        } else {
          console.error("User document does not exist for email:", userProfile);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userProfile]);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const handleSaveChanges = async () => {
    try {
      setSaveLoading(true);
      if (selectedFile) {
        // Save profile image changes

        const imageRef = ref(storage, `users/${user?.uid}/profileImage`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        const userCollectionRef = collection(firestore, "users");
        const userDocRef = doc(userCollectionRef, user?.uid);
        await updateDoc(userDocRef, {
          photoURL: downloadURL,
        });

        setUpdatedPhotoURL(downloadURL);
        if (user) {
          await updateProfile(user, {
            photoURL: downloadURL,
          });
        }
      }

      if (updatedDisplayName && updatedDisplayName != userProfile) {
        // Check if the desired display name is already taken
        const displayNameQuery = query(
          collection(firestore, "users"),
          where("displayName", "==", updatedDisplayName)
        );
        const displayNameSnapshot = await getDocs(displayNameQuery);

        if (!displayNameSnapshot.empty) {
          // Display name is already taken, show an error message
          setDisplayNameError(
            "Display name is already taken. Choose another one."
          );
          return;
        } else {
          // Reset the error message if the display name is available
          setDisplayNameError(null);
        }

        // Proceed with the update if the display name is available

        const userCollectionRef = collection(firestore, "users");
        const userDocRef = doc(userCollectionRef, user?.uid);
        await updateDoc(userDocRef, {
          displayName: updatedDisplayName,
        });

        if (user) {
          await updateProfile(user, {
            displayName: updatedDisplayName,
          });
        }
      }

      console.log("Changes saved successfully");
      setSaveLoading(false);
    } catch (error) {
      console.log("Error saving changes:", error);
    }
  };

  const handleCreateCommunity = async () => {
    if (nameError) setNameError("");
    const format = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(name) || name.length < 3) {
      return setNameError(
        "Community names must be between 3–50 characters, and can only contain letters, numbers, or underscores."
      );
    }

    setLoading(true);
    try {
      // Create community document and communitySnippet subcollection document on user
      const communityDocRef = doc(firestore, "pages", name);
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`Sorry, /r${name} is taken. Try another.`);
        }

        transaction.set(communityDocRef, {
          pageName: name,
          creatorId: user?.uid,
          creatorName: user?.email!.split("@")[0],
        });

        transaction.set(
          doc(firestore, `usersPages/${userProfile}/pageSnippets`, name),
          {
            pageId: name,
            creatorName: user?.displayName,
            userUid: user?.uid,
          }
        );
      });
    } catch (error: any) {
      console.log("Transaction error", error);
      setNameError(error.message);
    }
    setSnippetState((prev) => ({
      ...prev,
      mySnippets: [],
    }));
    closePageModal();
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 50) return;
    setName(event.target.value);
    setCharsRemaining(50 - event.target.value.length);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setUpdatedDisplayName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const handleCopyClick = () => {
    // Show "Copied!" message for a short duration
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = () => {
    if (user && userProfile && userProfile === user.displayName) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const openPageModal = () => {
    setIsPageModalOpen(true);
  };

  const closePageModal = () => {
    setIsPageModalOpen(false);
  };

  return (
    <Flex width="100%" mt="80px" cursor="pointer" justifyContent="center">
      <Flex
        justifyContent="space-around"
        width="60%"
        p={3}
        borderBottom="1px solid"
        borderColor="gray.300"
        borderRadius={4}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="center">
          {updatedPhotoURL ? (
            <Image
              borderRadius="full"
              boxSize="110px"
              src={updatedPhotoURL}
              alt="Dan Abramov"
              position="relative"
              border="4px solid white"
              objectFit="cover"
              onClick={openModal}
            />
          ) : (
            <Icon
              as={FaUserCircle}
              bg="white"
              borderRadius="full"
              fontSize="100px"
              color="gray.300"
              mr={3}
            />
          )}

          <Stack p={2} flexDirection="column">
            <Flex>
              <Text fontSize="20pt" maxWidth="100%" wordBreak="break-word">
                {updatedDisplayName}
              </Text>
            </Flex>
          </Stack>
        </Flex>

        <Flex alignItems="self-end">
          {userProfile === user?.displayName && (
            <>
              <Button
                alignItems="center"
                variant="outline"
                position="relative"
                borderRadius="md"
                size="md"
                onClick={openModal}
              >
                <Icon as={MdEdit} fontSize="14pt" />
                <Text fontSize="10pt" pl={2}>
                  Edit Profile
                </Text>
              </Button>
              <Button
                alignItems="center"
                position="relative"
                borderRadius="md"
                size="md"
                onClick={openPageModal}
                ml={2}
              >
                <Icon as={AddIcon} fontSize="12pt" />
                <Text fontSize="10pt" pl={2}>
                  Add Page
                </Text>
              </Button>
            </>
          )}

          <Button
            alignItems="center"
            position="relative"
            borderRadius="md"
            size="md"
            ml={2}
            onClick={openShareModal}
          >
            <Icon as={RiShareForwardLine} fontSize="16pt" />
          </Button>

          <input
            id="file-upload-modal"
            hidden
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            ref={selectFileRef}
            onChange={onSelectImage}
          />
        </Flex>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={16}>
            <Text fontSize="13pt" fontWeight={400}>
              Edit Profile
            </Text>
          </ModalHeader>
          <ModalCloseButton _focus={{ border: "none" }} />
          <Box
            px={2}
            maxHeight="550px"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "0.4em",
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
              },
            }}
          >
            <Divider />
            <ModalBody px={2}>
              <Stack spacing={1} mt={3} mb={3}>
                <Text fontSize="13pt">Username</Text>
                <Text fontSize="10pt" color="gray.500">
                  Set a username here.
                </Text>
                <Input
                  value={updatedDisplayName}
                  onChange={handleUserNameChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  fontSize="11pt"
                  _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid black",
                  }}
                />
                {inputFocused && (
                  <Text
                    fontSize="10pt"
                    color={charsRemaining === 0 ? "red" : "gray.500"}
                    pt={2}
                  >
                    {charsRemaining} Characters remaining
                  </Text>
                )}
                {displayNameError && (
                  <Text color="red" fontSize="10pt" mt={2}>
                    {displayNameError}
                  </Text>
                )}

                <Flex
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  pt={4}
                >
                  <Text fontSize="13pt">Profile</Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    color="blue.500"
                    fontSize="10pt"
                    onClick={() => selectFileRef.current?.click()}
                  >
                    EDIT
                  </Button>
                </Flex>
                <Text fontSize="10pt" color="gray.500">
                  It&apos;s recommended to use JPEG or PNG image.
                </Text>
                <Box
                  flexDirection="column"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    borderRadius="md"
                    bg="gray.100"
                    w="100%"
                    h="180px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mt={3}
                    mb={3}
                  >
                    {selectedFile ? (
                      <Image
                        borderRadius="full"
                        boxSize="160px"
                        src={selectedFile}
                        alt="Selected Image"
                        position="relative"
                        color="blue.500"
                        objectFit="cover"
                      />
                    ) : updatedPhotoURL ? (
                      <Image
                        borderRadius="full"
                        boxSize="160px"
                        src={updatedPhotoURL}
                        alt="Dan Abramov"
                        position="relative"
                        color="blue.500"
                        objectFit="cover"
                      />
                    ) : (
                      <Icon
                        as={FaUserCircle}
                        fontSize="160px"
                        color="gray.300"
                      />
                    )}
                  </Box>
                </Box>
              </Stack>
              <Flex justifyContent="center" alignItems="center">
                <input
                  id="file-upload-modal"
                  hidden
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  ref={selectFileRef}
                  onChange={onSelectImage}
                />
              </Flex>
            </ModalBody>
            <Divider />
          </Box>
          <ModalFooter width="100%">
            <Flex width="40%">
              <Button
                variant="outline"
                size="sm"
                onClick={closeModal}
                width="48%"
                borderRadius="md"
              >
                <Text fontSize="10pt">Done</Text>
              </Button>
              <Button
                size="sm"
                ml={3}
                onClick={handleSaveChanges}
                width="48%"
                borderRadius="md"
                isLoading={saveLoading}
              >
                <Text fontSize="10pt">Save</Text>
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isShareModalOpen} onClose={closeShareModal}>
        <ModalOverlay />
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="13pt" fontWeight={400}>
              Share Profile
            </Text>
          </ModalHeader>
          <Box px={2}>
            <Divider />
            <ModalCloseButton _focus={{ border: "none" }} />
            <ModalBody px={2}>
              <>
                <Flex flexDirection="column">
                  <Flex flexDirection="row" my={3}>
                    <Input
                      borderRadius="4px 0px 0px 4px"
                      borderColor="gray.200"
                      readOnly
                      value={link}
                    />
                  </Flex>
                </Flex>
                <HStack justifyContent="space-evenly" alignItems="center">
                  <FacebookShareButton
                    onClick={(e) => e.stopPropagation()}
                    url={link}
                  >
                    <Icon
                      color="blue.500"
                      fontSize={50}
                      as={FaFacebookSquare}
                    />
                  </FacebookShareButton>
                  <TwitterShareButton
                    onClick={(e) => e.stopPropagation()}
                    url={link}
                  >
                    <Icon color="blue.500" fontSize={50} as={FaTwitterSquare} />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    onClick={(e) => e.stopPropagation()}
                    url={link}
                  >
                    <Icon
                      color="green.500"
                      fontSize={50}
                      as={FaWhatsappSquare}
                    />
                  </WhatsappShareButton>
                  <RedditShareButton
                    onClick={(e) => e.stopPropagation()}
                    url={link}
                  >
                    <Icon color="orangered" fontSize={50} as={FaRedditSquare} />
                  </RedditShareButton>
                  <TumblrShareButton
                    onClick={(e) => e.stopPropagation()}
                    url={link}
                  >
                    <Icon color="black" fontSize={50} as={FaTumblrSquare} />
                  </TumblrShareButton>

                  <CopyToClipboard text={link} onCopy={handleCopyClick}>
                    <Button
                      variant="outline"
                      borderRadius="md"
                      bg={copied ? "green" : ""}
                      borderColor={copied ? "green" : ""}
                      height={45}
                    >
                      <Text mr={1} color={copied ? "white" : ""}>
                        {copied ? "Copied" : "Copy"}
                      </Text>
                      {copied ? (
                        <Flex>
                          <Icon
                            as={GoPaste}
                            fontSize={20}
                            color="white"
                            position="relative"
                          />
                          <Icon
                            as={FaCheck}
                            fontSize={9}
                            mt="2px"
                            color="white"
                            position="absolute"
                            top="45%"
                            left="74%"
                            transform="translate(-50%, -50%)"
                          />
                        </Flex>
                      ) : (
                        <Icon as={GoPaste} fontSize={20} color="blue.500" />
                      )}
                    </Button>
                  </CopyToClipboard>
                </HStack>
              </>
            </ModalBody>
          </Box>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isPageModalOpen} onClose={closePageModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={16} fontWeight={400}>
            Modal Title
          </ModalHeader>
          <ModalCloseButton />
          <Box px={2}>
            <Divider />
            <ModalBody px={2}>
              <Text fontSize={16}>Name</Text>
              <Text fontSize={11} color="gray.500">
                Pages names including capitalization cannot be changed
              </Text>
              <Input
                position="relative"
                name="name"
                value={name}
                onChange={handleChange}
                pl="12px"
                type={""}
                size="sm"
              />
              <Text
                fontSize="9pt"
                color={pageCharsRemaining === 0 ? "red" : "gray.500"}
                pt={2}
              >
                {pageCharsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {nameError}
              </Text>
            </ModalBody>
            <Divider />
          </Box>
          <ModalFooter borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              size="md"
              borderRadius="md"
              mr={2}
              onClick={closePageModal}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              borderRadius="md"
              size="md"
              onClick={handleCreateCommunity}
              disabled={isNameEmpty || loading}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ProfilePage;
