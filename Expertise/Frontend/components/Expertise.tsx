import React, {FC, useState, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseRadio from 'components/BaseComponents/BaseRadio';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {useStores} from 'hooks/useStores';
import {ReactComponent as CloseIcon} from 'assets/icons_refactor/Client/close.svg';
import {IExpertiseCategory} from 'store/pages/initialRegistrationStore';
import Consts from '../YourExpertiseConsts';
import {RadioValues} from '../../../InitialRegistrationConsts';

const {INCLUDE_EXPERTISE, SELECT} = Consts;

interface Props {
  defaultRadioValue: string;
  showError: string;
  elementRef: any;
}

const Expertise: FC<Props> = observer(({defaultRadioValue, showError, elementRef}) => {
  const {
    initialRegistrationStore: {
      selectData,
      stepsData: {skippedFields, workingExpertises},
      addStepData,
      removeUserData,
      postUserData,
      addShowField,
    },
  } = useStores();

  const [expertiseError, setExpertiseError] = useState<string>('');
  const [skipExpertise, setSkipExpertise] = useState<boolean>(skippedFields?.includes('workingExpertises') || false);

  useEffect(() => {
    setExpertiseError(showError);
  }, [showError]);

  const chooseExpertise = useCallback(
    (id: string) => {
      const formData = new FormData();
      formData.append('expertise', id);

      postUserData(formData, ({expertise}, errors) => {
        if (errors.length) {
          setExpertiseError(errors);
        } else {
          setExpertiseError('');

          if (expertise) {
            addStepData('workingExpertises', expertise as IExpertiseCategory[]);
            addShowField('expertise');
          }
        }
      });
    },
    [addShowField, addStepData, postUserData]
  );

  const removeExpertise = useCallback(
    (id: string) => {
      removeUserData(`/expertise/${id}`, ({expertise}, errors) => {
        if (errors.length) {
          setExpertiseError(errors);
        } else {
          setExpertiseError('');

          if (expertise) {
            addStepData('workingExpertises', expertise?.length ? (expertise as IExpertiseCategory[]) : null);
            addShowField('expertise');
          }
        }
      });
    },
    [addShowField, addStepData, removeUserData]
  );

  const expertiseOn = useCallback(() => {
    removeUserData('/skip_field/workingExpertises', ({skip_field}) => {
      if (skip_field) {
        addStepData('skippedFields', skip_field);
        addShowField('expertise');
        setSkipExpertise(!skipExpertise);
      }
    });
  }, [addShowField, addStepData, removeUserData, skipExpertise]);

  const expertiseOff = useCallback(() => {
    const formData = new FormData();
    formData.append('skip_field', 'workingExpertises');

    postUserData(formData, ({skip_field}) => {
      workingExpertises?.map((item) => {
        removeExpertise(item.id);
      });
      addStepData('skippedFields', skip_field);
      addShowField('expertise');
      setSkipExpertise(!skipExpertise);
    });
  }, [addShowField, addStepData, postUserData, removeExpertise, skipExpertise, workingExpertises]);

  return (
    <Wrapper ref={elementRef}>
      <div>
        <b>{INCLUDE_EXPERTISE} *</b>
      </div>
      <div>
        <BaseRadio
          onChange={() => (skipExpertise ? expertiseOn() : expertiseOff())}
          defaultValue={defaultRadioValue}
          options={RadioValues}
        />
      </div>
      {!skipExpertise && (
        <>
          <StepFormControl>
            <Select value="default" onChange={({target: {value}}) => chooseExpertise(String(value))} variant="outlined">
              <MenuItem value="default" key="default">
                {SELECT}
              </MenuItem>
              {selectData?.expertises?.map(({name, id}) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            {expertiseError && <FormError>{expertiseError}</FormError>}
          </StepFormControl>

          <div>
            {workingExpertises?.map(({id, name, status}) => (
              <ExpertisesBlock key={id}>
                <OneExpertise>{name}</OneExpertise>
                <ExpertiseStatus>{status}</ExpertiseStatus>
                <RemoveIcon onClick={() => removeExpertise(id)}>
                  <Icon icon={CloseIcon} />
                </RemoveIcon>
              </ExpertisesBlock>
            ))}
          </div>
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
  border-bottom: 1px ${({theme}) => theme.colors.grey050} solid;
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

const ExpertisesBlock = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OneExpertise = styled.span`
  padding: 12px 18px;
  background: ${({theme}) => theme.colors.grey030};
  border-radius: 25px;
  margin-right: 12px;
`;

const ExpertiseStatus = styled.span`
  margin-left: auto;
  color: ${({theme}) => theme.colors.grey070};
  text-transform: capitalize;
  padding-right: 10px;
`;

const RemoveIcon = styled.div`
  padding: 7px;
  background: ${({theme}) => theme.colors.grey000};
  border: 1px solid ${({theme}) => theme.colors.grey050};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const Icon = styled(BaseIcon).attrs({boxW: 20, boxH: 20})`
  fill: ${({theme}) => theme.colors.grey090};
`;

export default Expertise;
