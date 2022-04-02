import {Erc1155Action, Erc1155Result, Erc1155State} from './types/types';
import {getUri} from "./actions/read/getUri";
import {setUri} from "./actions/write/setUri";
import {balanceOf} from "./actions/read/balanceOf";
import {balanceOfBatch} from "./actions/read/balanceOfBatch";
import {isApprovedForAll} from "./actions/read/isApprovedForAll";
import {mint} from "./actions/write/mint";
import {mintBatch} from "./actions/write/mintBatch";
import {transferBatch} from "./actions/write/transferBatch";
import {transfer} from "./actions/write/transfer";
import {setApprovedForAll} from "./actions/write/setApprovedForAll";

declare const ContractError;

declare type ContractResult = { state: Erc1155State } | { result: Erc1155Result };

export async function handle(
  state: Erc1155State,
  action: Erc1155Action
): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'getUri':
      return await getUri(state);
    case 'setUri':
      return await setUri(state, action);
    case 'balanceOf':
      return await balanceOf(state, action);
    case "balanceOfBatch":
      return await balanceOfBatch(state, action);
    case "isApprovedForAll":
      return await isApprovedForAll(state, action);
    case "mint":
      return await mint(state, action);
    case "mintBatch":
      return await mintBatch(state, action).catch(e => {throw new ContractError(e)});
    case "safeBatchTransferFrom":
      return await transferBatch(state, action);
    case "safeTransferFrom":
      return await transfer(state, action);
    case "setApprovalForAll":
      return await setApprovedForAll(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`
      );
  }
}
