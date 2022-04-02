import * as fs from 'fs';
import ArLocal from 'arlocal';
// @ts-ignore
import Arweave from "arweave";
import {JWKInterface} from 'arweave/node/lib/wallet';
import * as path from 'path';
import {addFunds, mineBlock} from './_helper';
import {LoggerFactory, SmartWeave, SmartWeaveNodeFactory,} from 'redstone-smartweave';

describe('Testing the Arweave 1155', () => {
  let contractSrc: string;

  let wallet: JWKInterface;
  let walletAddress: string;

  let initialState: any;

  let arweave: Arweave;
  let arlocal: ArLocal;
  let smartweave: SmartWeave;
  let contract: any;

  beforeAll(async () => {
    arlocal = new ArLocal(1820);
    await arlocal.start();

    arweave = Arweave.init({
      host: 'localhost',
      port: 1820,
      protocol: 'http',
    });

    LoggerFactory.INST.logLevel('error');

    LoggerFactory.INST.logLevel("debug", "ArweaveGatewayInteractionsLoader");


    smartweave = SmartWeaveNodeFactory.memCached(arweave);
    wallet = await arweave.wallets.generate();
    await addFunds(arweave, wallet);
    walletAddress = await arweave.wallets.jwkToAddress(wallet);

    contractSrc = fs.readFileSync(
      path.join(__dirname, '../dist/contract.js'),
      'utf8'
    );

    initialState = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../dist/contract/initial-state.json'),
        'utf8'
      )
    );

    const contractTxId = await smartweave.createContract.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });

    contract = smartweave.pst(contractTxId);
    contract.connect(wallet);

    await mineBlock(arweave);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('should read initial state', async () => {
    expect(await contract.currentState()).toEqual(initialState);
  });

  it('should set URI', async () => {
    await contract.writeInteraction({
      function: 'setUri',
      uri: 'workfromhome',
    });

    await mineBlock(arweave);
    expect((await contract.currentState()).uri).toEqual("workfromhome");
  });

  it('should get URI', async () => {
    await contract.writeInteraction({
      function: 'getUri'
    });

    await mineBlock(arweave);
    expect((await contract.currentState()).uri).toEqual("workfromhome");
  });

  it('should mint tokens', async () => {
    await contract.writeInteraction({
      function: 'mint',
      to: walletAddress,
      id: 1,
      amount: 10
    });

    await mineBlock(arweave);

    await contract.writeInteraction({
      function: 'mint',
      to: 'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI',
      id: 2,
      amount: 20
    });

    await mineBlock(arweave);
    expect((await contract.currentState()).balances[1][walletAddress]).toEqual(10);
    expect((await contract.currentState()).balances[2]['GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI']).toEqual(20);
  });


  it('should mint tokens in batch', async () => {
    await contract.writeInteraction({
      function: 'mintBatch',
      to: walletAddress,
      ids: [3,4],
      amounts: [1,10]
    });

    await mineBlock(arweave);
    expect((await contract.currentState()).balances[3][walletAddress]).toEqual(1);
    expect((await contract.currentState()).balances[4][walletAddress]).toEqual(10);
  });

  it('should set Approved for all', async () => {
    await contract.writeInteraction({
      function: 'setApprovalForAll',
      operator: 'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI',
      approved: true
    });

    await mineBlock(arweave);
    expect((await contract.currentState())
      .operatorApprovals[walletAddress]['GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI'])
      .toEqual(true);
  });
});
