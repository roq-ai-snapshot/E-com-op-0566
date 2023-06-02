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
import { createAbandonedCartItem } from 'apiSdk/abandoned-cart-items';
import { Error } from 'components/error';
import { abandonedCartItemValidationSchema } from 'validationSchema/abandoned-cart-items';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { AbandonedCartInterface } from 'interfaces/abandoned-cart';
import { InventoryInterface } from 'interfaces/inventory';
import { getAbandonedCarts } from 'apiSdk/abandoned-carts';
import { getInventories } from 'apiSdk/inventories';
import { AbandonedCartItemInterface } from 'interfaces/abandoned-cart-item';

function AbandonedCartItemCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AbandonedCartItemInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAbandonedCartItem(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AbandonedCartItemInterface>({
    initialValues: {
      quantity: 0,
      cart_id: (router.query.cart_id as string) ?? null,
      inventory_id: (router.query.inventory_id as string) ?? null,
    },
    validationSchema: abandonedCartItemValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Abandoned Cart Item
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="quantity" mb="4" isInvalid={!!formik.errors?.quantity}>
            <FormLabel>quantity</FormLabel>
            <NumberInput
              name="quantity"
              value={formik.values?.quantity}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.quantity && <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<AbandonedCartInterface>
            formik={formik}
            name={'cart_id'}
            label={'cart_id'}
            placeholder={'Select Abandoned Cart'}
            fetcher={getAbandonedCarts}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<InventoryInterface>
            formik={formik}
            name={'inventory_id'}
            label={'inventory_id'}
            placeholder={'Select Inventory'}
            fetcher={getInventories}
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
  entity: 'abandoned_cart_item',
  operation: AccessOperationEnum.CREATE,
})(AbandonedCartItemCreatePage);
