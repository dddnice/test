import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseRadio from 'components/BaseComponents/BaseRadio';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import {useStores} from 'hooks/useStores';
import Consts from '../YourExpertiseConsts';
import {mediumFontSize} from 'theme/fonts';
import {RadioValues} from '../../../InitialRegistrationConsts';

const {SOFTWARE_TITLE} = Consts;
const NEEDED_SOFTWARE = [109, 108, 120, 107, 137, 132];

interface Props {
  defaultRadioValue: string;
  showError: string;
  elementRef: any;
}

const Software: FC<Props> = observer(({defaultRadioValue, showError, elementRef}) => {
  const {
    initialRegistrationStore: {
      stepsData: {skippedFields, softwareList},
      addStepData,
      postUserData,
      removeUserData,
      addShowField,
    },
  } = useStores();

  const [softwareError, setSoftwareError] = useState<string>('');
  const [skipSoftware, setSkipSoftware] = useState<boolean>(skippedFields?.includes('softwareList') || false);

  useEffect(() => {
    setSoftwareError(showError);
  }, [showError]);

  const updateSoftware = useCallback(
    (formData: any) => {
      postUserData(formData, ({translator_software}, errors) => {
        if (errors.length) {
          setSoftwareError(errors);
        } else {
          setSoftwareError('');

          if (translator_software) {
            addStepData('softwareList', translator_software);
            addShowField('software');
          }
        }
      });
    },
    [addShowField, addStepData, postUserData]
  );

  const addSoftware = useCallback(
    (value: string, checked: boolean) => {
      const activeElements =
        softwareList?.filter(({selected}) => selected === true)?.map(({list_id}) => String(list_id)) || [];

      const filteredElements = checked ? [...activeElements, value] : activeElements?.filter((item) => item !== value);

      const formData = new FormData();
      formData.append('translator_software', JSON.stringify(filteredElements));

      updateSoftware(formData);
    },
    [softwareList, updateSoftware]
  );

  const removeAllSoftware = useCallback(() => {
    const formData = new FormData();
    formData.append('translator_software', JSON.stringify([]));

    updateSoftware(formData);
  }, [updateSoftware]);

  const softwareOn = useCallback(() => {
    removeUserData('/skip_field/softwareList', ({skip_field, errors}) => {
      if (!errors?.length) {
        addStepData('skippedFields', skip_field);
        addShowField('software');
        setSkipSoftware(!skipSoftware);
      }
    });
  }, [addShowField, addStepData, removeUserData, skipSoftware]);

  const softwareOff = useCallback(() => {
    const formData = new FormData();
    formData.append('skip_field', 'softwareList');

    postUserData(formData, ({skip_field, errors}) => {
      if (!errors?.length) {
        addStepData('skippedFields', skip_field);
        addShowField('software');
        removeAllSoftware();
        setSkipSoftware(!skipSoftware);
      }
    });
  }, [addShowField, addStepData, postUserData, removeAllSoftware, skipSoftware]);

  return (
    <Wrapper ref={elementRef}>
      <div>
        <b>{SOFTWARE_TITLE} *</b>
      </div>
      <div>
        <BaseRadio
          onChange={() => (skipSoftware ? softwareOn() : softwareOff())}
          defaultValue={defaultRadioValue}
          options={RadioValues}
        />
      </div>

      {!skipSoftware && (
        <StepFormGroup>
          {softwareList
            ?.filter(({list_id}) => NEEDED_SOFTWARE.includes(list_id))
            .map(({list_id, list_value, selected}) => (
              <StepLabel
                key={list_id}
                control={<StepCheckbox value={list_id} name={list_value} checked={selected} color="primary" />}
                label={list_value}
                onChange={({target: {value, checked}}: any) => addSoftware(value, checked)}
              />
            ))}
          {softwareError && <FormError>{softwareError}</FormError>}
        </StepFormGroup>
      )}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 35px;

  @media ${({theme}) => theme.breakpoints.maxMd} {
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .MuiFormGroup-root {
    margin-top: 10px;
  }
`;

const StepFormGroup = styled(FormGroup)`
  margin-top: 10px !important;
`;

const StepLabel = styled(FormControlLabel)`
  margin: 0;

  .MuiFormControlLabel-label {
    ${mediumFontSize}
    color: ${({theme}) => theme.colors.grey100};
  }
`;

const StepCheckbox = styled(Checkbox)`
  margin: 5px 5px 5px 0;
  padding: 0;
`;

const FormError = styled(FormHelperText)`
  color: ${({theme}) => theme.colors.red100};
  margin-top: 5px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

export default Software;
