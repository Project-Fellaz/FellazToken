pragma solidity 0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import './Freezable.sol';

contract Fellaz is ERC20Burnable, Freezable
{
    string  public  constant name       = "Fellaz Token";
    string  public  constant symbol     = "FLZ";
    uint8   public  constant decimals   = 18;
    uint256 private constant _totalAmount = 2000000000e18;
    
    event Burn(address indexed _burner, uint _value);

    constructor( address _registry ) public
    {
        _mint(_registry, _totalAmount);
        addSuperAdmin(_registry);
    }


    /**
    * @dev Transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */    
    function transfer(address _to, uint _value) public validateAddress(_to) isNotFrozen(_to) returns (bool) 
    {
        return super.transfer(_to, _value);
    }

    /**
    * @dev Transfer tokens from one address to another
    * @param _from address The address which you want to send tokens from
    * @param _to address The address which you want to transfer to
    * @param _value uint256 the amount of tokens to be transferred
    */
    function transferFrom(address _from, address _to, uint _value) public validateAddress(_to)  isNotFrozenFrom(_from, _to) returns (bool) 
    {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public validateAddress(_spender) isNotFrozen(_spender)  returns (bool) 
    {
        return super.approve(_spender, _value);
    }

    function increaseAllowance( address _spender, uint256 _addedValue ) public validateAddress(_spender) isNotFrozen(_spender)  returns (bool)
    {
        return super.increaseAllowance(_spender, _addedValue);
    }

    function decreaseAllowance(address _spender, uint256 _subtractedValue) public validateAddress(_spender) isNotFrozen(_spender)  returns (bool)
    {
        return super.decreaseAllowance(_spender, _subtractedValue);
    }

    // function batchTransfer(address[] recipients, uint256[] values) public isNotTokenFrozen() returns (bool) {
    //     uint256 length = recipients.length;
    //     require(length == values.length, "ERC20: inconsistent arrays");
    //     address sender = msg.sender;
    //     uint256 totalValue;
        
    //     for (uint256 i; i != length; ++i) {
    //         address to = recipients[i];
    //         require(to != address(0), "ERC20: to zero address");

    //         uint256 value = values[i];
    //         if (value != 0) {
    //             uint256 newTotalValue = totalValue + value;
    //             require(newTotalValue > totalValue, "ERC20: values overflow");
    //             totalValue = newTotalValue;
    //             if (sender != to) {
    //                 transfer(to, value);
    //             } 
    //         }
    //     }
    //     return true;
    // }    

    // function batchTransferFrom( address from, address[]  recipients, uint256[]  values ) public  isNotTokenFrozen() returns (bool) {
    //     uint256 length = recipients.length;
    //     require(length == values.length, "ERC20: inconsistent arrays");

    //     uint256 totalValue;
    //     for (uint256 i; i != length; ++i) {
    //         address to = recipients[i];
    //         require(to != address(0), "ERC20: to zero address");

    //         uint256 value = values[i];
    //         if (value != 0) {
    //             uint256 newTotalValue = totalValue + value;
    //             require(newTotalValue > totalValue, "ERC20: values overflow");
    //             totalValue = newTotalValue;
    //             if (from != to) {
    //                 transferFrom(from, to, value);
    //             }
    //         }
    //     }
    //     return true;
    // }

}   

