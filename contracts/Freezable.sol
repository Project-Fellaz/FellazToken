pragma solidity 0.4.24;

import "./Administratable.sol";
contract Freezable is Administratable {

    bool public frozenToken;
    mapping (address => bool) public frozenAccounts;

    event FrozenFunds(address indexed _target, bool _frozen);
    event FrozenToken(bool _frozen);

    modifier isNotTokenFrozen() {
        require(!frozenToken);
        _;
    }

    modifier isNotFrozen( address _to ) {
        require(!frozenToken);
        require(!frozenAccounts[msg.sender] && !frozenAccounts[_to]);
        _;
    }

    modifier isNotFrozenFrom( address _from, address _to ) {
        require(!frozenToken);
        require(!frozenAccounts[msg.sender] && !frozenAccounts[_from] && !frozenAccounts[_to]);
        _;
    }

    function freezeAccount(address _target, bool _freeze) public onlySuperAdmins validateAddress(_target) {
        require(frozenAccounts[_target] != _freeze);
        frozenAccounts[_target] = _freeze;
        emit FrozenFunds(_target, _freeze);
    }

    function freezeToken(bool _freeze) public onlySuperAdmins {
        require(frozenToken != _freeze);
        frozenToken = _freeze;
        emit FrozenToken(frozenToken);
    }
}
