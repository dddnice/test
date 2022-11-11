import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseTooltip from 'components/BaseComponents/BaseTooltip';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import BaseButton from 'components/BaseComponents/BaseButton';
import BaseImage from 'components/BaseComponents/BaseImage';
import BaseSeparatorLine from 'components/BaseComponents/BaseSeparatorLine';
import {useUser} from 'context/UserData';
import {useStores} from 'hooks/useStores';
import {font_large, font_header_xsmall, font_medium, boldWeight, font_huge} from 'theme/fonts';
import {ReactComponent as CertifiedIcon} from 'assets/icons_refactor/dashboard/certified.svg';
import {ReactComponent as ApprovedIcon} from 'assets/icons_refactor/dashboard/trans_badges/approved.svg';
import {ReactComponent as BlandStuffIcon} from 'assets/icons_refactor/dashboard/trans_badges/blend-stuff.svg';
import {ReactComponent as EliteIcon} from 'assets/icons_refactor/dashboard/trans_badges/elite.svg';
import {ReactComponent as ExclusiveIcon} from 'assets/icons_refactor/dashboard/trans_badges/exclusive.svg';
import {ReactComponent as ExpertIcon} from 'assets/icons_refactor/dashboard/trans_badges/expert.svg';
import {ReactComponent as ExternalIcon} from 'assets/icons_refactor/dashboard/trans_badges/external-vendor.svg';
import {ReactComponent as FacebookIcon} from 'assets/icons_refactor/dashboard/trans_badges/facebook.svg';
import {ReactComponent as FastIcon} from 'assets/icons_refactor/dashboard/trans_badges/fast-response.svg';
import {ReactComponent as LLIcon} from 'assets/icons_refactor/dashboard/trans_badges/language-leader.svg';
import {ReactComponent as LEIcon} from 'assets/icons_refactor/dashboard/trans_badges/language-editor.svg';
import {ReactComponent as PhoneIcon} from 'assets/icons_refactor/dashboard/trans_badges/phone-verified.svg';
import {ReactComponent as ProofreaderIcon} from 'assets/icons_refactor/dashboard/trans_badges/proofreader.svg';
import {ReactComponent as ReviewerIcon} from 'assets/icons_refactor/dashboard/trans_badges/reviewer.svg';
import {ReactComponent as SocialIcon} from 'assets/icons_refactor/dashboard/trans_badges/social-active.svg';
import {ReactComponent as EditorIcon} from 'assets/icons_refactor/dashboard/trans_badges/translator-editor.svg';
import {ReactComponent as UnlockedIcon} from 'assets/icons_refactor/dashboard/trans_badges/unlocked.svg';
import {ReactComponent as Hint} from 'assets/icons_refactor/hint.svg';
import Consts from 'pages/Dashboard/DashboardConsts';

const {
  CERTIFICATE_CONST,
  HI,
  BLENDER_SINCE,
  ACTIVE,
  INACTIVE,
  ACTIVATE_MY_ACCOUNT,
  MY_BADGES,
  TRANSLATOR_STATUS,
  RECRUITMENT_IS_NOT_ACTIVE,
  RECRUITMENT_FAQ,
  UNLOCKED,
} = Consts;

interface BadgesIcon {
  [key: string]: FC;
}

const InfoView: FC = observer(() => {
  const {userData} = useUser();
  const {
    dashboardStore: {
      translator_info: {member_since, inactive, status, last_updated, medals, isRecruitment},
      translator_id,
      postDashboardTransActiveData,
    },
  } = useStores();

  const getBadgeIcon = useCallback((badge: string) => {
    const badges: BadgesIcon = {
      trans_editor: EditorIcon,
      trans_phone_verified: PhoneIcon,
      trans_proofreader: ProofreaderIcon,
      trans_expert: ExpertIcon,
      trans_exclusive: ExclusiveIcon,
      is_language_leader: LLIcon,
      trans_facebook: FacebookIcon,
      trans_reviewer: ReviewerIcon,
      ohtstaff: BlandStuffIcon,
      trans_approved: ApprovedIcon,
      trans_elite: EliteIcon,
      trans_fast_response: FastIcon,
      trans_social_active: SocialIcon,
      language_editor: LEIcon,
      trans_external: ExternalIcon,
      trans_unlocked: UnlockedIcon,
    };
    return badges?.[badge] || null;
  }, []);

  const convertDate = useCallback(
    (timestamp: string) => new Date(Number(timestamp) * 1000).toLocaleDateString('ro-RO'),
    []
  );

  const onActivateAccount = useCallback(() => {
    postDashboardTransActiveData('0', userData?.csrftoken || '');
  }, [postDashboardTransActiveData, userData?.csrftoken]);

  const getBadgesCount = useCallback(
    () => medals?.filter(({flag}) => getBadgeIcon(flag))?.length,
    [getBadgeIcon, medals]
  );

  return (
    <Wrapper>
      <WrapperInner>
        <UserBlock>
          <UserPic src={userData?.thumb?.src} />
          <UserInfo data-qa-auto="dashboard-user-info">
            {HI},<UserName data-qa-auto="dashboard-user-name">{userData?.name}</UserName>
            <UserId data-qa-auto="dashboard-user-id">ID #{userData?.id}</UserId>
            <UserId data-qa-auto="dashboard-blender-since-date">
              {BLENDER_SINCE} {convertDate(member_since)}
            </UserId>
            <div>
              {inactive ? (
                <>
                  <UserStatusInactive data-qa-auto="dashboard-user-inactive">{INACTIVE}</UserStatusInactive>
                  <ActivateButton onClick={onActivateAccount}>{ACTIVATE_MY_ACCOUNT}</ActivateButton>
                </>
              ) : (
                <UserStatusActive data-qa-auto="dashboard-user-active">{ACTIVE}</UserStatusActive>
              )}
            </div>
          </UserInfo>
        </UserBlock>
        <Separator />
        <BadgesBlock data-qa-auto="dashboard-badges-block">
          {MY_BADGES}
          <Badges>
            {getBadgesCount() ? (
              medals?.map(
                ({flag, title}) =>
                  getBadgeIcon(flag) && <BadgeIcon icon={getBadgeIcon(flag)} title={title} key={flag} />
              )
            ) : (
              <BadgeIcon icon={UnlockedIcon} title={UNLOCKED} />
            )}
          </Badges>
        </BadgesBlock>
        <Separator />
        <StatusBlock>
          {status === 'certified' ? (
            <CertifiedBlock data-qa-auto="dashboard-certified-block">
              <CertifiedDate>{convertDate(last_updated)}</CertifiedDate>
              <CertifiedId>#{CERTIFICATE_CONST + translator_id}</CertifiedId>
              <Certified boxW={136} boxH={137} icon={CertifiedIcon} />
            </CertifiedBlock>
          ) : (
            <>
              {TRANSLATOR_STATUS}
              <Status data-qa-auto="dashboard-pending-user-status">{status}</Status>
            </>
          )}
          {!isRecruitment && (
            <RecruitmentBlock data-qa-auto="dashboard-recruitment-info-block">
              {RECRUITMENT_IS_NOT_ACTIVE}
              <InfoTooltip title={RECRUITMENT_FAQ}>
                <InfoIcon icon={Hint} />
              </InfoTooltip>
            </RecruitmentBlock>
          )}
        </StatusBlock>
      </WrapperInner>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  margin-bottom: 30px;
  background-color: ${({theme}) => theme.colors.grey000};
  box-shadow: 0 4px 14px ${({theme}) => theme.colors.grey060};
`;

const WrapperInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 31px 24px;
  max-width: 1000px;
  margin: auto;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    padding: 24px;
    flex-wrap: wrap;
  }
`;

const CertifiedBlock = styled.div`
  position: relative;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    order: 2;
    width: 120px;
  }
`;

const CertifiedDate = styled.div`
  position: absolute;
  font-size: 7px;
  left: 0;
  top: 47px;
  width: 100%;
  text-align: center;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    font-size: 6px;
    top: 42px;
  }
`;

const CertifiedId = styled.div`
  position: absolute;
  font-size: 7px;
  left: 0;
  top: 81px;
  width: 100%;
  text-align: center;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    font-size: 6px;
    top: 73px;
  }
`;

const Certified = styled(BaseIcon)`
  width: 136px;
  height: 137px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    width: 120px;
    height: 120px;
  }
`;

const Separator = styled(BaseSeparatorLine)`
  background-color: ${({theme}) => theme.colors.grey050};
  align-self: stretch;
  height: auto;
  margin: 0 30px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    display: none;
  }
`;

const UserBlock = styled.div`
  display: flex;
  align-items: center;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    order: 1;
    width: min-content;
  }
`;

const BadgesBlock = styled.div`
  @media ${({theme}) => theme.breakpoints.maxMd} {
    order: 3;
    width: 100%;
    border-top: 1px solid ${({theme}) => theme.colors.grey050};
    padding-top: 20px;
    margin-top: 20px;
  }
`;

const Badges = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const BadgeIcon = styled(BaseIcon)`
  width: 34px;
  height: 45px;
  margin: 5px 10px 5px 0;
`;

const UserInfo = styled.div`
  ${font_large};
`;

const UserName = styled.div`
  ${font_header_xsmall};
  margin-bottom: 5px;
`;

const UserId = styled.div`
  ${font_medium};
  color: ${({theme}) => theme.colors.grey070};
`;

const UserStatusActive = styled.div`
  display: inline-block;
  ${font_medium};
  color: ${({theme}) => theme.colors.grey100};
  background-color: ${({theme}) => theme.colors.celery050};
  margin-top: 15px;
  padding: 2px 8px;
  border-radius: 20px;
  text-align: center;
`;

const UserStatusInactive = styled.div`
  display: inline-block;
  ${font_medium};
  color: ${({theme}) => theme.colors.grey100};
  background-color: ${({theme}) => theme.colors.red100};
  margin-top: 15px;
  padding: 2px 8px;
  border-radius: 20px;
  text-align: center;
`;

const ActivateButton = styled(BaseButton)`
  display: inline-block;
  margin-left: 5px;
  background-color: transparent;

  span {
    text-decoration: underline;
  }

  &:hover {
    background-color: transparent;

    span {
      text-decoration: none;
    }
  }
`;

const UserPic = styled(BaseImage)`
  width: 92px;
  margin-right: 24px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    width: 63px;
  }
`;

const StatusBlock = styled.div`
  ${font_medium};
`;

const Status = styled.div`
  ${font_huge};
  ${boldWeight};
  text-transform: capitalize;
`;

const RecruitmentBlock = styled.div`
  display: flex;
  background-color: ${({theme}) => theme.colors.red050};
  padding: 6px 10px;
  border-radius: 8px;
  margin-top: 10px;
`;

const InfoTooltip = styled(BaseTooltip)`
  display: block;
`;

const InfoIcon = styled(BaseIcon).attrs({boxW: 16, boxH: 16})`
  width: 16px;
  height: 16px;
  opacity: 0.87;
  left: 5px;
  position: relative;
  top: -1px;
  fill: ${({theme}) => theme.colors.grey100};
`;

export default InfoView;
