import { Button, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, TextField } from '@mui/material';

import * as yup from 'yup';
import { useFormik } from 'formik';

import toast from 'react-hot-toast';

// ** Store Imports
import { useDispatch } from 'react-redux';

// ** Actions Imports
import { setLoading } from 'src/store/apps/main';

const PhoneNumberDialog = ({ open, userLine, onSubmit, onCancel }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: userLine?.id,
      phoneNumber: userLine?.line.phoneNumber ?? '',
      label: userLine?.label ?? ''
    },
    validationSchema: yup.object({
      label: yup.string().optional()
    }),
    onSubmit: async (values, helpers) => {
      dispatch(setLoading(true));
      try {
        const payload = {
          id: values.id,
          label: values.label
        };

        await onSubmit(payload, onCancel);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        formik.resetForm();
      } catch (err) {
        helpers.setStatus({ success: false });
        toast.error(sentenceCase(err.message));
        helpers.setSubmitting(false);
      } finally {
        dispatch(setLoading(false));
      }
    }
  });

  return (
    <Dialog open={open} aria-labelledby='phone-number-dialog-title'>
      <DialogTitle id='phone-number-dialog-title'>Add label</DialogTitle>
      <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
              fullWidth
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              label='Phone Number'
              name='phoneNumber'
              InputProps={{ readOnly: true }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phoneNumber}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              error={Boolean(formik.touched.label && formik.errors.label)}
              fullWidth
              helperText={formik.touched.label && formik.errors.label}
              label='Label'
              name='label'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.label}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='primary' type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='error' onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PhoneNumberDialog;
