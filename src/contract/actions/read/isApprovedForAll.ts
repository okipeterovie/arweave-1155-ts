import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const isApprovedForAll = async (
  state: Erc1155State,
  {input: {account, operator}}: Erc1155Action
) => {

  const operatorApproval = state.operatorApprovals;

  if (typeof account !== 'string') {
    throw new ContractError('Must specify account to get balance for');
  }

  if (typeof operator !== 'string') {
    throw new ContractError('Must specify operator to get approval for');
  }

  if (typeof operatorApproval[account][operator] !== 'boolean') {
    throw new ContractError('Cannot get operator approval, account does not exist');
  }

  return {result: {operatorApproval: operatorApproval[account][operator]}};
};
