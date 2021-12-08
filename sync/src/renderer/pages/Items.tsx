import {
  Box,
  Spinner,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import ItemModal from 'renderer/components/ItemModal';
import ItemRow from 'renderer/components/ItemRow';

export interface SimpleItem {
  id: string;
  name: string;
  desc: string;
  receipt: string;
  isModifier: boolean;
  department: string;
  itemCount: number;
  isPromoItem: boolean;
  isSynced: boolean;
}

interface SimpleDepartment {
  id: string;
  name: string;
  desc: string;
  items: SimpleItem[];
}

const Items: React.FC = () => {
  const secondaryBG = useColorModeValue('teal.100', 'teal.200');
  const [departments, setDepartments] = useState<SimpleDepartment[]>([]);
  const [focusedItemId, setFocusedItemId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.electron.ipcRenderer
      .getDepartments()
      .then(async (fposDepartments) => {
        const items = await window.electron.ipcRenderer.getItems();
        setDepartments(
          fposDepartments.map(
            (dept) =>
              ({
                id: dept.departmentId,
                name: dept.departmentName,
                desc: dept.departmentDescription,
                items: items
                  .filter((item) => item.department === dept.departmentName)
                  .map(
                    (item) =>
                      ({
                        id: item.itemId,
                        name: item.itemName,
                        desc: item.itemDescription,
                        receipt: item.receiptDesc,
                        isModifier: item.isModifierGroup || item.isModifier,
                        isPromoItem: item.isPromoItem,
                        isSynced: false,
                      } as SimpleItem)
                  ),
              } as SimpleDepartment)
          )
        );
        setIsLoading(false);
        return null;
      })
      .catch((err) => err);
  }, []);

  return (
    <>
      <ItemModal
        id={focusedItemId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      {isLoading ? (
        <Stack
          direction="column"
          h="full"
          w="full"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner color="teal.400" size="xl" />
        </Stack>
      ) : (
        <>
          {' '}
          {departments.map((dept) => (
            <>
              <Box
                p={2}
                bgColor={secondaryBG}
                color="black"
                position="sticky"
                top={0}
                key={dept.id}
                zIndex={10}
              >
                {dept.desc}
              </Box>
              {dept.items.map((item, index) => (
                <ItemRow
                  item={item}
                  index={index}
                  key={item.id}
                  onClick={(id) => {
                    setFocusedItemId(id);
                    onOpen();
                  }}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};

export default Items;
