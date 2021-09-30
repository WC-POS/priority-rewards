import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from "@chakra-ui/react";

const NotificationsDrawer = (props) => {
  return (
    <Drawer isOpen={props.isOpen} placement="right" onClose={props.onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Notifications</DrawerHeader>
        <DrawerBody>
          <Input placeholder="Type here..." />
        </DrawerBody>

        <DrawerFooter w="full">
          <Button variant="outline" mr={3} onClick={props.onClose} w="full">
            Cancel
          </Button>
          <Button colorScheme="blue" w="full">
            Clear
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationsDrawer;
