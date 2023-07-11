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

import { USER_ROLE, USER_STATUS } from 'src/configs/constants';

import { titleCase } from 'src/utils/title-case';
import { sentenceCase } from 'src/utils/sentence-case';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const UserSideBar = ({ open, user, onSubmit, onCancel }) => {
  // ** Hooks
  const dispatch = useDispatch();

  const [mode, setMode] = useState('update');

  useEffect(() => {
    setMode(user.id ? 'update' : 'invite');
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: user.id,
      email: user.email ?? '',
      name: user.nickName ?? '',
      role: user.role ?? USER_ROLE.user.value,
      status: user.status ?? USER_STATUS.pending.value,
      note: user.note ?? ''
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      name: yup.string().min(6).required(),
      role: yup.mixed().oneOf(Object.keys(USER_ROLE)),
      status: yup.mixed().oneOf(Object.keys(USER_STATUS))
    }),
    onSubmit: async (values, helpers) => {
      dispatch(setLoading(true));
      const payload = { ...values };
      try {
        await onSubmit(payload, onCancel);
        helpers.setStatus({ success: true });
        toast.success(sentenceCase(`${mode} User success!`));
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
        <Typography variant='h6'>{titleCase(mode)} User</Typography>
        <IconButton size='small' onClick={onCancel} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
              required
              label='Email'
              name='email'
              InputProps={{ readOnly: mode === 'update' }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label='Name'
              name='name'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
              value={formik.values.name}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='select-role-label'>Role</InputLabel>
            <Select
              fullWidth
              value={formik.values.role}
              id='select-role'
              label='Role'
              labelId='select-role-label'
              name='role'
              onChange={formik.handleChange}
              inputProps={{ placeholder: 'Role' }}
            >
              {Object.keys(USER_ROLE).map((key, index) => (
                <MenuItem value={key} key={index}>
                  {USER_ROLE[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {mode === 'update' && (
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
                inputProps={{ placeholder: 'Status' }}
              >
                {Object.keys(USER_STATUS).map((key, index) => (
                  <MenuItem value={key} key={index}>
                    {USER_STATUS[key].label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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

export default UserSideBar;
