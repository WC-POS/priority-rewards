import { Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { UilCloudSlash } from "@iconscout/react-unicons";

const PageHeader = (props) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      w="full"
      bgColor="white"
      rounded="lg"
      shadow="lg"
      justifyContent="space-between"
      alignItems="center"
      px={{ base: 4, md: 8 }}
      py={4}
    >
      <Stack direction="column">
        <Stack direction="row" alignItems="center" spacing={4}>
          <Heading size="xl">{props.title}</Heading>
          {props.status === "loading" && <Spinner />}
          {props.status === "error" && (
            <Stack
              alignItems="center"
              justifyContent="center"
              p={1}
              rounded="md"
              bg="red.400"
              color="white"
            >
              <UilCloudSlash />
            </Stack>
          )}
        </Stack>
        <Text color="gray.600" fontSize="lg">
          {props.subtitle}
        </Text>
      </Stack>
      {props.action ? props.action : ""}
    </Stack>
  );
};

export default PageHeader;
