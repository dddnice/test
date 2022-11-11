import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import {useStores} from 'hooks/useStores';
import {boldWeight, font_medium} from 'theme/fonts';
import {ReactComponent as Close} from 'assets/icons_refactor/Client/close.svg';
import Consts from 'pages/Dashboard/DashboardConsts';

const {ATTENTION, PLEASE_DELIVER, PROJECT, ASAP} = Consts;

export interface BannersInterface {
  expiration_seconds: boolean;
  formatted_time: string;
  prefix: string;
  project_id: number;
}

const Banners: FC = observer(() => {
  const {
    dashboardStore: {myProjects},
  } = useStores();
  const [banners, setBanners] = useState<BannersInterface[]>([]);

  const removeBanner = useCallback(
    (id: number) => {
      setBanners(banners.filter(({project_id}) => project_id !== id));
    },
    [banners]
  );

  useEffect(() => {
    setBanners(myProjects);
  }, [myProjects]);

  return (
    <Wrapper>
      {banners?.map(({project_id, prefix}) => (
        <Banner key={project_id}>
          <BoldText>{ATTENTION}</BoldText>
          {PLEASE_DELIVER}
          <a href={`/project/${prefix}${project_id}`}>{`${PROJECT} #${project_id}`}</a>
          <BoldText>{ASAP}</BoldText>
          <CloseIcon icon={Close} onClick={() => removeBanner(project_id)} />
        </Banner>
      ))}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  background-color: ${({theme}) => theme.colors.yellow100};
`;

const Banner = styled.div`
  position: relative;
  max-width: 1000px;
  margin: auto;
  padding: 6px 20px;
  ${font_medium};

  a {
    color: ${({theme}) => theme.colors.grey100};
    text-decoration: underline;
  }
`;

const BoldText = styled.span`
  ${boldWeight};
`;

const CloseIcon = styled(BaseIcon)`
  top: 11px;
  right: 10px;
  width: 16px;
  height: 16px;
  position: absolute;

  &:hover {
    cursor: pointer;
  }
`;

export default Banners;
