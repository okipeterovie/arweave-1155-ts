export interface Erc1155State {
  name: string;
  uri: string;
  operatorApprovals: {
    [address: string]: Approvals
  };
  balances: {
    [tokenId: number]: {[address: string]: number};
  }


}

export interface AddressAmount {
  [address: string]: number;
}

export interface Approvals {
  [address: string]: boolean;
}

export interface Erc1155Action {
  input: Erc1155Input;
  caller: string;
}

export interface Erc1155Input {
  function: Erc1155Function;
  operator: string;
  approved: boolean;
  account: string;
  accounts: string[];
  from: string;
  to: string;
  id: number;
  ids: number[];
  amount: number;
  amounts: number[];
  uri: string;
}

export interface Erc1155Result {
  balance?: number;
  batchBalances?: number[];
  uri?: string;
  operatorApproval?: boolean;
}

export type Erc1155Function =
  'getUri'
  | 'setUri'
  | 'balanceOf'
  | 'balanceOfBatch'
  | 'setApprovalForAll'
  | 'isApprovedForAll'
  | 'safeTransferFrom'
  | 'safeBatchTransferFrom'
  | 'mint'
  | 'mintBatch';
