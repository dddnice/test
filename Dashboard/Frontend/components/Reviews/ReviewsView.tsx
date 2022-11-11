import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import BaseTooltip from 'components/BaseComponents/BaseTooltip';
import {useStores} from 'hooks/useStores';
import {boldWeight, font_medium, font_huge, regularWeight} from 'theme/fonts';
import {ReactComponent as Info} from 'assets/icons_refactor/Wizard/info-outlined.svg';
import Consts from 'pages/Dashboard/DashboardConsts';

const {TOOLTIP_REVIEWED, TOOLTIP_YOU_REVIEWED, REVIEWS, MY_PROJECTS_REVIEWS, PROJECTS_REVIEWED_BY_ME} = Consts;

interface TitlesValues {
  title: string;
  tooltip: string;
}

interface Titles {
  [key: string]: TitlesValues;
}

const ReviewsView: FC = observer(() => {
  const {
    dashboardStore: {reviewer},
  } = useStores();

  const getTitle = useCallback((key: string) => {
    const titles: Titles = {
      reviewed_projects: {
        title: MY_PROJECTS_REVIEWS,
        tooltip: TOOLTIP_REVIEWED,
      },
      projects_reviewed_by_user: {
        title: PROJECTS_REVIEWED_BY_ME,
        tooltip: TOOLTIP_YOU_REVIEWED,
      },
    };

    return titles?.[key] || {title: '', tooltip: ''};
  }, []);

  return (
    <Wrapper>
      <Title>{REVIEWS}</Title>
      <Content>
        <QualityBlock>
          {reviewer?.map(({key, value}) => (
            <QualityItem key={key}>
              {getTitle(key).tooltip && (
                <InfoTooltip title={getTitle(key).tooltip}>
                  <InfoIcon icon={Info} />
                </InfoTooltip>
              )}
              <QualityItemValue>{value}</QualityItemValue>
              {getTitle(key).title}
            </QualityItem>
          ))}
        </QualityBlock>
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
  }
`;

const QualityBlock = styled.div`
  display: flex;
  justify-content: center;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    justify-content: space-between;
  }
`;

const QualityItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.colors.grey000};
  border: 1px solid ${({theme}) => theme.colors.grey050};
  border-radius: 13px;
  max-width: 100px;
  margin: 0 5px;
  padding: 12px;
  ${font_medium};
  line-height: 17px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    max-width: inherit;
    width: 48%;
    margin: 0;
  }
`;

const QualityItemValue = styled.div`
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

export default ReviewsView;
