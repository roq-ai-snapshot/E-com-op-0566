import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getAbandonedCartItemById } from 'apiSdk/abandoned-cart-items';
import { Error } from 'components/error';
import { AbandonedCartItemInterface } from 'interfaces/abandoned-cart-item';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function AbandonedCartItemViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AbandonedCartItemInterface>(
    () => (id ? `/abandoned-cart-items/${id}` : null),
    () =>
      getAbandonedCartItemById(id, {
        relations: ['abandoned_cart', 'inventory'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Abandoned Cart Item Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              quantity: {data?.quantity}
            </Text>
            {hasAccess('abandoned_cart', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                abandoned_cart:{' '}
                <Link href={`/abandoned-carts/view/${data?.abandoned_cart?.id}`}>{data?.abandoned_cart?.id}</Link>
              </Text>
            )}
            {hasAccess('inventory', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                inventory: <Link href={`/inventories/view/${data?.inventory?.id}`}>{data?.inventory?.id}</Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'abandoned_cart_item',
  operation: AccessOperationEnum.READ,
})(AbandonedCartItemViewPage);
