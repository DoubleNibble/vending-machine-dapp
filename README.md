npm install ganache-cli web3@1.0.0-beta.37 solc@0.5.3

node_modules/.bin/solcjs --bin --abi VendingMachine.sol

Web3 = require('web3')
web3 = new Web3("http://localhost:8545")

bytecode = fs.readFileSync('VendingMachine_sol_VendingMachine.bin').toString()
abi = JSON.parse(fs.readFileSync('VendingMachine_sol_VendingMachine.abi').toString())

deployedContract = new web3.eth.Contract(abi)

listOfItems = ['Coke', 'Lays', 'Kitkat']
itemPrices = ["1", "1.5", "2"]

deployedContract.deploy({
data: bytecode,
arguments: [listOfItems.map(name => web3.utils.asciiToHex(name)),
itemPrices.map(price => web3.utils.toWei(price))]
}).send({
from: '0x0c51CF7529E6Dd93a8461defd08cA2a781f7237E',
gas: 1500000,
gasPrice: web3.utils.toWei('0.00003', 'ether')
}).then((newContractInstance) => {
deployedContract.options.address = newContractInstance.options.address
console.log(newContractInstance.options.address)
});

Deployed address
0xEba62B4aD03463b95315e3a7CFaB3EEb18dfE4d1
