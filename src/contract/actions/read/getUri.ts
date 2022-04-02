import {Erc1155State} from '../../types/types'

export const getUri = async (state: Erc1155State) => {
  return {result: {uri: state.uri, batchBalances: null, }};
};
