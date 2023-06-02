import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createAbandonedCart } from 'apiSdk/abandoned-carts';
import { Error } from 'components/error';
import { abandonedCartValidationSchema } from 'validationSchema/abandoned-carts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { StoreInterface } from 'interfaces/store';
import { getInventories } from 'apiSdk/inventories';
import { InventoryInterface } from 'interfaces/inventory';
import { getUsers } from 'apiSdk/users';
import { getStores } from 'apiSdk/stores';
import { AbandonedCartInterface } from 'interfaces/abandoned-cart';

function AbandonedCartCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AbandonedCartInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAbandonedCart(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AbandonedCartInterface>({
    initialValues: {
      customer_id: (router.query.customer_id as string) ?? null,
      store_id: (router.query.store_id as string) ?? null,
      abandoned_cart_item: [],
    },
    validationSchema: abandonedCartValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Abandoned Cart
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'customer_id'}
            label={'customer_id'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<StoreInterface>
            formik={formik}
            name={'store_id'}
            label={'store_id'}
            placeholder={'Select Store'}
            fetcher={getStores}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'abandoned_cart',
  operation: AccessOperationEnum.CREATE,
})(AbandonedCartCreatePage);
