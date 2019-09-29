pragma solidity >=0.4.0 <0.6.0;
// We have to specify what version of compiler this code will compile with

contract VendingMachine {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is item name stored as type bytes32 and value is
  an unsigned integer to store the item count and the item price in wei.
  */
  
  mapping (bytes32 => uint256) public itemCount;
  mapping (bytes32 => uint256) public itemPrice;
  
  /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
  We will use an array of bytes32 instead to store the list of items
  */
  
  bytes32[] public itemList;

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of items and another array with their prices in wei.
  For ex: (["Coke", "Lays", "Kitkat"], [1000, 1500, 1200])
  */
  constructor(bytes32[] memory itemNames, uint[] memory prices) public {
    require(itemNames.length == prices.length);
    itemList = itemNames;
    for(uint i = 0; i < itemList.length; i++) {
        itemCount[itemList[i]] = 10;
        itemPrice[itemList[i]] = prices[i];
    }
  }

  // This function returns the remaining quantity of a particular item
  function totalItemsRemaining(bytes32 item) public view returns (uint256) {
    require(validItem(item));
    return itemCount[item];
  }

  // This function pays for an item and decrements the item count for the specified item.
  // This is equivalent to buying an item
  function buyItem(bytes32 item) public payable {
    require(validItem(item));
    require(itemPrice[item] == msg.value);
    itemCount[item] -= 1;
  }

  function validItem(bytes32 item) public view returns (bool) {
    for(uint i = 0; i < itemList.length; i++) {
      if (itemList[i] == item && itemCount[item] > 0) {
        return true;
      }
    }
    return false;
  }
}