import { useSnackbar } from 'notistack';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEASE_MANAGEMENT } from '../../const/const';
import { IManagementTableFormat } from '../../const/interface';
import leaseApis from '../../services/leaseApis';
import SelectSearch from '../common/select-search/SelectSearch';
import TableManagement from '../common/table-management/TableManagement';

const MARKET_LEASE_SEARCH_FIELDS = [
  {
    value: 'lease_code',
    label: 'Lease ID',
  },
  {
    value: 'market_name',
    label: 'Market Name',
  },
  {
    value: 'first_name',
    label: 'First Name',
  },
  {
    value: 'last_name',
    label: 'Last Name',
  },
];
const columns: readonly IManagementTableFormat[] = [
  {
    id: 'lease_code',
    label: 'LEASE ID',
    width: '15%',
    align: 'left',
  },
  {
    id: 'owner_first_name',
    label: 'FIRST NAME',
    width: '15%',
    align: 'left',
  },
  {
    id: 'owner_last_name',
    label: 'LAST NAME',
    width: '15%',
    align: 'left',
  },
  { id: 'market_name', label: 'MARKET NAME', width: '15%', align: 'left' },
  {
    id: 'stall_name',
    label: 'STALL NUMBER',
    width: '15%',
    align: 'left',
  },
  {
    id: 'lease_status',
    label: 'LEASE STATUS',
    width: '15%',
    align: 'center',
  },
  { id: 'action', label: 'ACTION', width: '10%', align: 'center' },
];

const LeaseManagement: React.FC = () => {
  const [rows, setRows] = useState([]);
  const [selectValue, setSelectValue] = useState<string>(
    MARKET_LEASE_SEARCH_FIELDS[0].value
  );
  const [inputValue, setInputValue] = useState<string>('');
  const globalRows = useRef([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    (async () => {
      try {
        const res = await leaseApis.getLeases();
        globalRows.current = (res as any).items ?? [];
        setRows((res as any).items ?? []);
      } catch (err) {
        enqueueSnackbar(err as string);
      }
    })();
  }, []);

  useEffect(() => {
    if (['first_name', 'last_name'].includes(selectValue)) {
      setRows(
        globalRows.current.filter((row: any) =>
          row?.owner?.[`${selectValue}`].includes(inputValue)
        )
      );
    } else {
      setRows(
        globalRows.current.filter((row: any) =>
          row?.[`${selectValue}`].includes(inputValue)
        )
      );
    }
  }, [selectValue, inputValue]);

  const handleView = (id: string) => {
    navigate(`/lease-management/view/${id}`);
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectValue(e.target.value);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <SelectSearch
        searchFields={MARKET_LEASE_SEARCH_FIELDS}
        onChangeSelect={handleChangeSelect}
        onChangeInput={handleChangeInput}
      />
      <TableManagement
        name={LEASE_MANAGEMENT}
        columns={columns}
        rows={rows}
        isHaveSelectSearchField={true}
        onView={handleView}
      />
    </>
  );
};

export default LeaseManagement;
