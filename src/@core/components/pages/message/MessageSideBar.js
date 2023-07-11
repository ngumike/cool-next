// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import {
  styled,
  Drawer,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox
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

import { titleCase } from 'src/utils/title-case';
import { sentenceCase } from 'src/utils/sentence-case';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const MessageSideBar = ({ open, message, onSubmit, onCancel }) => {
  // ** Hooks
  const dispatch = useDispatch();

  const [mode, setMode] = useState('update');

  useEffect(() => {
    setMode(message.id ? 'update' : 'create');
  }, [message]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: message.id,
      sender: message.sender ?? '',
      receiver: message.receiver ?? '',
      message: message.message ?? '',
      isRead: message.isRead ?? false,
      isVisible: message.isVisible ?? false,
      oldIsVisible: message.isVisible ?? false
    },
    validationSchema: yup.object({
      sender: yup.string().required(),
      receiver: yup.string().length(10).required(),
      isRead: yup.bool().required(),
      isVisible: yup.bool().required()
    }),
    onSubmit: async (values, helpers) => {
      dispatch(setLoading(true));
      const payload = { ...values };
      try {
        await onSubmit(payload, onCancel);
        helpers.setStatus({ success: true });
        toast.success(sentenceCase(`${mode} Message success!`));
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
        <Typography variant='h6'>{titleCase(mode)} Message</Typography>
        <IconButton size='small' onClick={onCancel} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.sender && formik.errors.sender)}
              helperText={formik.touched.sender && formik.errors.sender}
              fullWidth
              required
              label='Sender'
              name='sender'
              InputProps={{ readOnly: mode === 'update' }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.sender}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.receiver && formik.errors.receiver)}
              helperText={formik.touched.receiver && formik.errors.receiver}
              fullWidth
              required
              label='Receiver'
              name='receiver'
              InputProps={{ readOnly: mode === 'update' }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.receiver}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.message && formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              fullWidth
              required
              multiline
              rows={5}
              label='Message'
              name='message'
              InputProps={{ readOnly: mode === 'update' }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.message}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <FormControlLabel
              label='Read'
              name='isRead'
              onChange={formik.handleChange}
              control={<Checkbox checked={formik.values.isRead} />}
            />

            <FormControlLabel
              label='Visible'
              name='isVisible'
              disabled
              onChange={formik.handleChange}
              control={<Checkbox checked={formik.values.isVisible} />}
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

export default MessageSideBar;
