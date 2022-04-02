import {Erc1155Action, Erc1155State} from '../../types/types'

declare const ContractError;

export const setUri = async (
  state: Erc1155State,
  {input: {uri}}: Erc1155Action
) => {

  if (typeof uri !== 'string') {
    throw new ContractError('uri must be string');
  }

  state.uri = uri;

  return {state};
};
