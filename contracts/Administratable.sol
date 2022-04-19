pragma solidity 0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Administratable is Ownable {
	mapping (address => bool) public superAdmins;

	event AddSuperAdmin(address indexed admin);
	event RemoveSuperAdmin(address indexed admin);

    modifier validateAddress( address _addr )
    {
        require(_addr != address(0x0));
        require(_addr != address(this));
        _;
    }

	modifier onlySuperAdmins {
		require(msg.sender == owner() || superAdmins[msg.sender]);
		_;
	}

	function addSuperAdmin(address _admin) public onlyOwner validateAddress(_admin){
		require(!superAdmins[_admin]);
		superAdmins[_admin] = true;
		emit AddSuperAdmin(_admin);
	}

	function removeSuperAdmin(address _admin) public onlyOwner validateAddress(_admin){
		require(superAdmins[_admin]);
		superAdmins[_admin] = false;
		emit RemoveSuperAdmin(_admin);
	}
}
