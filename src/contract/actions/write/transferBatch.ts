import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const transferBatch = async (
  state: Erc1155State,
  {caller, input: {from, to, ids, amounts}}: Erc1155Action
) => {
  const balances = state.balances;

  if (typeof from !== 'string') {
    throw new ContractError('from address must be valid')
  }

  if (typeof to !== 'string') {
    throw new ContractError('to address must be valid')
  }

  if (Array.isArray(ids) == false) {
    throw new ContractError('Invalid value for "ids". Must be an Array');
  }

  if (Array.isArray(amounts) == false) {
    throw new ContractError('Invalid value for "amounts". Must be an Array');
  }

  if (ids.length !== amounts.length) {
    throw new ContractError("length of id Array must be equal to length of amount array");
  }

  if (!(from === caller || state.operatorApprovals[from][caller])) {
    throw new ContractError('caller is not owner nor approved');
  }

  if (!balances[from]) {
    throw new ContractError(`From balance is not defined!`);
  }

  for (let i = 0; i < ids.length; i++) {
    if (amounts[i] <= 0 || from === to) {
      throw new ContractError('Invalid token transfer');
    }

    if (balances[ids[i]][from] < amounts[i]) {
      throw new ContractError(
        `From balance for token with id ${ids[i]} not high enough to send ${amounts[i]} token(s)!`
      );
    }

    balances[ids[i]][from] -= amounts[i];
    balances[ids[i]][to] ? (balances[ids[i]][to] += amounts[i]) : (balances[ids[i]][to] = amounts[i]);

  }

  return {state};
};
