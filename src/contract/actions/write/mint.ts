import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const mint = async (
  state: Erc1155State,
  {caller, input: { to, id, amount}}: Erc1155Action
) => {

  const balance = state.balances;

  if (typeof to !== 'string') {
    throw new ContractError('to address must be valid')
  }

  if (!Number.isInteger(id)) {
    throw new ContractError('Invalid value for "id". Must be an integer');
  }

  if (!Number.isInteger(amount)) {
    throw new ContractError('Invalid value for "amount". Must be an integer');
  }

  if (amount <= 0) {
    throw new ContractError('Invalid token mint');
  }

  if(balance[id] == null){
    balance[id] = {};
  }

    balance[id][to] ? (balance[id][to] += amount) : (balance[id][to] = amount);


  return {state};
};
