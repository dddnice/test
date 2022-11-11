import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import BaseTooltip from 'components/BaseComponents/BaseTooltip';
import {useStores} from 'hooks/useStores';
import {LevelingDataType} from 'pages/Dashboard/DashboardUtils';
import {Leveling} from 'store/pages/dashboardStore';
import {boldWeight, font_header_xsmall, mediumFontSize, regularWeight, font_large, font_medium} from 'theme/fonts';
import {ReactComponent as BronzeIcon} from 'assets/icons_refactor/dashboard/trans_level/bronze.svg';
import {ReactComponent as SilverIcon} from 'assets/icons_refactor/dashboard/trans_level/silver.svg';
import {ReactComponent as GoldIcon} from 'assets/icons_refactor/dashboard/trans_level/gold.svg';
import {ReactComponent as DiamondIcon} from 'assets/icons_refactor/dashboard/trans_level/diamond.svg';
import {ReactComponent as Info} from 'assets/icons_refactor/Wizard/info-outlined.svg';
import checkmark from 'assets/icons_refactor/dashboard/checkIcon.svg';
import Consts from 'pages/Dashboard/DashboardConsts';

const {BRONZE, SILVER, GOLD, DIAMOND, TOOLTIP_DAYS, PERFORMANCE_BOARD, DAYS, MY_CIRCLE, MY_LEVEL} = Consts;

interface Levels {
  [key: number]: string;
}

interface LevelsIcon {
  [key: string]: FC;
}

interface Shifts {
  [key: number]: string;
}

const PerformanceView: FC = observer(() => {
  const {
    dashboardStore: {leveling},
  } = useStores();
  const [levelingData, setLevelingData] = useState<LevelingDataType | null | undefined>(null);

  const getLevelName = useCallback((level: number) => {
    const levels: Levels = {
      0: BRONZE,
      1: BRONZE,
      2: SILVER,
      3: GOLD,
      5: DIAMOND,
    };

    return levels?.[level];
  }, []);

  const processingData = useCallback(
    (leveling: Leveling): LevelingDataType | null => {
      const currentLevel = leveling?.current_level || 0;

      return leveling && Object.keys(leveling)?.length
        ? {
            progress: {
              currentLevel: leveling?.current_level,
              silver: currentLevel > 1,
              gold: currentLevel > 2,
              diamond: currentLevel > 4,
            },
            currentLevelName: getLevelName(currentLevel),
            potentialLevelName: getLevelName(leveling?.potential_level),
            days: {
              number: leveling.number_of_days,
              period: 30,
              percents: (100 * leveling.number_of_days) / 30,
            },
          }
        : null;
    },
    [getLevelName]
  );

  const getLevelIcon = useCallback((levelName: string) => {
    const levels: LevelsIcon = {
      [BRONZE]: BronzeIcon,
      [SILVER]: SilverIcon,
      [GOLD]: GoldIcon,
      [DIAMOND]: DiamondIcon,
    };

    return levels?.[levelName];
  }, []);

  const getDaysLeft = useCallback(() => {
    const daysLeft = 30 - (levelingData?.days?.number || 0);
    return daysLeft > 0 ? daysLeft : 0;
  }, [levelingData]);

  const isGoldPotential =
    (levelingData?.currentLevelName === GOLD && levelingData?.potentialLevelName === DIAMOND) ||
    (levelingData?.currentLevelName === DIAMOND && levelingData?.potentialLevelName === GOLD);

  const isSilverPotential =
    (levelingData?.currentLevelName === SILVER && levelingData?.potentialLevelName === GOLD) ||
    (levelingData?.currentLevelName === GOLD && levelingData?.potentialLevelName === SILVER);

  const getLevelingData = useCallback(() => {
    return [
      {
        title: BRONZE,
        pointPotential: true,
        linePotential:
          (levelingData?.potentialLevelName === SILVER && levelingData?.currentLevelName !== GOLD) ||
          levelingData?.potentialLevelName === BRONZE,
        pointDone: true,
        lineDone: levelingData?.progress?.silver,
      },
      {
        title: SILVER,
        pointPotential: isSilverPotential,
        linePotential: isSilverPotential,
        pointDone: levelingData?.progress?.silver,
        lineDone: levelingData?.progress?.gold,
      },
      {
        title: GOLD,
        pointPotential: levelingData?.potentialLevelName === GOLD,
        linePotential: isGoldPotential,
        pointDone: levelingData?.progress?.gold,
        lineDone: levelingData?.progress?.diamond,
      },
      {
        title: DIAMOND,
        pointPotential: levelingData?.potentialLevelName === DIAMOND,
        linePotential: isGoldPotential,
        pointDone: levelingData?.progress?.diamond,
        lineDone: levelingData?.progress?.diamond,
      },
    ];
  }, [levelingData, isGoldPotential, isSilverPotential]);

  useEffect(() => {
    const processedData: LevelingDataType | null = processingData(leveling);
    setLevelingData(processedData);
  }, [leveling, processingData]);

  const getShift = useCallback((key: number) => {
    const shifts: Shifts = {
      0: '-35%',
      1: '-18%',
      2: '-15%',
      3: '-65%',
    };

    return shifts?.[key] || '0';
  }, []);

  return (
    <Wrapper>
      <Title>{PERFORMANCE_BOARD}</Title>
      <Content>
        <Circle>
          <CirclePie percents={levelingData?.days?.percents || 0}>
            <CirclePieContent>
              {levelingData?.days?.number} / {levelingData?.days?.period}
              <span>{DAYS}</span>
            </CirclePieContent>
          </CirclePie>

          <CircleText>
            {MY_CIRCLE}
            <CircleTextLeft>
              {getDaysLeft()} left
              <InfoTooltip title={TOOLTIP_DAYS} interactive>
                <InfoIcon icon={Info} />
              </InfoTooltip>
            </CircleTextLeft>
          </CircleText>
        </Circle>
        <ProgressBar title={Consts.TOOLTIP_BAR(levelingData?.potentialLevelName || '')}>
          {getLevelingData()?.map(({title, linePotential, pointPotential, pointDone, lineDone}, index) => (
            <div key={index}>
              <ProgressPoint potential={pointPotential} done={pointDone} shift={getShift(index)}>
                <span>{title}</span>
              </ProgressPoint>
              {title !== DIAMOND && <ProgressLine potential={linePotential} done={lineDone}></ProgressLine>}
            </div>
          ))}
        </ProgressBar>
        <LevelBlock>
          <LevelTitle>{MY_LEVEL}</LevelTitle>
          <LevelIcon icon={getLevelIcon(levelingData?.currentLevelName || '')} />
          <LevelTitle>{levelingData?.currentLevelName}</LevelTitle>
        </LevelBlock>
      </Content>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  padding: 16px 24px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 50px;
  background-color: ${({theme}) => theme.colors.grey000};
  border: 1px solid ${({theme}) => theme.colors.grey015};
  border-radius: 8px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    flex-wrap: wrap;
    padding: 28px 20px 18px;
    align-items: inherit;
  }
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

const Circle = styled.div`
  display: flex;
  align-items: center;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    order: 2;
    width: 50%;
    flex-direction: column;
  }
`;

const CirclePie = styled.div<{percents: number}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: conic-gradient(
    ${({
      theme: {
        colors: {yellow090, yellow050},
      },
      percents,
    }) => `${yellow090} ${percents}%, ${yellow050} ${percents}%`}
  );
  margin-right: 18px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    margin-right: 0;
    margin-bottom: 15px;
  }
`;

const CirclePieContent = styled.div`
  ${boldWeight};
  ${mediumFontSize};
  background-color: ${({theme}) => theme.colors.grey000};
  border-radius: 50%;
  width: 74px;
  height: 74px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  span {
    ${regularWeight};
  }
`;

const CircleText = styled.div`
  ${font_large};
`;

const CircleTextLeft = styled.div`
  ${font_header_xsmall};
`;

const ProgressBar = styled.div`
  display: flex;
  border-left: 3px solid ${({theme}) => theme.colors.grey030};
  border-right: 3px solid ${({theme}) => theme.colors.grey030};
  padding: 0 8%;
  align-self: stretch;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;

    @media ${({theme}) => theme.breakpoints.maxMd} {
      width: 30%;

      &:last-child {
        width: auto;
      }
    }
  }

  @media ${({theme}) => theme.breakpoints.maxMd} {
    order: 1;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid ${({theme}) => theme.colors.grey030};
    padding: 0 0 40px;
    margin-bottom: 20px;
    width: 100%;
    justify-content: space-between;
  }
`;

const ProgressPoint = styled.div<{done?: boolean; potential?: boolean; shift?: string}>`
  position: relative;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: 3px solid
    ${({
      done,
      theme: {
        colors: {blue100, grey050},
      },
      potential,
    }) => `${done || potential ? blue100 : grey050}`};
  background-color: ${({
    done,
    theme: {
      colors: {blue100, grey000},
    },
  }) => `${done ? blue100 : grey000}`};
  background-image: ${({done}) => `${done ? `url(${checkmark})` : ''}`};
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 100%;

  span {
    position: absolute;
    bottom: -25px;
    left: ${({shift}) => `${shift}`};
    ${font_medium};
    font-weight: 400;
    color: ${({
      done,
      theme: {
        colors: {grey100, grey070},
      },
    }) => `${done ? grey100 : grey070}`};
  }
`;

const ProgressLine = styled.div<{potential?: boolean; done?: boolean}>`
  height: 0;
  min-width: 75px;
  border-bottom: 1px
    ${({
      potential,
      theme: {
        colors: {blue100, grey050},
      },
      done,
    }) => `${potential ? 'dashed' : 'solid'} ${done || potential ? blue100 : grey050}`};
  margin: 0 2px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    min-width: 40px;
    width: 100%;
  }
`;

const LevelBlock = styled.div`
  text-align: center;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    order: 3;
    width: 50%;
    background-color: ${({theme}) => theme.colors.grey010};
    border-radius: 13px;
    padding-top: 10px;
  }
`;

const LevelTitle = styled.div`
  ${font_medium};

  @media ${({theme}) => theme.breakpoints.maxMd} {
    ${font_large};
  }
`;

const LevelIcon = styled(BaseIcon)`
  width: 53px;
  height: 53px;
  margin: 5px 0;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    width: 68px;
    height: 68px;
  }
`;

const InfoTooltip = styled(BaseTooltip)`
  display: inline-block;
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

export default PerformanceView;
