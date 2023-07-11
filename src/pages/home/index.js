import { Box, Container, Typography, Grid } from '@mui/material';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

import Icon from 'src/@core/components/icon';

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical';

import { useAuth } from 'src/hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <ApexChartWrapper>
      <Container>
        <Typography variant='h4'>Home</Typography>
        <Box sx={{ p: 3, m: 3 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={6} sx={{ order: 0 }}>
              <CardStatisticsVerticalComponent
                stats={user.lines.length}
                color='info'
                trendNumber=''
                title='Phone Numbers'
                subtitle=''
                icon={<Icon icon='mdi:phone' />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{ order: 0 }}>
              <CardStatisticsVerticalComponent
                stats={user?.messages?.length}
                color='success'
                title='Messages'
                trendNumber=' '
                subtitle=''
                icon={<Icon icon='mdi:message' />}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ApexChartWrapper>
  );
};

HomePage.acl = {
  action: 'read',
  subject: 'user-page'
};

export default HomePage;
