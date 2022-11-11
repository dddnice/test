import React, {FC, useMemo, useCallback, useEffect, useRef} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseImage from 'components/BaseComponents/BaseImage';
import Expertise from './components/Expertise';
import Category from './components/Category';
import Picture from './components/Picture';
import Linkedin from './components/Linkedin';
import Software from './components/Software';
import About from './components/About';
import {useStores} from 'hooks/useStores';
import {font_header_large, font_large, font_medium} from 'theme/fonts';
import banner from 'assets/images/initialregistration/step2.webp';
import Consts from './YourExpertiseConsts';

const {YOUR_EXPERTISE_TITLE, EXPERTISE, YOUR_EXPERTISE_DESCRIPTION, ADD_NEEDED_INFORMATION} = Consts;

const YourExpertiseStep: FC = observer(() => {
  const {
    initialRegistrationStore: {
      stepsData: {
        workingExpertises,
        workingExpertiseCategory,
        workingAvatar,
        workingLinkedin,
        softwareList,
        showFields,
        skippedFields,
      },
      errorsList,
    },
  } = useStores();

  const showCategory = useMemo(() => {
    return showFields?.includes('expertise') || workingExpertises?.length || false;
  }, [showFields, workingExpertises]);

  const showPicture = useMemo(() => {
    return showFields?.includes('expertise_category') || workingExpertiseCategory?.length || false;
  }, [showFields, workingExpertiseCategory]);

  const showLinkedin = useMemo(() => {
    return showFields?.includes('picture') || workingAvatar?.length || false;
  }, [showFields, workingAvatar]);

  const showSoftware = useMemo(() => {
    return showFields?.includes('linkedin') || workingLinkedin?.length || false;
  }, [showFields, workingLinkedin]);

  const showAbout = useMemo(
    () =>
      showFields?.includes('software') || softwareList?.filter((item: any) => item.selected === true)?.length || false,
    [showFields, softwareList]
  );

  const defaultRadioValue = useCallback(
    (fieldName: string) => (skippedFields?.includes(fieldName) ? '0' : '1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const showError = useCallback(
    (fieldName: string) => (errorsList[fieldName] ? ADD_NEEDED_INFORMATION : ''),
    [errorsList]
  );

  const expertiseRef = useRef<HTMLHeadingElement | null>(null);
  const categoryRef = useRef<HTMLHeadingElement | null>(null);
  const pictureRef = useRef<HTMLHeadingElement | null>(null);
  const linkedinRef = useRef<HTMLHeadingElement | null>(null);
  const softwareRef = useRef<HTMLHeadingElement | null>(null);
  const aboutRef = useRef<HTMLHeadingElement | null>(null);

  const scrollToError = useCallback((errorName: string) => {
    const target = {
      workingExpertises: expertiseRef,
      workingExpertiseCategory: categoryRef,
      workingLinkedin: linkedinRef,
      softwareList: softwareRef,
      workingAboutMe: aboutRef,
    } as any;

    window.scrollTo({top: target[errorName]?.current?.offsetTop, behavior: 'smooth'});
  }, []);

  useEffect(() => {
    const firstErrorName = Object.keys(errorsList)[0];
    firstErrorName && scrollToError(firstErrorName);
  }, [errorsList, scrollToError]);

  return (
    <MainWrapper>
      <Title>{YOUR_EXPERTISE_TITLE}</Title>
      <StepPhoto src={banner} alt="banner" />
      <SubTitle>{EXPERTISE}</SubTitle>
      <StepDescription>{YOUR_EXPERTISE_DESCRIPTION}</StepDescription>
      <Expertise
        defaultRadioValue={defaultRadioValue('workingExpertises')}
        showError={showError('workingExpertises')}
        elementRef={expertiseRef}
      />
      {showCategory && (
        <Category
          defaultRadioValue={defaultRadioValue('workingExpertiseCategory')}
          showError={showError('workingExpertiseCategory')}
          elementRef={categoryRef}
        />
      )}
      {showPicture && (
        <Picture
          defaultRadioValue={defaultRadioValue('workingAvatar')}
          showError={showError('workingAvatar')}
          elementRef={pictureRef}
        />
      )}
      {showLinkedin && (
        <Linkedin
          defaultRadioValue={defaultRadioValue('workingLinkedin')}
          showError={showError('workingLinkedin')}
          elementRef={linkedinRef}
        />
      )}
      {showSoftware && (
        <Software
          defaultRadioValue={defaultRadioValue('softwareList')}
          showError={showError('softwareList')}
          elementRef={softwareRef}
        />
      )}
      {showAbout && (
        <About
          defaultRadioValue={defaultRadioValue('workingAboutMe')}
          showError={showError('workingAboutMe')}
          elementRef={aboutRef}
        />
      )}
    </MainWrapper>
  );
});

const Title = styled.div`
  ${font_header_large};

  @media ${({theme}) => theme.breakpoints.maxMd} {
    ${font_large};
    text-align: center;
    margin: -50px 0 50px;
  }
`;

const SubTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StepPhoto = styled(BaseImage)`
  margin: 15px 0 40px;
`;

const StepDescription = styled.div`
  ${font_medium}
  font-weight: normal;
  margin-bottom: 25px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default YourExpertiseStep;
