import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseTooltip from 'components/BaseComponents/BaseTooltip';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import BaseLink from 'components/BaseComponents/BaseLink';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useStores} from 'hooks/useStores';
import useConfig from 'hooks/useConfig';
import {useUser} from 'context/UserData';
import {ProgressSubData} from 'pages/Dashboard/DashboardUtils';
import {Leveling} from 'store/pages/dashboardStore';
import {font_header_xsmall, font_large, font_medium, font_small, regularWeight} from 'theme/fonts';
import {ReactComponent as Info} from 'assets/icons_refactor/Wizard/info-outlined.svg';
import {ReactComponent as Close} from 'assets/icons_refactor/Client/close.svg';
import {ReactComponent as Bell} from 'assets/icons_refactor/dashboard/bell.svg';
import {ReactComponent as DoneIcon} from 'assets/icons_refactor/dashboard/progress/done.svg';
import {ReactComponent as UndoneIcon} from 'assets/icons_refactor/dashboard/progress/undone.svg';
import {ReactComponent as WaitingIcon} from 'assets/icons_refactor/dashboard/progress/waiting.svg';
import Consts from 'pages/Dashboard/DashboardConsts';

const {
  ACHIEVE_GOALS,
  PROFESSIONAL_CONDUCT,
  PROGRESS_LEVELS,
  PROJECTS_DELIVERED,
  QUALITY,
  RESPONSE_RATE,
  ON_TIME_DELIVERY,
  TRANSLATION_VOLUME,
  TOOLTIP_QUALITY,
  TOOLTIP_CONDUCT,
  TOOLTIP_DELIVERED,
  TOOLTIP_DELIVERY,
  TOOLTIP_VOLUME,
  REPLY_NEEDED,
  SHOW_ME,
  PROJECTS_INFLUENCED,
  PROJECTS_REQUIRE,
  REMOVE_FROM_COUNT,
  SCORE,
  TYPE,
  DATE,
  PROJECT,
  TOOLTIP_RESPONSE,
} = Consts;

const ProgressView: FC = observer(() => {
  const {
    dashboardStore: {
      leveling,
      transProjectsRequired,
      projectsRequired,
      removedProjects,
      getProjectsAffectedData,
      postRejectedProjectData,
    },
  } = useStores();
  const {userData} = useUser();
  const {
    config: {companyName},
  } = useConfig();
  const [levelingData, setLevelingData] = useState<ProgressSubData[] | null | undefined>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  const processingData = useCallback((leveling: Leveling, companyName: string): ProgressSubData[] | null => {
    return leveling && Object.keys(leveling)?.length
      ? [
          {
            title: QUALITY,
            done: leveling.trans_leveling_quality_average >= leveling.next_level_conditions.QualityFrom ? 1 : 0,
            text: TOOLTIP_QUALITY,
            nextLevel: String(leveling.next_level_conditions.QualityFrom),
            percents: (100 * leveling.trans_leveling_quality_average) / leveling.next_level_conditions.QualityFrom,
            key: 'trans_leveling_quality_average',
          },
          {
            title: RESPONSE_RATE,
            done: leveling.trans_leveling_response_rate >= leveling.next_level_conditions.ResponseRate ? 1 : 0,
            text: TOOLTIP_RESPONSE(companyName),
            nextLevel: `${leveling.next_level_conditions.ResponseRate}%`,
            percents: leveling.trans_leveling_response_rate,
            key: 'trans_leveling_response_rate',
          },
          {
            title: PROFESSIONAL_CONDUCT,
            done: leveling.trans_leveling_admin_score >= leveling.next_level_conditions.Conduct ? 1 : 0,
            text: TOOLTIP_CONDUCT,
            nextLevel: `${leveling.trans_leveling_admin_score} / ${leveling.next_level_conditions.Conduct}`,
            percents: (100 * leveling.trans_leveling_admin_score) / leveling.next_level_conditions.Conduct,
            key: 'trans_leveling_admin_score',
          },
          {
            title: ON_TIME_DELIVERY,
            done: leveling.trans_leveling_on_time_delivery >= leveling.next_level_conditions.DeliveryTime ? 1 : 0,
            text: TOOLTIP_DELIVERY,
            nextLevel: `${leveling.next_level_conditions.DeliveryTime}%`,
            percents: leveling.trans_leveling_on_time_delivery,
            key: 'trans_leveling_on_time_delivery',
          },
          {
            title: TRANSLATION_VOLUME,
            done: leveling.trans_leveling_completed_word_count >= leveling.next_level_conditions.Wc ? 1 : 0,
            text: TOOLTIP_VOLUME,
            nextLevel: `${leveling.trans_leveling_completed_word_count} / ${leveling.next_level_conditions.Wc}`,
            percents: (100 * leveling.trans_leveling_completed_word_count) / leveling.next_level_conditions.Wc,
            isVolume: true,
          },
          {
            title: PROJECTS_DELIVERED,
            done:
              leveling.trans_leveling_projects_delivered >= leveling.next_level_conditions.ProjectsDelivered ? 1 : 0,
            text: TOOLTIP_DELIVERED,
            nextLevel: `${leveling.trans_leveling_projects_delivered} / ${leveling.next_level_conditions.ProjectsDelivered}`,
            percents:
              (100 * leveling.trans_leveling_projects_delivered) / leveling.next_level_conditions.ProjectsDelivered,
            isVolume: true,
          },
        ]
      : null;
  }, []);

  useEffect(() => {
    const processedData: ProgressSubData[] | null = processingData(leveling, companyName);
    setLevelingData(processedData);
  }, [companyName, leveling, processingData]);

  const volumeIcon = useCallback((isVolume: boolean) => (isVolume ? WaitingIcon : UndoneIcon), []);

  const onShowProjects = useCallback(
    (type: string) => {
      userData?.uuid && getProjectsAffectedData(userData?.uuid, type);
      setOpenModal(true);
      setModalType(type);
    },
    [getProjectsAffectedData, userData?.uuid]
  );

  const handleClose = useCallback(() => {
    setOpenModal(false);
  }, []);

  const onRemoveProject = useCallback(
    (project_id: number) => {
      postRejectedProjectData(project_id);
    },
    [postRejectedProjectData]
  );

  return (
    <Wrapper>
      <Title>{ACHIEVE_GOALS}</Title>
      <Content>
        <Subtitle>{PROGRESS_LEVELS}</Subtitle>
        <Grid container>
          {levelingData?.map(({done, title, text, percents, nextLevel, isVolume, key = ''}, index) => (
            <Grid item xs={12} md={6} key={index}>
              <ProgressBlock odd={index % 2 === 0}>
                <ProgressBarHeader>
                  <ProgressIcon icon={done ? DoneIcon : volumeIcon(isVolume as boolean)} />
                  <div>
                    {title}
                    {key && userData?.isAdmin && <ShowLink onClick={() => onShowProjects(key)}>{SHOW_ME}</ShowLink>}
                  </div>
                  <InfoTooltip title={text || ''}>
                    <InfoIcon icon={Info} />
                  </InfoTooltip>
                  {title === 'Response rate' && !!transProjectsRequired?.length && (
                    <BellIcon icon={Bell} title={REPLY_NEEDED} onClick={() => onShowProjects('response_required')} />
                  )}
                </ProgressBarHeader>
                <ProgressBar>
                  <ProgressBarLine width={percents || 0} className={isVolume ? 'volume' : ''} done={Boolean(done)} />
                </ProgressBar>
                <ProgressBarFooter>{nextLevel}</ProgressBarFooter>
              </ProgressBlock>
            </Grid>
          ))}
        </Grid>
        <Dialog onClose={handleClose} open={openModal} maxWidth="lg">
          <ModalTitle>
            {modalType === 'response_required' ? PROJECTS_REQUIRE : PROJECTS_INFLUENCED}
            <CloseIcon icon={Close} onClick={() => setOpenModal(false)} />
          </ModalTitle>
          {modalType === 'response_required'
            ? transProjectsRequired?.map(({url, project_id}) => (
                <ProjectItem key={project_id}>
                  <div>
                    {PROJECT}
                    <BaseLink href={url} target="_blank">
                      #{project_id}
                    </BaseLink>
                  </div>
                </ProjectItem>
              ))
            : projectsRequired?.map(({rating, type, date, url, project_id}) => {
                if (!removedProjects.includes(project_id)) {
                  return (
                    <ProjectItem key={project_id}>
                      <div>
                        {`${SCORE}: ${rating}; ${TYPE}: ${type}; ${DATE}: ${date}; ${PROJECT}: `}
                        <BaseLink href={url} target="_blank">
                          #{project_id}
                        </BaseLink>
                      </div>
                      <RemoveProject onClick={() => onRemoveProject(project_id)}>{REMOVE_FROM_COUNT}</RemoveProject>
                    </ProjectItem>
                  );
                }
              })}
        </Dialog>
      </Content>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  padding: 16px 24px;
  margin-bottom: 10px;
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

const ProgressBlock = styled.div<{odd?: boolean}>`
  padding: ${({odd}) => `${odd ? '0 8px 0 0' : '0 0 0 8px '}`};
  margin-bottom: 50px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    margin-bottom: 20px;
    padding: 0;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 11px;
  background-color: ${({theme}) => theme.colors.grey000};
  border: 1px solid ${({theme}) => theme.colors.grey050};
  border-radius: 30px;
  position: relative;
`;

const ProgressBarLine = styled.div<{width: number; done?: boolean}>`
  height: 11px;
  width: ${({width}) => `${width}%`};
  max-width: 100%;
  min-width: 3%;
  background-color: ${({
    done,
    theme: {
      colors: {green070, red100},
    },
  }) => `${done ? green070 : red100}`};
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 30px;
  position: absolute;
  top: -1px;

  &.volume {
    background-color: ${({
      done,
      theme: {
        colors: {green070, yellow090},
      },
    }) => `${done ? green070 : yellow090}`};
  }
`;

const ProgressBarFooter = styled.div`
  text-align: right;
  ${font_medium};
  padding-top: 5px;
`;

const ProgressBarHeader = styled.div`
  display: flex;
  ${font_large};
  margin-bottom: 10px;
`;

const ProjectItem = styled.div`
  display: flex;
  ${font_large};
  padding: 6px 0;
  align-items: baseline;
  justify-content: space-between;

  & > div {
    text-transform: capitalize;
  }
`;

const RemoveProject = styled.div`
  background-color: ${({theme}) => theme.colors.red050};
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
  margin-left: 10px;
  cursor: pointer;
`;

const ProgressIcon = styled(BaseIcon)`
  fill: none;
  width: 24px;
  height: 24px;
  margin-right: 11px;
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

const ModalTitle = styled(DialogTitle)`
  padding: 10px 30px 20px 0;

  h2 {
    ${font_header_xsmall};
  }
`;

const BellIcon = styled(BaseIcon)`
  width: 24px;
  height: 24px;
  opacity: 0.87;
  left: 15px;
  position: relative;
  top: 3px;
  fill: ${({theme}) => theme.colors.grey085};
  cursor: pointer;
`;

const CloseIcon = styled(BaseIcon).attrs({boxH: 12, boxW: 12})`
  width: 13px;
  height: 13px;
  opacity: 0.87;
  fill: ${({theme}) => theme.colors.grey100};
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 13px;
`;

const InfoTooltip = styled(BaseTooltip)`
  display: inline-block;
`;

const ShowLink = styled.span`
  display: block;
  ${font_small};
  color: ${({theme}) => theme.colors.grey080};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

export default ProgressView;
