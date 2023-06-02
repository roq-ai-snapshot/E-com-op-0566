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
import { getCustomerSegmentMemberById, updateCustomerSegmentMemberById } from 'apiSdk/customer-segment-members';
import { Error } from 'components/error';
import { customerSegmentMemberValidationSchema } from 'validationSchema/customer-segment-members';
import { CustomerSegmentMemberInterface } from 'interfaces/customer-segment-member';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { CustomerSegmentInterface } from 'interfaces/customer-segment';
import { getUsers } from 'apiSdk/users';
import { getCustomerSegments } from 'apiSdk/customer-segments';

function CustomerSegmentMemberEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CustomerSegmentMemberInterface>(
    () => (id ? `/customer-segment-members/${id}` : null),
    () => getCustomerSegmentMemberById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CustomerSegmentMemberInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCustomerSegmentMemberById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CustomerSegmentMemberInterface>({
    initialValues: data,
    validationSchema: customerSegmentMemberValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Customer Segment Member
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
            <AsyncSelect<CustomerSegmentInterface>
              formik={formik}
              name={'segment_id'}
              label={'segment_id'}
              placeholder={'Select Customer Segment'}
              fetcher={getCustomerSegments}
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
  entity: 'customer_segment_member',
  operation: AccessOperationEnum.UPDATE,
})(CustomerSegmentMemberEditPage);
