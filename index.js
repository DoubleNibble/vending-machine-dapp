web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let account;

abi = JSON.parse(
  '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"itemList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"item","type":"bytes32"}],"name":"totalItemsRemaining","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"item","type":"bytes32"}],"name":"validItem","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"itemCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"itemPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"item","type":"bytes32"}],"name":"buyItem","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"itemNames","type":"bytes32[]"},{"name":"prices","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
);

contract = new web3.eth.Contract(abi);
contract.options.address = "0x5da364cB5F472ba03606cEb06fc89A4d416b31B4";
// update this contract address with your contract address

items = { F1: "Coke", F2: "Lays", F3: "Kitkat" };

$(document).ready(function() {
  web3.eth
    .getAccounts()
    .then(accounts => {
      account = accounts[0];
    })
    .then(() =>
      web3.eth
        .getBalance(account)
        .then(balance =>
          $("#balance").html(web3.utils.fromWei(balance, "ether"))
        )
    );

  itemNames = Object.values(items);

  for (let i = 0; i < itemNames.length; i++) {
    let name = itemNames[i];

    contract.methods
      .totalItemsRemaining(web3.utils.asciiToHex(name))
      .call()
      .then(count => {
        $("#quantity-" + name).html(count);
      });
  }
});

let $selection = $(".selection");
let $input_selection = $("#selection");

// Make selecting as annoying as a real machine
$selection.find("a").click(function() {
  let $selected = $(this);
  let value = $selected.text();
  $input_selection.val(value);
});

// On Vend - a three step process
function buyItem() {
  // Step 1: Get the itemName and itemPrice from the DOM
  let code = $input_selection.val().toUpperCase();
  itemName = items[code];
  itemPrice = $("#price-" + itemName).text();
  console.log(itemName, itemPrice);

  // Step 2: Call the buyItem method in the contract and send the payable amount
  contract.methods
    .buyItem(web3.utils.asciiToHex(itemName))
    .send({ from: account, value: web3.utils.toWei(itemPrice, "ether") })
    .then(tx => {
      // Step 3: Get the updated item counts and account balance
      let name = items[code];
      contract.methods
        .totalItemsRemaining(web3.utils.asciiToHex(name))
        .call()
        .then(count => {
          $("#quantity-" + name).html(count);
          web3.eth
            .getBalance(account)
            .then(balance =>
              $("#balance").html(web3.utils.fromWei(balance, "ether"))
            );
        });
    });
}
