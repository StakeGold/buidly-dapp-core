import { sendTransactions } from '@elrondnetwork/dapp-core/services';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { Transaction } from '@elrondnetwork/erdjs/out';

export const sendAndSignTransactions = async (
  transactions: Transaction[],
  transactionName: string,
  callbackRoute?: string
): Promise<{
  success: boolean;
  error: string;
  sessionId: string | null;
}> => {
  try {
    await refreshAccount();
    const { sessionId, error } = await sendTransactions({
      transactions: transactions,
      transactionsDisplayInfo: {
        processingMessage: `Processing ${transactionName} transaction`,
        errorMessage: `An error has occurred during ${transactionName}`,
        successMessage: `${transactionName} transaction successful`
      },
      callbackRoute: callbackRoute,
      redirectAfterSign: callbackRoute,
      minGasLimit: 20000000
    });

    await refreshAccount();

    return { success: error !== undefined, error: error ?? '', sessionId };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message, sessionId: null };
  }
};
