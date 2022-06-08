// const { ArgentAccount } = require( "hardhat/types");
const { starknet, ethers } = require("hardhat");
const { ArgentAccount, OpenZeppelinAccount } = require("@shardlabs/starknet-hardhat-plugin/dist/src/account");
const { iterativelyCheckStatus } = require("@shardlabs/starknet-hardhat-plugin/dist/src/types");
const { expect } = require("chai");

const ERC721_name = starknet.shortStringToBigInt('Carlos');
const ERC721_symbol = starknet.shortStringToBigInt('CAR');
const tokenDecimals = ethers.utils.parseUnits('1');
let cAccount, cEvaluator, cERC721, cTDERC20, cDummyToken, cTDERC721_metadata;

describe("Core contracts setup", function () {

  this.timeout(1000_000);
  starknet.devnet.restart();
  
  it("should deploy a new account", async function () {
   
    cAccount = await starknet.deployAccount('OpenZeppelin');
  })

  it("should deploy core contracts", async function () {
    cfTDERC20 = await starknet.getContractFactory('TDERC20');
    cTDERC20 = await cfTDERC20.deploy({name : '327360763727160756219953' , symbol : '327360763727160756219953' , initial_supply : {low : 0n, high : 0n}, recipient : BigInt(cAccount.address), owner : BigInt(cAccount.address) });

    cfPlayersRegistry = await starknet.getContractFactory('players_registry');
    cPlayersRegistry = await cfPlayersRegistry.deploy({first_admin : BigInt(cAccount.address)});

    cfDummyToken = await starknet.getContractFactory('dummy_token');
    cDummyToken = await cfDummyToken.deploy({name : '323287074983686041199982', symbol: '4478027', initial_supply : {low : 0n , high : 100000000000000000000n}, recipient : BigInt (cAccount.address)});

    cfTDERC721_metadata = await starknet.getContractFactory('TDERC721_metadata');
    cTDERC721_metadata = await cfTDERC721_metadata.deploy({name : 6072054417219596849n, symbol : 6072054417219596849n, owner : BigInt(cAccount.address), base_token_uri : ['184555836509371486644298270517380613565396767415278678887948391494588524912','181013377130045435659890581909640190867353010602592517226438742938315085926', '2194400143691614193218323824727442803459257903'], token_uri_suffix : 199354445678n});
    cfEvaluator = await starknet.getContractFactory('Evaluator');
    cEvaluator = await cfEvaluator.deploy({_tderc20_address : BigInt(cTDERC20.address), _players_registry :BigInt(cPlayersRegistry.address) , _workshop_id : 3n, dummy_metadata_erc721_address : BigInt(cTDERC721_metadata.address) , _dummy_token_address : BigInt(cDummyToken.address)});
    await cAccount.invoke(cTDERC20,'set_teacher',{account : BigInt(cEvaluator.address), permission : 1n});
    await cAccount.invoke(cPlayersRegistry, 'set_exercise_or_admin', {account : BigInt(cEvaluator.address),permission : 1n});
  })

  it("set random value stores", async function (){
    await cAccount.invoke(cEvaluator,'set_random_values',{values : [2n, 7n, 4n ,8n, 7n, 6n, 1n, 7n, 6n, 5n, 4n, 8n, 8n, 5n, 6n, 3n, 8n, 2n, 8n, 6n, 5n, 7n, 3n, 1n, 8n, 6n, 7n, 3n, 6n, 8n, 1n, 7n, 3n, 8n, 2n, 3n, 4n, 5n, 2n, 5n, 7n, 3n, 3n, 4n, 4n, 4n, 5n, 8n, 1n, 7n, 1n, 5n, 7n, 1n, 3n, 2n, 5n, 7n, 8n, 8n, 7n, 1n, 8n, 4n, 1n, 6n, 2n, 1n, 6n, 6n, 4n, 7n, 2n, 1n, 2n, 3n, 5n, 1n, 3n, 8n, 6n, 5n, 5n, 2n, 7n, 8n, 4n, 6n, 4n, 5n, 4n,6n, 1n, 6n, 4n, 5n, 3n, 5n, 8n ,3n], column : 0n});
    await cAccount.invoke(cEvaluator,'set_random_values',{values : [2n, 7n, 4n ,8n, 7n, 6n, 1n, 7n, 6n, 5n, 4n, 8n, 8n, 5n, 6n, 3n, 8n, 2n, 8n, 6n, 5n, 7n, 3n, 1n, 8n, 6n, 7n, 3n, 6n, 8n, 1n, 7n, 3n, 8n, 2n, 3n, 4n, 5n, 2n, 5n, 7n, 3n, 3n, 4n, 4n, 4n, 5n, 8n, 1n, 7n, 1n, 5n, 7n, 1n, 3n, 2n, 5n, 7n, 8n, 8n, 7n, 1n, 8n, 4n, 1n, 6n, 2n, 1n, 6n, 6n, 4n, 7n, 2n, 1n, 2n, 3n, 5n, 1n, 3n, 8n, 6n, 5n, 5n, 2n, 7n, 8n, 4n, 6n, 4n, 5n, 4n,6n, 1n, 6n, 4n, 5n, 3n, 5n, 8n ,3n], column : 1n});
    await cAccount.invoke(cEvaluator,'set_random_values',{values : [2n, 7n, 4n ,8n, 7n, 6n, 1n, 7n, 6n, 5n, 4n, 8n, 8n, 5n, 6n, 3n, 8n, 2n, 8n, 6n, 5n, 7n, 3n, 1n, 8n, 6n, 7n, 3n, 6n, 8n, 1n, 7n, 3n, 8n, 2n, 3n, 4n, 5n, 2n, 5n, 7n, 3n, 3n, 4n, 4n, 4n, 5n, 8n, 1n, 7n, 1n, 5n, 7n, 1n, 3n, 2n, 5n, 7n, 8n, 8n, 7n, 1n, 8n, 4n, 1n, 6n, 2n, 1n, 6n, 6n, 4n, 7n, 2n, 1n, 2n, 3n, 5n, 1n, 3n, 8n, 6n, 5n, 5n, 2n, 7n, 8n, 4n, 6n, 4n, 5n, 4n,6n, 1n, 6n, 4n, 5n, 3n, 5n, 8n ,3n], column : 2n});

  })

  it("finish evaluator setup" , async function () {
    await cAccount.invoke(cEvaluator, 'finish_setup');
  }) 

})

describe("Solving Exercises", function () {

  this.timeout(1000_000);
  starknet.devnet.restart();
  
  it("Exercise 1 -- 6 points", async function () {
    const oldPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    const expectedPoints = tokenDecimals.mul(6n);
    cfERC721 = await starknet.getContractFactory('ERC721');
    cERC721 = await cfERC721.deploy({_dummy_token_address : BigInt(cDummyToken.address), name : ERC721_name, symbol : ERC721_symbol , to_ : BigInt(cEvaluator.address) });
    await cAccount.invoke(cEvaluator,'submit_exercise', {erc721_address : BigInt(cERC721.address)}); 
    await cAccount.invoke(cEvaluator,'ex1_test_erc721');
    const newPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    expect(newPtsCount).to.equal(expectedPoints.add(oldPtsCount));
  })
  it("Exercise 2 -- 2 points", async function () {

    const oldPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    const expectedPoints = tokenDecimals.mul(2n);
    await cAccount.invoke(cEvaluator,'ex2a_get_animal_rank');
    const assigned_legs_number = (await cEvaluator.call('assigned_legs_number',{player_address : BigInt(cAccount.address)}))['legs'];
    const assigned_sex_number =( await cEvaluator.call('assigned_sex_number',{player_address : BigInt(cAccount.address)}))['sex'];
    const assigned_wings_number = (await cEvaluator.call('assigned_wings_number',{player_address : BigInt(cAccount.address)}))['wings'];
    await cAccount.invoke(cERC721,'mint',{sex_ : assigned_sex_number , legs_ : assigned_legs_number, wings_ : assigned_wings_number, to_: BigInt(cEvaluator.address) });
    const curr_id = (await cERC721.call('getTokenCount') )  ['token_count'];
    await cAccount.invoke(cEvaluator,'ex2b_test_declare_animal',{token_id : curr_id});
    const newPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    expect(newPtsCount).to.equal(expectedPoints.add(oldPtsCount));
  })

  it("Exercise 3 -- 2 points", async function () {
    const oldPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    const expectedPoints = tokenDecimals.mul(2n);
    await cAccount.invoke(cEvaluator,'ex3_declare_new_animal');
    const newPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    expect(newPtsCount).to.equal(expectedPoints.add(oldPtsCount));
  })

  it("Exercise 4 -- 2 points", async function () {
    const oldPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    const expectedPoints = tokenDecimals.mul(2n);
    await cAccount.invoke(cEvaluator,'ex4_declare_dead_animal');
    const newPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    expect(newPtsCount).to.equal(expectedPoints.add(oldPtsCount));
  })

  it("Exercise 5 -- 4 points", async function () {
    const oldPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    const expectedPoints = tokenDecimals.mul(4n);
    await cAccount.invoke(cDummyToken,'faucet');
    await cAccount.invoke(cEvaluator,'ex5a_i_have_dtk');
    await cAccount.invoke(cDummyToken,'transfer',{recipient : BigInt(cEvaluator.address), amount : {low : 10000000000000000000n , high : 0n}});
    await cAccount.invoke(cEvaluator,'ex5b_register_breeder');
    const newPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    expect(newPtsCount).to.equal(expectedPoints.add(oldPtsCount));
  })

  it("Exercise 6 -- 2 points", async function () {
    const oldPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    const expectedPoints = tokenDecimals.mul(2n);
    await cAccount.invoke(cTDERC721_metadata,'mint', {to : BigInt(cAccount.address), token_id : {low : 1n,high : 0n}});
    await cAccount.invoke(cEvaluator,'ex6_claim_metadata_token',{token_id :{low : 1n,high : 0n} });
    const newPtsCount = (await cTDERC20.call('balanceOf', { account : BigInt(cAccount.address)} ))['balance']['low'];
    expect(newPtsCount).to.equal(expectedPoints.add(oldPtsCount));
  })

  //-------------------TODO Ex7
  // it("Exercise 7 .... TODO", async function () {
  // })

})