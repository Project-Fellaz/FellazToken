const token = artifacts.require('Fellaz');
var admin = "0xf0260E76837F6452Af6381F819057B8c2E53f6c2"; 
module.exports = async function (deployer) {
  await deployer.deploy(token, admin);
};