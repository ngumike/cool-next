/* eslint-disable padding-line-between-statements */
import { Box, Container, Typography, Grid, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Typography variant='h4'>Profile</Typography>
      <Formik
        initialValues={{
          nickName: user.nickName ?? '',
          email: user.email ?? '',
          phoneNumber: user.phoneNumber ?? '',
          isEmailVerified: user.isEmailVerified ?? false,
          isPhoneVerified: user.isPhoneVerified ?? false,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          nickName: Yup.string().max(255).required('Nick name is required.'),
          email: Yup.string().email('Invalid email address.').max(255).required('Email is required.')
        })}
        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
          try {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Profile updated successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor='nick-name'>Nick Name</InputLabel>
                    <TextField
                      fullWidth
                      id='nick-name'
                      value={values.nickName}
                      name='first_name'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder='Nick Name'
                      InputProps={{
                        readOnly: true
                      }}
                    />
                    {touched.nickName && errors.nickName && (
                      <FormHelperText error id='first-name-helper'>
                        {errors.nickName}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor='email'>Email Address</InputLabel>
                    <TextField
                      type='email'
                      fullWidth
                      value={values.email}
                      name='email'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id='personal-email'
                      placeholder='Email Address'
                      InputProps={{
                        readOnly: true
                      }}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id='personal-email-helper'>
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={0} sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor='phone-number'>Phone Number</InputLabel>
                    <TextField
                      fullWidth
                      id='phone-number'
                      value={values.phoneNumber}
                      name='phoneNumber'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder='Phone Number'
                      InputProps={{
                        readOnly: true
                      }}
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <FormHelperText error id='last-name-helper'>
                        {errors.phoneNumber}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={0} sm={3}></Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

ProfilePage.acl = {
  action: 'read',
  subject: 'user-page'
};

export default ProfilePage;
