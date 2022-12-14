import SuccessDialog from '@components/common/dialog/SuccessDialog';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { IStallFormShared } from '.';
import applicationApis from '../../../services/applicationsApis';
import { RequiredDocument } from '../components';
import FormContainer from '../layouts';
import { useStallData } from './EditStallApplication';

const ClientIdentifyForm = (props: IStallFormShared) => {
  const { commonData, setCommonData } = useStallData();
  const params = useParams();
  //
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    isDraft: false,
  });

  const handleCloseModal = (isDraft: boolean) => {
    setModal({
      open: false,
      isDraft: false,
    });
    if (isDraft) {
      navigate('/application-list');
    } else {
      props.handleNext();
    }
  };

  //

  const submit = (isDraft = false) => {
    (async () => {
      try {
        await applicationApis.updateApplicationWithDocs(commonData, isDraft);
        const res = await applicationApis.getApplication(
          commonData.application_id
        );
        if (!isDraft) {
          setCommonData((draft: any) => ({ ...draft, ...res }));
        }
        setModal({
          open: true,
          isDraft,
        });
      } catch (e) {
        console.log(e);
      }
    })();
  };

  return (
    <FormContainer {...props} shouldGray={false}>
      <RequiredDocument />
      <SuccessDialog
        openProp={modal.open}
        message="Submit Successfully!"
        onCloseDialog={() => handleCloseModal(modal.isDraft)}
      />

      <Box
        sx={{
          margin: '100px 0 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          '& button': {
            margin: '0 10px',
          },
        }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => props.handleBack()}>
          Back
        </Button>
        {commonData?.status !== 3 && (
          <>
            <Button
              size="small"
              variant="outlined"
              onClick={() => submit(true)}>
              Save As Draft
            </Button>
            <Button size="small" variant="contained" onClick={() => submit()}>
              Submit And Continue
            </Button>
          </>
        )}
        {(commonData?.status === 2 || commonData?.status === 3) && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => props.handleNext()}>
            Next
          </Button>
        )}
      </Box>
    </FormContainer>
  );
};

export default ClientIdentifyForm;
