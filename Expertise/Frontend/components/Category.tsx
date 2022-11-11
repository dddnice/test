import React, {FC, useState, useCallback, useEffect, KeyboardEvent} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseRadio from 'components/BaseComponents/BaseRadio';
import BaseIcon from 'components/BaseComponents/BaseIcon';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import {useStores} from 'hooks/useStores';
import {IExpertiseCategory} from 'store/pages/initialRegistrationStore';
import {ReactComponent as CloseIcon} from 'assets/icons_refactor/Client/close.svg';
import Consts from '../YourExpertiseConsts';
import {RadioValues} from '../../../InitialRegistrationConsts';

const {INCLUDE_EXPERTISE_CATEGORY, EXPERTISE_CATEGORY_TYPE, EXPERTISE_CATEGORY_HELPER_1, EXPERTISE_CATEGORY_HELPER_2} =
  Consts;

interface Props {
  defaultRadioValue: string;
  showError: string;
  elementRef: any;
}

const Category: FC<Props> = observer(({defaultRadioValue, showError, elementRef}) => {
  const {
    initialRegistrationStore: {
      stepsData: {skippedFields, workingExpertiseCategory},
      addStepData,
      removeUserData,
      postUserData,
      addShowField,
    },
  } = useStores();

  const [expertiseCategory, setExpertiseCategory] = useState<string>('');
  const [expertiseCategoryError, setExpertiseCategoryError] = useState<string>('');
  const [skipCategory, setSkipCategory] = useState<boolean>(
    skippedFields?.includes('workingExpertiseCategory') || false
  );

  useEffect(() => {
    setExpertiseCategoryError(showError);
  }, [showError]);

  const chooseExpertiseCategory = useCallback(
    ({key}: KeyboardEvent) => {
      if (key === 'Enter') {
        const formData = new FormData();
        formData.append('expertise_category', expertiseCategory);

        postUserData(formData, ({expertise_category}, errors) => {
          if (errors.length) {
            setExpertiseCategoryError(errors);
          } else {
            setExpertiseCategoryError('');

            if (expertise_category) {
              addStepData('workingExpertiseCategory', expertise_category as IExpertiseCategory[]);
              addShowField('expertise_category');
            }
          }
        });

        setExpertiseCategory('');
      }
    },
    [addShowField, addStepData, expertiseCategory, postUserData]
  );

  const removeExpertiseCategory = useCallback(
    (id: string | undefined) => {
      removeUserData(`/expertise_category/${id}`, ({expertise_category}, errors) => {
        if (errors.length) {
          setExpertiseCategoryError(errors);
        } else {
          setExpertiseCategoryError('');

          if (expertise_category) {
            addStepData('workingExpertiseCategory', expertise_category as IExpertiseCategory[]);
            addShowField('expertise_category');
          }
        }
      });
    },
    [addShowField, addStepData, removeUserData]
  );

  const categoryOn = useCallback(() => {
    removeUserData('/skip_field/workingExpertiseCategory', ({skip_field}) => {
      if (skip_field) {
        addStepData('skippedFields', skip_field);
        addShowField('expertise_category');
        setSkipCategory(!skipCategory);
      }
    });
  }, [addShowField, addStepData, removeUserData, skipCategory]);

  const categoryOff = useCallback(() => {
    const formData = new FormData();
    formData.append('skip_field', 'workingExpertiseCategory');

    postUserData(formData, (answer) => {
      workingExpertiseCategory?.map((item) => {
        removeExpertiseCategory(item.Id);
      });
      addStepData('skippedFields', answer?.skip_field);
      addShowField('expertise_category');
      setSkipCategory(!skipCategory);
      setExpertiseCategoryError('');
    });
  }, [addShowField, addStepData, postUserData, removeExpertiseCategory, skipCategory, workingExpertiseCategory]);

  return (
    <Wrapper ref={elementRef}>
      <div>
        <b>{INCLUDE_EXPERTISE_CATEGORY} *</b>
      </div>
      <div>
        <BaseRadio
          onChange={() => (skipCategory ? categoryOn() : categoryOff())}
          defaultValue={defaultRadioValue}
          options={RadioValues}
        />
      </div>

      {!skipCategory && (
        <>
          <StepFormControl>
            <TextField
              value={expertiseCategory}
              label={EXPERTISE_CATEGORY_TYPE}
              variant="outlined"
              helperText={workingExpertiseCategory?.length ? EXPERTISE_CATEGORY_HELPER_2 : EXPERTISE_CATEGORY_HELPER_1}
              onKeyPress={chooseExpertiseCategory}
              onChange={({target: {value}}) => setExpertiseCategory(value)}
            />
            {expertiseCategoryError && <FormError>{expertiseCategoryError}</FormError>}
          </StepFormControl>

          <div>
            {workingExpertiseCategory?.map(({Id, Name}) => (
              <ExpertisesBlock key={Id}>
                <OneExpertise>{Name}</OneExpertise>
                <RemoveIcon onClick={() => removeExpertiseCategory(Id)}>
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
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
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

export default Category;
