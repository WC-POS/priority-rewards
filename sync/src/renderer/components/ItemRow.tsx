import { Box, Button, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { UilAward, UilSitemap, UilSyncSlash } from '@iconscout/react-unicons';

import React from 'react';
import { SimpleItem } from 'renderer/pages/Items';

interface ItemRowProps {
  item: SimpleItem;
  index: number;
  onClick: (id: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onClick }) => {
  const altBG = useColorModeValue('gray.50', 'gray.600');
  return (
    <Box p={2} key={item.id} bgColor={index % 2 === 1 ? altBG : 'inherit'}>
      <Text fontSize="sm" opacity={0.75}>
        {item.name}
      </Text>
      <Stack direction="row" spacing={2} alignItems="center">
        {item.isModifier && (
          <Box opacity={0.75}>
            <UilSitemap size={16} />
          </Box>
        )}
        {item.isPromoItem && (
          <Box opacity={0.75}>
            <UilAward size={16} />
          </Box>
        )}
        {!item.isSynced && (
          <Box opacity={0.75}>
            <UilSyncSlash size={16} />
          </Box>
        )}
        <Button
          variant="link"
          colorScheme="black"
          fontWeight="semibold"
          fontSize="lg"
          onClick={() => onClick(item.id)}
        >
          {item.desc}
        </Button>
        {item.receipt !== item.desc && (
          <Text opacity={0.75}>{item.receipt}</Text>
        )}
      </Stack>
    </Box>
  );
};

export default ItemRow;
