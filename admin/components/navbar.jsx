import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  UilAngleDown,
  UilAward,
  UilBell,
  UilBill,
  UilBriefcaseAlt,
  UilBuilding,
  UilChannel,
  UilEstate,
  UilListUl,
  UilNewspaper,
  UilReceiptAlt,
  UilSearchAlt,
  UilSetting,
  UilTachometerFastAlt,
  UilTicket,
  UilTrophy,
  UilUsersAlt,
} from "@iconscout/react-unicons";

import NotificationsDrawer from "./notifications-drawer";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex
        w="full"
        px={4}
        py={1}
        boxShadow="md"
        bgColor="white"
        borderRadius="md"
        alignItems="center"
      >
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            icon={<UilListUl />}
            variant="ghost"
            mr={2}
            display={{ base: "flex", lg: "none" }}
          />
          <MenuList>
            <MenuItem icon={<UilTachometerFastAlt />}>Dashboard</MenuItem>
            <MenuDivider />
            <MenuGroup title="Franchise">
              <MenuItem icon={<UilEstate />}>Locations</MenuItem>
              <MenuItem icon={<UilUsersAlt />}>Admin Users</MenuItem>
              <MenuItem icon={<UilSetting />}>Settings</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Memberships">
              <MenuItem icon={<UilUsersAlt />}>Customers</MenuItem>
              <MenuItem icon={<UilAward />}>Promotions</MenuItem>
              <MenuItem icon={<UilTicket />}>Events</MenuItem>
              <MenuItem icon={<UilNewspaper />}>News</MenuItem>
              <MenuItem icon={<UilTrophy />}>Clubs</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Operations">
              <MenuItem icon={<UilReceiptAlt />}>Sales</MenuItem>
              <MenuItem icon={<UilBill />}>Labor</MenuItem>
              <MenuItem icon={<UilSearchAlt />}>Audit</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
        <HStack
          spacing={2}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          <Button variant="ghost" color="gray.700">
            <HStack spacing={2} alignItems="center">
              <UilTachometerFastAlt />
              <Text display={{ base: "none", xl: "block" }}>Dashboard</Text>
            </HStack>
          </Button>
          <Menu>
            <MenuButton variant="ghost" color="gray.700" as={Button}>
              <HStack spacing={2} alignItems="center">
                <UilBuilding />
                <Text display={{ base: "none", lg: "block" }}>Franchise</Text>
                <UilAngleDown />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<UilEstate />}>Locations</MenuItem>
              <MenuItem icon={<UilUsersAlt />}>Admin Users</MenuItem>
              <MenuItem icon={<UilSetting />}>Settings</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton variant="ghost" color="gray.700" as={Button}>
              <HStack spacing={2} alignItems="center">
                <UilChannel />
                <Text display={{ base: "none", lg: "block" }}>Memberships</Text>
                <UilAngleDown />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<UilUsersAlt />}>Customers</MenuItem>
              <MenuItem icon={<UilAward />}>Promotions</MenuItem>
              <MenuItem icon={<UilTicket />}>Events</MenuItem>
              <MenuItem icon={<UilNewspaper />}>News</MenuItem>
              <MenuItem icon={<UilTrophy />}>Clubs</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton variant="ghost" color="gray.700" as={Button}>
              <HStack spacing={2} alignItems="center">
                <UilBriefcaseAlt />
                <Text display={{ base: "none", lg: "block" }}>Operations</Text>
                <UilAngleDown />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<UilReceiptAlt />}>Sales</MenuItem>
              <MenuItem icon={<UilBill />}>Labor</MenuItem>
              <MenuItem icon={<UilSearchAlt />}>Audit</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Spacer />
        <Button p={2} mr={4} variant="" color="gray.500" onClick={onOpen}>
          <UilBell />
        </Button>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} name="Devin Sharpe" bgColor="blue.300" />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Devin Sharpe</Text>
                  <Text fontSize="xs" color="gray.600">
                    Stonecrest
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <UilAngleDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={"white"} borderColor={"gray.200"}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <NotificationsDrawer isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </>
  );
};

export default Navbar;
