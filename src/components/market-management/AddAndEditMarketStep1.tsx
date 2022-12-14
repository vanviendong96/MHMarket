import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MARKET_TYPE } from '../../const/const';
import marketApis from '../../services/marketApis';
import AlertDialog from '../common/dialog/AlertDialog';
import ErrorDialog from '../common/dialog/ErrorDialog';
import SuccessDialog from '../common/dialog/SuccessDialog';
import MarketFormStep1 from './MarketFormStep1';

const AddAndEditMarketStep1 = () => {
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [currentEditMarket, setCurrentEditMarket] = useState<any>();

  const errorMes = useRef<string>('');
  const supervisorId = useRef<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const isAtEditPage = location.pathname.includes('/market/edit');
  const marketId = localStorage.getItem('marketId') ?? '';
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!marketId) return;
    (async () => {
      try {
        const res = await marketApis.getMarket(marketId);
        supervisorId.current = (res as any)?.supervisor?.supervisor_id ?? '';
        setCurrentEditMarket(res);
      } catch (error) {
        enqueueSnackbar(error as string);
      }
    })();
  }, []);

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    isAtEditPage
      ? navigate(`/market/edit/step2/${params.id}`)
      : navigate('/market/add-new/step2');
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      location: {},
      supervisor: {},
    };

    let elementsInForm = (e.target as HTMLFormElement).elements;
    [...elementsInForm].forEach((el) => {
      if (el.nodeName === 'INPUT' && (el as HTMLInputElement).name) {
        const { type, name, value } = el as HTMLInputElement;
        if (type === 'text') {
          if (['address', 'city', 'province', 'ward'].includes(name)) {
            payload.location[name] = value;
          } else if (
            [
              'email',
              'first_name',
              'last_name',
              'middle_name',
              'mobile_phone',
              'position',
              'telephone',
            ].includes(name)
          ) {
            payload.supervisor[name] = value;
          } else {
            payload[name] = value;
          }
        }
        if (['status', 'clazz'].includes(name)) {
          payload[name] = Number(value);
        }
        if (name === 'type') {
          payload[name] =
            MARKET_TYPE.find((item: any) => item.value === value)?.type ?? 1;
        }
      }
    });

    if (marketId) {
      payload.supervisor['supervisor_id'] = supervisorId.current;
      payload['market_id'] = marketId;
    }

    // Call API Add New or Edit
    (async () => {
      try {
        let res;
        if (marketId) {
          res = await marketApis.editMarket(marketId, payload);
        } else {
          res = await marketApis.createMarket(payload);
        }
        const id = marketId ? (res as any).market_id : (res as any).id;
        res && localStorage.setItem('marketId', id);
        setOpenSuccessDialog(true);
      } catch (error) {
        errorMes.current = error as string;
        setOpenErrorDialog(true);
      }
    })();
  };

  return (
    <div className="container text-field-1-4">
      {currentEditMarket && (
        <MarketFormStep1
          currentEditMarket={currentEditMarket}
          onSubmit={handleSubmit}
        />
      )}
      {!currentEditMarket && <MarketFormStep1 onSubmit={handleSubmit} />}
      <AlertDialog
        openProp={openAlertDialog}
        message={'All classes have to be unique'}
        onCloseDialog={handleCloseAlertDialog}
      />
      <ErrorDialog
        openProp={openErrorDialog}
        message={errorMes.current}
        onCloseDialog={() => setOpenErrorDialog(false)}
      />
      <SuccessDialog
        openProp={openSuccessDialog}
        message={`${marketId ? 'Update' : 'Create'} Successfully!`}
        onCloseDialog={handleCloseSuccessDialog}
      />
    </div>
  );
};

export default AddAndEditMarketStep1;
