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
import { createCustomerSegment } from 'apiSdk/customer-segments';
import { Error } from 'components/error';
import { customerSegmentValidationSchema } from 'validationSchema/customer-segments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { StoreInterface } from 'interfaces/store';
import { getUsers } from 'apiSdk/users';
import { UserInterface } from 'interfaces/user';
import { getStores } from 'apiSdk/stores';
import { CustomerSegmentInterface } from 'interfaces/customer-segment';

function CustomerSegmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CustomerSegmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCustomerSegment(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerSegmentInterface>({
    initialValues: {
      name: '',
      store_id: (router.query.store_id as string) ?? null,
      customer_segment_member: [],
    },
    validationSchema: customerSegmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Customer Segment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
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
  entity: 'customer_segment',
  operation: AccessOperationEnum.CREATE,
})(CustomerSegmentCreatePage);
