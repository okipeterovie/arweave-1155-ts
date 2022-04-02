import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const transfer = async (
  state: Erc1155State,
  {caller, input: {from, to, id, amount}}: Erc1155Action
) => {
  const balances = state.balances;

  if (typeof from !== 'string') {
    throw new ContractError('from address must be valid')
  }

  if (typeof to !== 'string') {
    throw new ContractError('to address must be valid')
  }

  if (!Number.isInteger(id)) {
    throw new ContractError('Invalid value for "id". Must be an integer');
  }

  if (!Number.isInteger(amount)) {
    throw new ContractError('Invalid value for "amount". Must be an integer');
  }

  if (amount <= 0 || from === to) {
    throw new ContractError('Invalid token transfer');
  }

  if (!(from === caller || state.operatorApprovals[from][caller])) {
    throw new ContractError('caller is not owner nor approved');
  }

  if (!balances[from]) {
    throw new ContractError(`From balance is not defined!`);
  }

  if (balances[from] < amount) {
    throw new ContractError(
      `From balance not high enough to send ${amount} token(s)!`
    );
  }

  balances[id][from] -= amount;

  balances[id][to] ? (balances[id][to] += amount) : (balances[id][to] = amount);

  return {state};
};
