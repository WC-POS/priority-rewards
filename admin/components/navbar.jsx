import NextLink from "next/link";

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
  UilAnalysis,
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
  UilSignOutAlt,
  UilTachometerFastAlt,
  UilTicket,
  UilTrophy,
  UilUsersAlt,
  UilUserCircle,
} from "@iconscout/react-unicons";

import { useAccountStore, useFranchiseStore } from "../store";
import NotificationsDrawer from "./notifications-drawer";

const FranchiseGroup = () => {
  return (
    <>
      <NextLink href="/franchise/locations/" passHref>
        <MenuItem icon={<UilEstate />} as={"a"}>
          Locations
        </MenuItem>
      </NextLink>
      <NextLink href="/franchise/users/" passHref>
        <MenuItem icon={<UilUsersAlt />} as="a">
          Admin Users
        </MenuItem>
      </NextLink>
      <NextLink href="/franchise/" passHref>
        <MenuItem icon={<UilSetting />} as="a" href="/franchise/">
          Settings
        </MenuItem>
      </NextLink>
    </>
  );
};

const MembershipGroup = () => {
  return (
    <>
      <NextLink href="/memberships/" passHref>
        <MenuItem icon={<UilUsersAlt />} as="a">
          Customers
        </MenuItem>
      </NextLink>
      <NextLink href="/memberships/promotions/" passHref>
        <MenuItem icon={<UilAward />} as="a">
          Promotions
        </MenuItem>
      </NextLink>
      <NextLink href="/memberships/events/" passHref>
        <MenuItem icon={<UilTicket />} as="a">
          Events
        </MenuItem>
      </NextLink>
      <NextLink href="/memberships/news/" passHref>
        <MenuItem icon={<UilNewspaper />} as="a">
          News
        </MenuItem>
      </NextLink>
      <NextLink href="/memberships/clubs/" passHref>
        <MenuItem icon={<UilTrophy />} as="a">
          Clubs
        </MenuItem>
      </NextLink>
    </>
  );
};

const OperationsGroup = () => {
  return (
    <>
      <NextLink href="/operations/" passHref>
        <MenuItem icon={<UilAnalysis />} as="a">
          Performance
        </MenuItem>
      </NextLink>
      <NextLink href="/operations/sales/" passHref>
        <MenuItem icon={<UilReceiptAlt />}>Sales</MenuItem>
      </NextLink>
      <NextLink href="/operations/labor/" passHref>
        <MenuItem icon={<UilBill />}>Labor</MenuItem>
      </NextLink>
      <NextLink href="/operations/audit/" passHref>
        <MenuItem icon={<UilSearchAlt />}>Audit</MenuItem>
      </NextLink>
    </>
  );
};

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useAccountStore((state) => state.account);
  const franchise = useFranchiseStore((state) => state.franchise);
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
            <NextLink href="/" passHref>
              <MenuItem icon={<UilTachometerFastAlt />} as="a">
                Dashboard
              </MenuItem>
            </NextLink>
            <MenuDivider />
            <MenuGroup title="Franchise">
              <FranchiseGroup />
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Memberships">
              <MembershipGroup />
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Operations">
              <OperationsGroup />
            </MenuGroup>
          </MenuList>
        </Menu>
        <HStack
          spacing={2}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          <NextLink href="/" passHref>
            <Button variant="ghost" color="gray.700" as="a">
              <HStack spacing={2} alignItems="center">
                <UilTachometerFastAlt />
                <Text display={{ base: "none", xl: "block" }}>Dashboard</Text>
              </HStack>
            </Button>
          </NextLink>
          <Menu>
            <MenuButton variant="ghost" color="gray.700" as={Button}>
              <HStack spacing={2} alignItems="center">
                <UilBuilding />
                <Text display={{ base: "none", lg: "block" }}>Franchise</Text>
                <UilAngleDown />
              </HStack>
            </MenuButton>
            <MenuList>
              <FranchiseGroup />
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
              <MembershipGroup />
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
              <OperationsGroup />
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
                <Avatar size={"sm"} name="Devin Sharpe" bgColor="gray.200" />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {account.firstName} {account.lastName}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {franchise.displayTitle.title}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <UilAngleDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={"white"} borderColor={"gray.200"}>
              <MenuItem icon={<UilUserCircle />}>Profile</MenuItem>
              <MenuItem icon={<UilSetting />}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem icon={<UilSignOutAlt />}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <NotificationsDrawer isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </>
  );
};

export default Navbar;
