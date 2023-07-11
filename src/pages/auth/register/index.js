// ** React Imports
import { useEffect, useState } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
import {
  Box,
  Button,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import { useRouter } from 'next/router';

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

const schema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().min(6).required(),
  password: yup.string().min(8).required(),
  cfmPassword: yup
    .string()
    .min(8)
    .required()
    .oneOf([yup.ref('password'), null], 'Password must match')
});

const CreatePasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCfmPassword, setShowCfmPassword] = useState(false);

  // ** Hooks
  const router = useRouter();

  // ** Vars
  const { potentialUser, activate } = useAuth();

  const { id, email, nickName } = potentialUser ?? {};

  const defaultValues = {
    email: email,
    username: nickName,
    password: '',
    cfmPassword: ''
  };
  useEffect(() => {
    if (!email) router.replace('/auth/launch');
  }, [email, router]);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = async data => {
    const { email, username, password } = data;

    await activate({ id, email, password, nickName: username });
  };

  return (
    <Box className='content-right'>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            p: 12,
            height: '100%',
            maxWidth: 600,
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
              <TypographyStyled variant='h5'>Enter your nick name and password to get started! </TypographyStyled>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      InputProps={{
                        readOnly: true
                      }}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      label='Nick name'
                      onChange={onChange}
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
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
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-cfm-password' error={Boolean(errors.cfmPassword)}>
                  Confirm Password
                </InputLabel>
                <Controller
                  name='cfmPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Confirm Password'
                      onChange={onChange}
                      id='auth-login-v2-cfm-password'
                      error={Boolean(errors.cfmPassword)}
                      type={showCfmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowCfmPassword(!showCfmPassword)}
                          >
                            <Icon icon={showCfmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.cfmPassword && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.cfmPassword.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mt: 7, mb: 7 }}>
                Submit
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </Box>
    </Box>
  );
};
CreatePasswordPage.getLayout = page => <BlankLayout>{page}</BlankLayout>;
CreatePasswordPage.guestGuard = true;

export default CreatePasswordPage;
