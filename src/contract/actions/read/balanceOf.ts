import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const balanceOf = async (
  state: Erc1155State,
  {input: {account, id}}: Erc1155Action
) => {

  const balances = state.balances;

  if (typeof account !== 'string') {
    throw new ContractError('Must specify account to get balance for');
  }

  if (typeof id !== 'number') {
    throw new ContractError('Must specify account to get balance for');
  }

  if (typeof balances[id][account] !== 'number') {
    throw new ContractError('Cannot get balance, account does not exist');
  }

  return {result: {balance: balances[id][account]}};
};
