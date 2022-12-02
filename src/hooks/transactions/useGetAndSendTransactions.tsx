import * as React from 'react';
import { DocumentNode, useMutation } from '@apollo/client';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import useBatchTransactions from './useBatchTransactions';

interface ReturnDataType {
  status: 'none' | 'pending' | 'success' | 'error';
  error?: string;
}

const useGetAndSendTransactions = (
  apiAddress: string,
  mutation: DocumentNode
): [execute: ({ variables }: { variables: any }) => void, data: any] => {
  const { address: sender } = useGetAccountInfo();

  const [returnData, setReturnData] = React.useState<ReturnDataType>({
    status: 'none',
    error: undefined
  });

  const [getTransactions, { data: txData, error: txError }] =
    useMutation(mutation);
  const [sendTransactions, { status, error }] =
    useBatchTransactions(apiAddress);

  const execute = ({ variables }: { variables: any }) => {
    setReturnData({ status: 'pending' });
    getTransactions({
      variables: {
        sender,
        ...variables
      }
    });
  };

  React.useEffect(() => {
    const transactions = txData?.transactions;
    if (transactions) {
      if (Array.isArray(transactions)) {
        sendTransactions(transactions.flat());
      } else {
        sendTransactions([transactions]);
      }
    }

    if (txError) {
      setReturnData({ status: 'error', error: txError.message });
    }
  }, [txData?.transactions, txError]);

  React.useEffect(() => {
    if (error) {
      setReturnData({ status: 'error', error });
    }
  }, [error]);

  React.useEffect(() => {
    if (!status) {
      return;
    }

    // TODO check all statuses
    if (status === 'success') {
      setReturnData({ status: 'success' });
    } else if (status === 'error') {
      setReturnData({ status: 'error' });
    } else if (status === 'pending') {
      setReturnData({ status: 'pending' });
    }
  }, [status]);

  return [execute, returnData];
};

export default useGetAndSendTransactions;
