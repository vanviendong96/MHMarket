import { Box, Button } from '@mui/material';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IStallFormShared } from '.';
import applicationApis from '../../../services/applicationsApis';
import { FormCommonInfor, FormOwnerDetailInfor, FormOwnerGeneralInfor } from '../components';
import FormContainer from '../layouts';
import { useStallData } from './EditStallApplication';

const BlankInfomationStallForm = (props: IStallFormShared) => {

  const { commonData } = useStallData();

  const dependentTableRef = useRef<unknown>();

  const submit = (isDraft = false) => {
    (async () => {
      const res = await applicationApis.submitApplication(commonData, isDraft)
      // next
      props.handleNext();
    })();
  }

  return (
    <FormContainer
      {...props}
      shouldGray={false}
    >
      <FormOwnerGeneralInfor />
      <FormOwnerDetailInfor tableRef={dependentTableRef} />

      <Box 
        sx={{
          margin: '100px 0 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          '& button' : {
            margin: '0 10px'
          }
        }}
      >
        <Button size='small' variant='outlined' onClick={() => props.handleBack()} >Cancel</Button>
        <Button size='small' variant='outlined' onClick={() => submit(true)} >Save As Draft</Button>
        <Button size='small' variant='contained' onClick={() => submit()} >Submit And Continue</Button>
      </Box>
    </FormContainer>
  );
};

export default BlankInfomationStallForm;