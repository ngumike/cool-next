// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import {
  styled,
  Drawer,
  Select,
  Button,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  Box,
  FormControl
} from '@mui/material';

import toast from 'react-hot-toast';

// ** Third Party Imports
import * as yup from 'yup';
import { useFormik } from 'formik';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Store Imports
import { useDispatch } from 'react-redux';

// ** Actions Imports
import { setLoading } from 'src/store/apps/main';

import { LINE_STATUS } from 'src/configs/constants';

import { titleCase } from 'src/utils/title-case';
import { sentenceCase } from 'src/utils/sentence-case';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const LineSideBar = ({ open, line, onSubmit, onCancel }) => {
  // ** Hooks
  const dispatch = useDispatch();

  const [mode, setMode] = useState('update');

  useEffect(() => {
    setMode(line.id ? 'update' : 'Add');
  }, [line]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: line.id,
      phoneNumber: line.phoneNumber ?? '',
      status: line.status ?? LINE_STATUS.pending.value,
      note: line.note ?? ''
    },
    validationSchema: yup.object({
      phoneNumber: yup.string().length(10).required(),
      status: yup.mixed().oneOf(Object.keys(LINE_STATUS))
    }),
    onSubmit: async (values, helpers) => {
      dispatch(setLoading(true));
      const payload = { ...values };
      try {
        await onSubmit(payload, onCancel);
        helpers.setStatus({ success: true });
        toast.success(sentenceCase(`${mode} Line success!`));
        formik.resetForm();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        toast.error(sentenceCase(err.message));
      } finally {
        helpers.setSubmitting(false);
        dispatch(setLoading(false));
      }
    }
  });

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onCancel}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{titleCase(mode)} Line</Typography>
        <IconButton size='small' onClick={onCancel} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              fullWidth
              required
              label='Phone Number'
              name='phoneNumber'
              InputProps={{ readOnly: mode === 'update' }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phoneNumber}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='select-status-label'>Status</InputLabel>
            <Select
              fullWidth
              value={formik.values.status}
              id='select-status'
              label='Status'
              labelId='select-status-label'
              name='status'
              onChange={formik.handleChange}
              inputProps={{
                placeholder: 'Status',
                readOnly: line.status === LINE_STATUS.allocated.value
              }}
            >
              {Object.keys(LINE_STATUS).map((key, index) => (
                <MenuItem value={key} key={index}>
                  {LINE_STATUS[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.note && formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
              fullWidth
              multiline
              label='Note'
              name='note'
              rows={5}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.note}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
              <Button size='large' type='submit' variant='contained'>
                Submit
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
};

export default LineSideBar;
