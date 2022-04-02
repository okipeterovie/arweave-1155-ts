import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const mintBatch = async (
  state: Erc1155State,
  {caller, input: {to, ids, amounts}}: Erc1155Action
) => {
  const balances = state.balances;

  if (typeof to !== 'string') {
    throw new ContractError('to address must be valid')
  }

  if (!Array.isArray(ids)) {
    throw new ContractError('Invalid value for "id". Must be an array');
  }

  if (!Array.isArray(amounts)) {
    throw new ContractError('Invalid value for "amount". Must be an array');
  }

  if (ids.length !== amounts.length) {
    throw new ContractError('Ids length and amounts length mismatch');
  }

  for (let i = 0; i < ids.length; i++) {
    if (amounts[i] <= 0) {
      throw new ContractError(`Invalid token mint for ${ids[i]} token`);
    }

    if (balances[ids[i]] == null) {
      balances[ids[i]] = {};
    }

    balances[ids[i]][to] ? (balances[ids[i]][to] += amounts[i]) : (balances[ids[i]][to] = amounts[i]);
  }


  return {state};
};
