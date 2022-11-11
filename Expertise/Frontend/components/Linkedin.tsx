import React, {FC, useState, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseRadio from 'components/BaseComponents/BaseRadio';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {useStores} from 'hooks/useStores';
import Consts from '../YourExpertiseConsts';
import {RadioValues} from '../../../InitialRegistrationConsts';

const {LINKEDIN_TITLE, LINKEDIN_PASTE, LINKEDIN_ERROR} = Consts;

interface Props {
  defaultRadioValue: string;
  showError: string;
  elementRef: any;
}

const Linkedin: FC<Props> = observer(({defaultRadioValue, showError, elementRef}) => {
  const {
    initialRegistrationStore: {
      stepsData: {workingLinkedin, skippedFields},
      addStepData,
      removeUserData,
      postUserData,
      addShowField,
    },
  } = useStores();

  const [linkedin, setLinkedin] = useState<string>(workingLinkedin || '');
  const [linkedinError, setLinkedinError] = useState<string>('');
  const [skipLinkedin, setSkipLinkedin] = useState<boolean>(skippedFields?.includes('workingLinkedin') || false);

  useEffect(() => {
    setLinkedinError(showError);
  }, [showError]);

  const addLinkedin = useCallback(() => {
    const formData = new FormData();
    formData.append('linkedin_url', linkedin);

    postUserData(formData, ({linkedin_url}, errors) => {
      if (errors.length) {
        setLinkedinError(errors);
      } else {
        setLinkedinError('');

        if (linkedin_url) {
          addStepData('workingLinkedin', linkedin_url);
          addShowField('linkedin');
        }
      }
    });
  }, [addShowField, addStepData, linkedin, postUserData]);

  const removeLinkedin = useCallback(() => {
    removeUserData('/linkedin_url', ({errors}) => {
      if (!errors?.length) {
        addStepData('workingLinkedin', '');
        setLinkedin('');
        addShowField('linkedin');
      }
    });
  }, [addShowField, addStepData, removeUserData]);

  const linkedinOn = useCallback(() => {
    removeUserData('/skip_field/workingLinkedin', ({skip_field, errors}) => {
      if (!errors?.length) {
        addStepData('skippedFields', skip_field);
        addShowField('linkedin');
        setSkipLinkedin(!skipLinkedin);
      }
    });
  }, [addShowField, addStepData, removeUserData, skipLinkedin]);

  const linkedinOff = useCallback(() => {
    const formData = new FormData();
    formData.append('skip_field', 'workingLinkedin');

    postUserData(formData, ({skip_field, errors}) => {
      if (!errors?.length) {
        removeLinkedin();
        addStepData('skippedFields', skip_field);
        addShowField('linkedin');
        setSkipLinkedin(!skipLinkedin);
        setLinkedinError('');
      }
    });
  }, [addShowField, addStepData, postUserData, removeLinkedin, skipLinkedin]);

  return (
    <Wrapper ref={elementRef}>
      <div>
        <b>{LINKEDIN_TITLE} *</b>
      </div>
      <div>
        <BaseRadio
          onChange={() => (skipLinkedin ? linkedinOn() : linkedinOff())}
          defaultValue={defaultRadioValue}
          options={RadioValues}
        />
      </div>

      {!skipLinkedin && (
        <>
          <StepFormControl>
            <TextField
              value={linkedin}
              label={LINKEDIN_PASTE}
              variant="outlined"
              onChange={({target: {value}}) => setLinkedin(value)}
              onBlur={addLinkedin}
            />
            {linkedinError && <FormError>{LINKEDIN_ERROR}</FormError>}
          </StepFormControl>
        </>
      )}
    </Wrapper>
  );
});

const StepFormControl = styled(FormControl)`
  margin: 10px 0;

  .MuiFormHelperText-contained {
    text-align: right;
    margin-top: 5px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({theme}) => theme.colors.grey050};
  padding-bottom: 35px;
  margin-bottom: 35px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .MuiFormGroup-root {
    margin-top: 10px;
  }
`;

const FormError = styled(FormHelperText)`
  color: ${({theme}) => theme.colors.red100};
  margin-top: 5px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

export default Linkedin;
