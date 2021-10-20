import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { UilMessage, UilUnlock } from "@iconscout/react-unicons";
import { useAPIStore } from "../store";

const UnlockModal = (props) => {
  const [code, setCode] = useState("");
  const toast = useToast();
  const fetchPost = useAPIStore((state) => state.fetchPost);

  const sendCode = async () => {
    return await fetchPost("/admin/auth/temp/");
  };

  const handleAuthenticate = async (codeValue) => {
    if (
      code.length === 4 ||
      (typeof codeValue === "string" && codeValue.length === 4)
    ) {
      let authRes = await fetchPost("/admin/auth/temp/redeem/", {
        code: typeof codeValue === "string" ? codeValue : code,
      });
      if (authRes.ok) {
        toast({
          title: "Valid Code Entered",
          description:
            "Your code was valid. You can now edit the page information.",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
        props.onAuth();
        props.onClose();
      } else if (authRes.error === null) {
        toast({
          title: "Error",
          description: authRes.body.error,
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description:
            "Something is not right on our side. We apologize for the inconvenience.",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
        console.log(authRes.error);
      }
    } else {
      toast({
        title: "Invalid Code",
        description:
          "Your one-time code will be 4 characters long. Please check your email.",
        status: "warning",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  useEffect(async () => {
    if (props.isOpen) {
      await sendCode();
      toast({
        title: "One Time Code",
        description: "Please check your email for a one-time code.",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xs">
      <ModalOverlay />
      <ModalContent p={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box>
            <UilUnlock />
          </Box>
          <ModalHeader whiteSpace="nowrap" p={0}>
            Unlock Editor
          </ModalHeader>
        </Stack>
        <ModalCloseButton />
        <Text my={4} textAlign="center">
          A one-time authentication code has been sent to your email. This
          one-time code expires after five minutes.
        </Text>
        <ModalBody mx="auto">
          <PinInput
            otp
            size="lg"
            autoFocus
            onChange={(value) => setCode(value)}
            onComplete={handleAuthenticate}
            type="alphanumeric"
          >
            <PinInputField mx={1} />
            <PinInputField mx={1} />
            <PinInputField mx={1} />
            <PinInputField mx={1} />
          </PinInput>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <IconButton
            variant="ghost"
            icon={<UilMessage />}
            onClick={sendCode}
          />
          <Button
            variant="ghost"
            colorScheme="blue"
            leftIcon={<UilUnlock />}
            px={4}
            onClick={handleAuthenticate}
          >
            Authenticate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UnlockModal;
