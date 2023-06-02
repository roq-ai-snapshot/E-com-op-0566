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
import { createProductRecommendation } from 'apiSdk/product-recommendations';
import { Error } from 'components/error';
import { productRecommendationValidationSchema } from 'validationSchema/product-recommendations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { InventoryInterface } from 'interfaces/inventory';
import { getUsers } from 'apiSdk/users';
import { getInventories } from 'apiSdk/inventories';
import { ProductRecommendationInterface } from 'interfaces/product-recommendation';

function ProductRecommendationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ProductRecommendationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createProductRecommendation(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ProductRecommendationInterface>({
    initialValues: {
      customer_id: (router.query.customer_id as string) ?? null,
      inventory_id: (router.query.inventory_id as string) ?? null,
    },
    validationSchema: productRecommendationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Product Recommendation
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
  entity: 'product_recommendation',
  operation: AccessOperationEnum.CREATE,
})(ProductRecommendationCreatePage);
