import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getInventories, deleteInventoryById } from 'apiSdk/inventories';
import { InventoryInterface } from 'interfaces/inventory';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function InventoryListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<InventoryInterface[]>(
    () => '/inventories',
    () =>
      getInventories({
        relations: ['store', 'abandoned_cart_item.count', 'order_item.count', 'product_recommendation.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteInventoryById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Inventory
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('inventory', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/inventories/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>id</Th>
                  <Th>product_name</Th>
                  <Th>quantity</Th>
                  {hasAccess('store', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>store_id</Th>}
                  {hasAccess('abandoned_cart_item', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>abandoned_cart_item</Th>
                  )}
                  {hasAccess('order_item', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>order_item</Th>}
                  {hasAccess('product_recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>product_recommendation</Th>
                  )}
                  {hasAccess('inventory', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('inventory', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('inventory', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.product_name}</Td>
                    <Td>{record.quantity}</Td>
                    {hasAccess('store', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/stores/view/${record.store?.id}`}>{record.store?.id}</Link>
                      </Td>
                    )}
                    {hasAccess('abandoned_cart_item', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.abandoned_cart_item}</Td>
                    )}
                    {hasAccess('order_item', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.order_item}</Td>
                    )}
                    {hasAccess('product_recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.product_recommendation}</Td>
                    )}
                    {hasAccess('inventory', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/inventories/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('inventory', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/inventories/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('inventory', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'inventory',
  operation: AccessOperationEnum.READ,
})(InventoryListPage);
