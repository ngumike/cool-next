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
  FormControl,
  OutlinedInput,
  Chip
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

import { USER_STATUS, LINE_STATUS, USER_LINE_STATUS } from 'src/configs/constants';

import { titleCase } from 'src/utils/title-case';
import { sentenceCase } from 'src/utils/sentence-case';
import { fetchLines } from 'src/store/apps/line';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const UserPhoneSideBar = ({ open, users, lines, userLine, onSubmit, onCancel }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** Vars
  const [mode, setMode] = useState('update');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableLines, setAvailableLines] = useState([]);
  const [email, setEmail] = useState('');

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: userLine.id,
      user: userLine.user ?? '',
      line: userLine.line ?? '',
      lines: [],
      status: userLine.status ?? USER_LINE_STATUS.pending.value,
      note: userLine.note ?? ''
    },
    validationSchema: null,
    onSubmit: async (values, helpers) => {
      dispatch(setLoading(true));
      const payload = { ...values };
      try {
        await onSubmit(payload, onCancel);
        helpers.setStatus({ success: true });
        toast.success(sentenceCase(`${mode} phone number success!`));
        dispatch(fetchLines());
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

  useEffect(() => {
    setMode(userLine.id ? 'update' : 'assign');
    if (userLine.id) {
      formik.validationSchema = yup.object({
        user: yup.object().required(),
        line: yup.object().required(),
        lines: yup.object().optional(),
        status: yup.mixed().oneOf(Object.keys(USER_LINE_STATUS))
      });
    } else {
      formik.validationSchema = yup.object({
        user: yup.object().required(),
        line: yup.object().optional(),
        lines: yup.array().required(),
        status: yup.mixed().oneOf(Object.keys(USER_LINE_STATUS))
      });
    }
  }, [formik, userLine]);

  useEffect(() => {
    if (userLine.id) {
      setAvailableUsers([userLine.user]);
    } else {
      setAvailableUsers(users.filter(user => user.status === USER_STATUS.active.value));
    }
  }, [userLine, users]);

  useEffect(() => {
    if (userLine.id) {
      setAvailableLines([userLine.line]);
    } else {
      setAvailableLines(lines.filter(line => line.status === LINE_STATUS.available.value));
    }
  }, [userLine, lines]);

  useEffect(() => {
    if (userLine && userLine.user) {
      setEmail(userLine.user.email);
    } else {
      setEmail('');
    }
  }, [userLine]);

  const handleUserChange = e => {
    formik.handleChange(e);
    setEmail(e.target.value.email);
  };

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onCancel}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 312, sm: 412 } } }}
    >
      <Header>
        <Typography variant='h6'>{titleCase(mode)} Phone Number</Typography>
        <IconButton size='small' onClick={onCancel} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='select-user-label'>Nick name</InputLabel>
            <Select
              fullWidth
              value={formik.values.user}
              id='select-user'
              label='Nick name'
              labelId='select-user-label'
              name='user'
              onChange={e => handleUserChange(e)}
              inputProps={{
                placeholder: 'Nick name',
                readOnly: mode === 'update'
              }}
            >
              {availableUsers.map(user => (
                <MenuItem value={user} key={user.id}>
                  {user.nickName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              fullWidth
              label='Email'
              disabled
              InputProps={{ placeholder: 'Email', readOnly: true }}
              value={email}
            />
          </FormControl>
          {mode === 'assign' ? (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='multiple-line-label'>Phone Numbers</InputLabel>
              <Select
                labelId='multiple-line-label'
                id='multiple-line-select'
                name='lines'
                multiple
                value={formik.values.lines}
                onChange={formik.handleChange}
                input={<OutlinedInput id='multiple-line-chip' label='Phone Numbers' />}
                renderValue={lines => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {lines.map(line => (
                      <Chip key={line.id} label={line.phoneNumber} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {availableLines.map(line => (
                  <MenuItem key={line.id} value={line}>
                    {line.phoneNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='select-line-label'>Phone Number</InputLabel>
              <Select
                fullWidth
                value={formik.values.line}
                label='Phone Number'
                labelId='select-line-label'
                name='line'
                onChange={formik.handleChange}
                inputProps={{
                  placeholder: 'Phone Number',
                  readOnly: mode === 'update'
                }}
              >
                {availableLines.map(line => (
                  <MenuItem value={line} key={line.id}>
                    {line.phoneNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
                placeholder: 'Select Status'
              }}
            >
              {Object.keys(USER_LINE_STATUS).map((key, index) => (
                <MenuItem value={key} key={index}>
                  {USER_LINE_STATUS[key].label}
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
              <Button size='large' variant='outuserLined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
};

export default UserPhoneSideBar;
