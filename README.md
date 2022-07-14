# Solution to first ERC721 starknet tutorial

For simplicity I have pulled a docker image from [devnet](https://github.com/Shard-Labs/starknet-devnet) and deployed the workshop contracts there along with the tutorial ERC721. This worked faster for me.

```
npm install 
```
```
docker-compose up 
```

```
npx hardhat starknet-compile
```

```
npx hardhat test
```
## About the environment 

This works with devnet version : `0.2.2-arm`  ->  docker image config
this works with cairo-lang version : `0.8.1-arm` -> set in hardhat config.
## Difficulties

Transactions take long to load in voyager

## Solution

Have used the hardhat plugin and devnet @ [devnet](https://github.com/Shard-Labs/starknet-devnet) in order to speed up the process

wrote all the steps that lead to the collection of points in `tests/solve.js`

Was using the devnet version 0.1.23 and then got in touch with someone at Shard-Labs to help me speed it up, the solution was to use a more updated version. (0.2.2)

## Suggestions for the tutorial

1) Provide students an alternative to test their contracts and see their points rolling without having to wait too long, I remember I started the ERC20 tutorial a while ago but left it undone because claiming my points was taking too long on voyager

2) would be ideal if everything could be done locally, students could check their progress locally and then deploy their contracts to goerli:

    - a list of test files ( i.e exercise0.js )
    - commands to test one by one ( i.e `yarn test:exercise1`)
    - once all exercises are passed locally upload to contract in voyager
    - contract in voyager automatically calculates the points for students (no check callers needed)

3) An optional framework to the tutorial such as hardhat might be useful, many solidity devs are more familiar with hardhat and would love to have that framework to solve this tutorial ( the main point of the tutorial is to learn cairo, and how understand how starknet works)

4) add a translations ( chinese ) ( reference from Polygon edu)
