import {
  SimpleGrid,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const Index = () => {
  return (
    <>
      <SimpleGrid w="full" columns={{ base: 2, md: 4 }} spacing={4}>
        <Stat p={4} borderRadius="md" bgColor="white" shadow="md">
          <StatLabel>Sent</StatLabel>
          <StatNumber>345,670</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>

        <Stat p={4} borderRadius="md" bgColor="white" shadow="md">
          <StatLabel>Clicked</StatLabel>
          <StatNumber>45</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            9.05%
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </>
  );
};

export default Index;
