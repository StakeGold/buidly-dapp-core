import * as React from 'react';
import {
  useGetAccountInfo,
  useGetSignedTransactions
} from '@elrondnetwork/dapp-core/hooks';
import { updateSignedTransactionStatus } from '@elrondnetwork/dapp-core/reduxStore/slices/transactionsSlice';
import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { Transaction } from '@elrondnetwork/erdjs';
import axios from 'axios';
import qs from 'qs';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dispatch } from 'redux';

const apiSendBatchTransactions = async (
  apiAddress: string,
  batchId: string,
  address: string,
  transactions: Transaction[]
): Promise<{ status: string; error?: string }> => {
  try {
    const payload = {
      id: batchId,
      transactions
    };
    const { data } = await axios.post(
      `${apiAddress}/transactions/batch/${address}`,
      payload
    );

    const errorMessage =
      data.status === 'pending' || data.status === 'success'
        ? undefined
        : 'Error';
    return { status: data.status, error: errorMessage };
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ?? error?.message ?? 'Error';
    return { status: 'invalid', error: errorMessage };
  }
};

const updateTransactionStatuses = async (
  apiAddress: string,
  address: string,
  batchId: string,
  dispatch: Dispatch<any>
) => {
  const { data } = await axios.get(
    `${apiAddress}/transactions/batch/${address}/${batchId}`
  );

  const transactions = data.transactions.flat();
  for (const transaction of transactions) {
    const newStatus = {
      sessionId: batchId,
      transactionHash: transaction.hash,
      status: transaction.status
    };
    dispatch(updateSignedTransactionStatus(newStatus));
  }
  return { status: data.status };
};

const useBatchTransactions = (
  apiAddress: string
): [
  execute: (transactions: Transaction[][], callbackUrl?: string) => void,
  data: any
] => {
  const [returnData, setReturnData] = React.useState<{
    status: string;
    error?: string;
  }>({
    status: '',
    error: undefined
  });

  const dispatch = useDispatch();

  const { search } = useLocation();
  const { account } = useGetAccountInfo();
  const { signedTransactions } = useGetSignedTransactions();

  const [batchSessionId, setBatchSessionId] = React.useState('');
  const queryData = qs.parse(search.replace('?', ''));
  const sessionIdWebWallet = (queryData?.['signSession'] as string) || '';

  const batchId = sessionIdWebWallet || batchSessionId;
  const batch = signedTransactions[batchId];

  const sendBatch = async () => {
    // hack
    const wasSent = localStorage.getItem(batchId);
    if (wasSent === 'true') {
      return;
    }

    console.log('sending batch');

    const { status, error } = await apiSendBatchTransactions(
      apiAddress,
      batchId,
      account.address,
      batch.transactions.map((tx: Transaction) => [tx])
    );

    localStorage.setItem(batchId, 'true');

    setReturnData({ status, error });
  };

  React.useEffect(() => {
    if (!batch) {
      return;
    }
    sendBatch().catch((error) => console.error(error));
  }, [batch]);

  React.useEffect(() => {
    if (returnData.status === 'success') {
      console.log('handle success');
      setReturnData({ status: 'success', error: undefined });
      return;
    }

    if (returnData.status === 'pending') {
      console.log('handle pending');
      const interval = setInterval(async () => {
        console.log('fetch new status');

        const { status } = await updateTransactionStatuses(
          apiAddress,
          account.address,
          batchId,
          dispatch
        );

        if (status === 'success') {
          setReturnData({ status: 'success', error: undefined });
        }
      }, 5000);
      return () => clearInterval(interval);
    }

    return;
  }, [returnData.status]);

  const execute = async (
    transactions: Transaction[][],
    callbackUrl?: string
  ) => {
    await refreshAccount();

    const { error, sessionId: signedBatchSessionId } = await sendTransactions({
      signWithoutSending: true,
      transactions: transactions.flat(10),
      callbackUrl: callbackUrl
    });

    if (error || !signedBatchSessionId) {
      setReturnData({ status: 'invalid', error });
      return;
    }

    setBatchSessionId(signedBatchSessionId);
  };

  return [execute, returnData];
};

export default useBatchTransactions;
