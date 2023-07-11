// ** React Imports
import { useEffect, useState } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
import {
  Button,
  Checkbox,
  TextField,
  InputLabel,
  IconButton,
  Box,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Typography
} from '@mui/material';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import * as yup from 'yup';
import { useFormik } from 'formik';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import { useRouter } from 'next/router';
import { sentenceCase } from 'src/utils/sentence-case';

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}));

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // ** Hooks
  const { potentialUser, login } = useAuth();
  const router = useRouter();

  // ** Vars
  const { email } = potentialUser ?? {};

  useEffect(() => {
    if (!email) router.replace('/auth/launch');
  }, [email, router]);

  const handleSubmit = async payload => {
    try {
      await login(payload);
    } catch (err) {
      throw new Error(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: email || '',
      password: ''
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required()
    }),
    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          email: values.email,
          password: values.password,
          rememberMe: rememberMe
        };

        await handleSubmit(payload);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success(`Login success!`);
        formik.resetForm();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ password: 'password incorrect!' });
        toast.error(sentenceCase(err.message));
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Box className='content-right'>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            p: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                {themeConfig.appName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Welcome back! 👋🏻</TypographyStyled>
            </Box>
            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  required
                  fullWidth
                  label='Email'
                  name='email'
                  InputProps={{
                    readOnly: true
                  }}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='password' error={Boolean(formik.errors.password)}>
                  Password
                </InputLabel>
                <OutlinedInput
                  error={Boolean(formik.touched.password && formik.errors.password)}
                  required
                  fullWidth
                  label='Password'
                  name='password'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Box
                sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled>
              </Box>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Login
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </Box>
    </Box>
  );
};
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = true;

export default LoginPage;
