// ** Next Imports

// ** MUI Components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';

// ** Third Party Imports
import * as yup from 'yup';
import { useFormik } from 'formik';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

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

const LaunchPage = () => {
  // ** Hooks
  const { verifyEmail } = useAuth();

  const handleSubmit = async payload => {
    try {
      await verifyEmail(payload);
    } catch (err) {
      throw new Error(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: yup.object({
      email: yup.string().email().required()
    }),
    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          email: values.email
        };

        await handleSubmit(payload);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        formik.resetForm();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ email: err.message });
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
              <TypographyStyled variant='h5'>Enter your email to continue</TypographyStyled>
            </Box>
            <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label='Email'
                  name='email'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.email}
                />
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Continue
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </Box>
    </Box>
  );
};
LaunchPage.getLayout = page => <BlankLayout>{page}</BlankLayout>;
LaunchPage.guestGuard = true;

export default LaunchPage;
