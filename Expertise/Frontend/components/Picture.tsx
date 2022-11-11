import React, {FC, useState, useCallback, useEffect, ChangeEvent} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import BaseImage from 'components/BaseComponents/BaseImage';
import BaseButton from 'components/BaseComponents/BaseButton';
import BaseRadio from 'components/BaseComponents/BaseRadio';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import {useStores} from 'hooks/useStores';
import noPhoto from 'assets/images/no_pic.webp';
import uploadIcon from 'assets/icons_refactor/Wizard/upload.svg';
import Consts from '../YourExpertiseConsts';
import {mediumFontSize} from 'theme/fonts';

const {YES, EXPERTISE_PICTURE, EXPERTISE_PICTURE_UPLOAD, EXPERTISE_PICTURE_DELETE, UPLOAD_LATER} = Consts;

interface Props {
  defaultRadioValue: string;
  showError: string;
  elementRef: any;
}

const Picture: FC<Props> = observer(({defaultRadioValue, showError, elementRef}) => {
  const {
    initialRegistrationStore: {
      stepsData: {skippedFields, workingAvatar},
      addStepData,
      postUserAvatar,
      removeUserData,
      postUserData,
      addShowField,
    },
  } = useStores();

  const [avatarError, setAvatarError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [skipPicture, setSkipPicture] = useState<boolean>(skippedFields?.includes('workingAvatar') || false);

  useEffect(() => {
    setAvatarError(showError);
  }, [showError]);

  const handleUpload = useCallback(
    ({target: {files}}: ChangeEvent<HTMLInputElement>) => {
      const formData = new FormData();
      files?.length && formData.append('image_translator', files[0]);

      setIsLoading(true);

      postUserAvatar(formData, (key, error) => {
        if (error.length) {
          setAvatarError(error);
        } else {
          setAvatarError('');
          if (key.length) {
            addStepData('workingAvatar', `/download/?fi=${key}&size=medium`);
            addShowField('picture');
          }
        }

        setIsLoading(false);
      });
    },
    [addShowField, addStepData, postUserAvatar]
  );

  const handleDelete = useCallback(() => {
    removeUserData('/image_resource', ({image_resource}) => {
      addStepData('workingAvatar', image_resource);
      addShowField('picture');
    });
  }, [addShowField, addStepData, removeUserData]);

  const pictureOn = useCallback(() => {
    removeUserData('/skip_field/workingAvatar', ({skip_field}) => {
      if (skip_field) {
        addStepData('skippedFields', skip_field);
        setSkipPicture(!skipPicture);
        addShowField('picture');
      }
    });
  }, [addShowField, addStepData, removeUserData, skipPicture]);

  const pictureOff = useCallback(() => {
    const formData = new FormData();
    formData.append('skip_field', 'workingAvatar');

    postUserData(formData, ({skip_field}) => {
      handleDelete();
      addStepData('skippedFields', skip_field);
      addShowField('picture');
      setSkipPicture(!skipPicture);
    });
  }, [addShowField, addStepData, handleDelete, postUserData, skipPicture]);

  return (
    <Wrapper ref={elementRef}>
      <div>
        <b>{EXPERTISE_PICTURE}</b>
      </div>

      <div>
        <BaseRadio
          onChange={() => (skipPicture ? pictureOn() : pictureOff())}
          defaultValue={defaultRadioValue}
          options={[
            {
              value: '1',
              label: YES,
            },
            {
              value: '0',
              label: UPLOAD_LATER,
            },
          ]}
        />
      </div>

      {!skipPicture && (
        <UploadBlock>
          <div>
            <UserImage src={workingAvatar || noPhoto} alt="avatar" />
          </div>
          <div>
            <div>
              <UploadButton variant="contained" component="label" disabled={isLoading}>
                {EXPERTISE_PICTURE_UPLOAD}
                <input type="file" accept="image/*" hidden onChange={handleUpload} />
              </UploadButton>
            </div>
            <div>
              {workingAvatar && (
                <DeleteButton variant="contained" disabled={isLoading} onClick={handleDelete}>
                  {EXPERTISE_PICTURE_DELETE}
                </DeleteButton>
              )}
            </div>
            {avatarError && <FormError>{avatarError}</FormError>}
          </div>
        </UploadBlock>
      )}
    </Wrapper>
  );
});

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

const UserImage = styled(BaseImage)`
  width: 75px;
  height: 75px;
`;

const FormError = styled(FormHelperText)`
  color: ${({theme}) => theme.colors.red100};
  margin-top: 5px;

  &:first-letter {
    text-transform: uppercase;
  }
`;

const UploadBlock = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;

  img {
    width: 110px;
    height: auto;
    margin-right: 20px;
  }
`;

const UploadButton = styled(BaseButton)`
  border: 1px dashed ${({theme}) => theme.colors.grey060};
  background-color: ${({theme}) => theme.colors.grey030};
  background-image: url(${uploadIcon});
  background-position: 13px 9px;
  background-repeat: no-repeat;
  color: ${({theme}) => theme.colors.grey100};
  ${mediumFontSize}
  font-weight: normal;
  padding: 9px 15px 7px 43px;
  margin-bottom: 10px;
  box-shadow: none;

  &:hover {
    box-shadow: none;
    background-color: ${({theme}) => theme.colors.grey050};
  }

  img {
    width: 20px;
  }
` as typeof Button;

const DeleteButton = styled(Button)`
  border: 1px dashed ${({theme}) => theme.colors.grey050};
  background-color: ${({theme}) => theme.colors.grey000};
  color: ${({theme}) => theme.colors.grey100};
  ${mediumFontSize}
  font-weight: normal;
  padding: 9px 15px 7px;
  margin-bottom: 10px;
  box-shadow: none;

  &:hover {
    box-shadow: none;
    background: ${({theme}) => theme.colors.grey050};
  }
`;

export default Picture;
