import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const setApprovedForAll = async (
  state: Erc1155State,
  {caller, input: {operator, approved}}: Erc1155Action
) => {

  const operatorApproval = state.operatorApprovals;

  if (typeof approved !== 'boolean') {
    throw new ContractError('approved must be boolean');
  }

  if(typeof operator !== 'string'){
    throw new ContractError('operator must be string');
  }

  if(operator === caller){
    throw new ContractError('You cant make yourself an operator')
  }

  if(operatorApproval[caller] == null){
    operatorApproval[caller] = {};
  }

  operatorApproval[caller][operator]= approved;

  return {state};
};
