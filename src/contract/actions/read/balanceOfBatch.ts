import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const balanceOfBatch = async (
  state: Erc1155State,
  {input: {accounts, ids}}: Erc1155Action
) => {

  const balances = state.balances;

  if (Array.isArray(accounts) === false) {
    throw new ContractError('Must specify accounts to get balance for');
  }

  if (Array.isArray(ids) === false) {
    throw new ContractError('Must specify ids to get balance for');
  }

  if (accounts.length !== ids.length) {
    throw new ContractError('Length of accounts must be the same as length of ids');
  }


  let batchBalances = new Array(accounts.length);
  for (let i = 0; i < accounts.length; i++) {

    if (typeof balances[ids[i]][accounts[i]] !== 'number') {
      throw new ContractError('Cannot get balance, account does not exist');
    }
    batchBalances[i] = balances[ids[i]][accounts[i]];
  }




  return {result: {batchBalances: batchBalances}};
};
