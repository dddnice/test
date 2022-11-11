import React, {FC, useState, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import BaseRadio from 'components/BaseComponents/BaseRadio';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import {useStores} from 'hooks/useStores';
import {boldWeight} from 'theme/fonts';
import {RadioValues} from '../../../InitialRegistrationConsts';
import Consts from '../YourExpertiseConsts';

const {PROFESSIONAL_EXPERIENCE, ABOUT_PLACEHOLDER, ABOUT_HELPER_MIN, ABOUT_HELPER_MAX, ABOUT_HELPER_TOO_SHORT} = Consts;

interface Props {
  defaultRadioValue: string;
  showError: string;
  elementRef: any;
}

const About: FC<Props> = observer(({defaultRadioValue, showError, elementRef}) => {
  const {
    initialRegistrationStore: {
      stepsData: {workingAboutMe, skippedFields},
      addStepData,
      postUserData,
      removeUserData,
    },
  } = useStores();

  const [aboutMe, setAboutMe] = useState<string>(workingAboutMe || '');
  const [aboutMeError, setAboutMeError] = useState<string>('');
  const [skipAboutMe, setSkipAboutMe] = useState<boolean>(skippedFields?.includes('workingAboutMe') || false);

  useEffect(() => {
    setAboutMeError(showError);
  }, [showError]);

  const addAboutMe = useCallback(
    (value: string) => {
      if (value.length > 0 && (value.length < 150 || value.length > 5000)) {
        setAboutMeError(ABOUT_HELPER_TOO_SHORT);
        return;
      } else {
        setAboutMeError('');
      }

      const formData = new FormData();
      formData.append('about', aboutMe);

      postUserData(formData, (answer, errors) => {
        if (errors.length) {
          setAboutMeError(errors);
        } else {
          setAboutMeError('');

          addStepData('workingAboutMe', aboutMe);
        }
      });
    },
    [aboutMe, addStepData, postUserData]
  );

  const aboutMeOn = useCallback(() => {
    removeUserData('/skip_field/workingAboutMe', ({skip_field, errors}) => {
      if (!errors?.length) {
        addStepData('skippedFields', skip_field);
        setSkipAboutMe(!skipAboutMe);
      }
    });
  }, [addStepData, removeUserData, skipAboutMe]);

  const aboutMeOff = useCallback(() => {
    const formData = new FormData();
    formData.append('skip_field', 'workingAboutMe');

    postUserData(formData, ({skip_field, errors}) => {
      if (!errors?.length) {
        addStepData('skippedFields', skip_field);
        setAboutMe('');
        setSkipAboutMe(!skipAboutMe);
        setAboutMeError('');
      }
    });
  }, [addStepData, postUserData, skipAboutMe]);

  return (
    <Wrapper ref={elementRef}>
      <Title>{PROFESSIONAL_EXPERIENCE} *</Title>

      <div>
        <BaseRadio
          onChange={() => (skipAboutMe ? aboutMeOn() : aboutMeOff())}
          defaultValue={defaultRadioValue}
          options={RadioValues}
        />
      </div>

      {!skipAboutMe && (
        <>
          <StepTextarea
            placeholder={ABOUT_PLACEHOLDER}
            multiline
            rows={4}
            variant="outlined"
            value={aboutMe}
            onChange={({target: {value}}) => setAboutMe(value)}
            onBlur={() => addAboutMe(aboutMe)}
            helperText={
              <>
                {ABOUT_HELPER_MIN}
                <br />
                {ABOUT_HELPER_MAX}
              </>
            }
          />
          {aboutMeError && <FormError>{aboutMeError}</FormError>}
        </>
      )}
    </Wrapper>
  );
});

const Title = styled.div`
  ${boldWeight};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({theme}) => theme.colors.grey050};
  padding-bottom: 35px;
  margin-bottom: 35px;

  .MuiFormGroup-root {
    margin-top: 10px;
  }

  .MuiFormHelperText-contained {
    text-align: right;
    margin-top: 5px;
  }
`;

const StepTextarea = styled(TextField)`
  height: 110px;
  margin: 10px 0;

  .MuiOutlinedInput-multiline {
    padding: 0;
  }
`;

const FormError = styled(FormHelperText)`
  color: ${({theme}) => theme.colors.red100};
  margin-top: 30px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

export default About;
