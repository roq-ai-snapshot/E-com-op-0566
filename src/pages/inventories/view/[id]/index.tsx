import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getInventoryById } from 'apiSdk/inventories';
import { Error } from 'components/error';
import { InventoryInterface } from 'interfaces/inventory';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteAbandonedCartItemById } from 'apiSdk/abandoned-cart-items';
import { deleteOrderItemById } from 'apiSdk/order-items';
import { deleteProductRecommendationById } from 'apiSdk/product-recommendations';

function InventoryViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InventoryInterface>(
    () => (id ? `/inventories/${id}` : null),
    () =>
      getInventoryById(id, {
        relations: ['store', 'abandoned_cart_item', 'order_item', 'product_recommendation'],
      }),
  );

  const abandoned_cart_itemHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAbandonedCartItemById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const order_itemHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteOrderItemById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const product_recommendationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteProductRecommendationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Inventory Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              product_name: {data?.product_name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              quantity: {data?.quantity}
            </Text>
            {hasAccess('store', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                store: <Link href={`/stores/view/${data?.store?.id}`}>{data?.store?.id}</Link>
              </Text>
            )}
            {hasAccess('abandoned_cart_item', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Abandoned Cart Item
                </Text>
                <Link href={`/abandoned-cart-items/create?inventory_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>quantity</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.abandoned_cart_item?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.quantity}</Td>
                          <Td>
                            <Button>
                              <Link href={`/abandoned-cart-items/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/abandoned-cart-items/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => abandoned_cart_itemHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('order_item', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Order Item
                </Text>
                <Link href={`/order-items/create?inventory_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>quantity</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.order_item?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.quantity}</Td>
                          <Td>
                            <Button>
                              <Link href={`/order-items/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/order-items/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => order_itemHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('product_recommendation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Product Recommendation
                </Text>
                <Link href={`/product-recommendations/create?inventory_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.product_recommendation?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>
                            <Button>
                              <Link href={`/product-recommendations/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/product-recommendations/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => product_recommendationHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'inventory',
  operation: AccessOperationEnum.READ,
})(InventoryViewPage);
