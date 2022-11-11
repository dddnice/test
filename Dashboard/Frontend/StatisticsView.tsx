import React, {ReactNode, FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import Info from './components/Info/InfoView';
import Banners from './components/Banners/Banners';
import Performance from './components/Performance/PerformanceView';
import Progress from './components/Progress/ProgressView';
import Delivery from './components/Delivery/DeliveryView';
import Quality from './components/Quality/QualityView';
import Reviews from './components/Reviews/ReviewsView';
import Grid, {GridSize} from '@material-ui/core/Grid';
import {useStores} from 'hooks/useStores';
import {useUser} from 'context/UserData';

interface Block {
  component: ReactNode;
  xs: GridSize;
  md: GridSize;
}

const StatisticsView: FC = observer(() => {
  const {
    dashboardStore: {
      getDashboardStatisticsData,
      getDashboardAdditionalData,
      getProjectsAffectedData,
      checkRecruitment,
      leveling,
    },
  } = useStores();
  const {userData} = useUser();

  useEffect(
    () => {
      getDashboardStatisticsData();
      getDashboardAdditionalData();
      checkRecruitment();
      userData?.uuid && getProjectsAffectedData(userData?.uuid, 'response_required');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getBlocks = useCallback(
    (): Block[] =>
      leveling
        ? [
            {
              component: <Performance />,
              xs: 12,
              md: 12,
            },
            {
              component: <Progress />,
              xs: 12,
              md: 7,
            },
            {
              component: <Delivery />,
              xs: 12,
              md: 5,
            },
            {
              component: <Quality />,
              xs: 12,
              md: 6,
            },
            {
              component: <Reviews />,
              xs: 12,
              md: 6,
            },
          ]
        : [
            {
              component: <Delivery />,
              xs: 12,
              md: 6,
            },
            {
              component: (
                <>
                  <Quality />
                  <Reviews />
                </>
              ),
              xs: 12,
              md: 6,
            },
          ],
    [leveling]
  );

  return (
    <Wrapper>
      <Banners />
      <Info />
      <WrapperInner>
        <Grid container>
          {getBlocks().map(({component, xs, md}, index) => (
            <Grid item xs={xs} md={md} key={index}>
              {component}
            </Grid>
          ))}
        </Grid>
      </WrapperInner>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  padding-bottom: 50px;
`;

const WrapperInner = styled.div`
  padding-bottom: 50px;
  max-width: 1000px;
  margin: auto;
`;

export default StatisticsView;
