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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getAbandonedCartById, updateAbandonedCartById } from 'apiSdk/abandoned-carts';
import { Error } from 'components/error';
import { abandonedCartValidationSchema } from 'validationSchema/abandoned-carts';
import { AbandonedCartInterface } from 'interfaces/abandoned-cart';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { StoreInterface } from 'interfaces/store';
import { getUsers } from 'apiSdk/users';
import { getStores } from 'apiSdk/stores';
import { abandonedCartItemValidationSchema } from 'validationSchema/abandoned-cart-items';

function AbandonedCartEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AbandonedCartInterface>(
    () => (id ? `/abandoned-carts/${id}` : null),
    () => getAbandonedCartById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AbandonedCartInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAbandonedCartById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AbandonedCartInterface>({
    initialValues: data,
    validationSchema: abandonedCartValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Abandoned Cart
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'abandoned_cart',
  operation: AccessOperationEnum.UPDATE,
})(AbandonedCartEditPage);
