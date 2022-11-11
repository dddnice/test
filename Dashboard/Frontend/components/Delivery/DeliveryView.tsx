import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseTooltip from 'components/BaseComponents/BaseTooltip';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import {useStores} from 'hooks/useStores';
import {convertWordsToSeconds} from 'utils/modelParser';
import {boldWeight, font_header_xsmall, font_medium, regularWeight, font_huge} from 'theme/fonts';
import {ReactComponent as Info} from 'assets/icons_refactor/Wizard/info-outlined.svg';
import Consts from 'pages/Dashboard/DashboardConsts';

const {
  PROJECTS_IN_PROGRESS,
  PROJECTS_COMPLETED,
  PROJECTS_DELIVERED,
  PROGRESS_TRACKER,
  TOOLTIP_IN_PROGRESS,
  TOOLTIP_ABANDONED,
  TOOLTIP_REALLOCATED,
  TOOLTIP_WARNINGS,
  TRANSLATED_WORDS,
  PRIORITY_POINTS,
  ABANDONED_PROJECTS,
  ABANDONED_TIME,
  REALLOCATED_PROJECTS,
  WARNINGS,
  RELATIVE_RANK,
  TOOLTIP_RELATIVE_RANK,
  POINTS_TO_THE_NEXT_LEVEL,
  TOOLTIP_POINTS_TO_THE_NEXT_LEVEL,
} = Consts;

interface TitlesValues {
  title: string;
  tooltip: string;
}

interface Titles {
  [key: string]: TitlesValues;
}

const DeliveryView: FC = observer(() => {
  const {
    dashboardStore: {general},
  } = useStores();

  const getTitle = useCallback((key: string) => {
    const titles: Titles = {
      projects_in_progress: {
        title: PROJECTS_IN_PROGRESS,
        tooltip: TOOLTIP_IN_PROGRESS,
      },
      projects_completed: {
        title: PROJECTS_COMPLETED,
        tooltip: '',
      },
      translated_words: {
        title: TRANSLATED_WORDS,
        tooltip: '',
      },
      priority_points: {
        title: PRIORITY_POINTS,
        tooltip: '',
      },
      abandoned_projects: {
        title: ABANDONED_PROJECTS,
        tooltip: TOOLTIP_ABANDONED,
      },
      abandon_time: {
        title: ABANDONED_TIME,
        tooltip: '',
      },
      reallocated_projects: {
        title: REALLOCATED_PROJECTS,
        tooltip: TOOLTIP_REALLOCATED,
      },
      warnings_received: {
        title: WARNINGS,
        tooltip: TOOLTIP_WARNINGS,
      },
      relative_rank: {
        title: RELATIVE_RANK,
        tooltip: TOOLTIP_RELATIVE_RANK,
      },
      points_to_the_next_level: {
        title: POINTS_TO_THE_NEXT_LEVEL,
        tooltip: TOOLTIP_POINTS_TO_THE_NEXT_LEVEL,
      },
    };

    return titles?.[key] || {title: '', tooltip: ''};
  }, []);

  return (
    <Wrapper>
      <Title>{PROGRESS_TRACKER}</Title>
      <Content>
        <Subtitle>{PROJECTS_DELIVERED}</Subtitle>
        <DeliveryBlock>
          {general?.map(({key, value}) => (
            <DeliveryItem key={key}>
              {getTitle(key).tooltip && (
                <InfoTooltip title={getTitle(key).tooltip}>
                  <InfoIcon icon={Info} />
                </InfoTooltip>
              )}
              <DeliveryItemValue>{key === 'abandon_time' ? convertWordsToSeconds(value) : value}</DeliveryItemValue>
              {getTitle(key).title}
            </DeliveryItem>
          ))}
        </DeliveryBlock>
      </Content>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  padding: 16px 24px;
`;

const Content = styled.div`
  padding: 24px 20px;
  background-color: ${({theme}) => theme.colors.grey000};
  border: 1px solid ${({theme}) => theme.colors.grey015};
  border-radius: 8px;
`;

const Title = styled.div`
  ${regularWeight};
  color: ${({theme}) => theme.colors.grey085};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:after {
    content: '';
    border-bottom: 1px solid ${({theme}) => theme.colors.grey050};
    width: 100%;
    margin-left: 10px;

    @media ${({theme}) => theme.breakpoints.maxMd} {
      margin-left: 0;
      display: block;
      margin-top: 5px;
    }
  }

  @media ${({theme}) => theme.breakpoints.maxMd} {
    display: block;
  }
`;

const Subtitle = styled.div`
  ${font_header_xsmall};
  color: ${({theme}) => theme.colors.grey100};
  margin-bottom: 20px;
`;

const DeliveryBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &:after {
    content: '';
    flex: 1 1 100%;
    max-width: 31%;
  }
`;

const DeliveryItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.colors.grey000};
  border: 1px solid ${({theme}) => theme.colors.grey050};
  border-radius: 13px;
  width: 31%;
  min-height: 105px;
  margin-bottom: 10px;
  padding: 12px;
  ${font_medium};
  line-height: 17px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    width: 48%;
  }
`;

const DeliveryItemValue = styled.div`
  ${font_huge};
  ${boldWeight};
  margin-bottom: 7px;
`;

const InfoIcon = styled(BaseIcon)`
  width: 16px;
  height: 16px;
  opacity: 0.87;
  left: 5px;
  position: relative;
  top: -1px;
  fill: ${({theme}) => theme.colors.grey085};
`;

const InfoTooltip = styled(BaseTooltip)`
  display: block;
  position: absolute;
  top: 5px;
  right: 10px;
`;

export default DeliveryView;
