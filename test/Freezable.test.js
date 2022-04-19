
const { assertRevert } = require('./helpers/assertRevert');
const Freezable = artifacts.require('Freezable');

const should = require('chai')
  .should();

contract('Freezable', (accounts) => {
	beforeEach(async function () {
		this.freezable = await Freezable.new({from: accounts[0]});
	});

	describe('freezeAccount', () => {
		it('contract owner can freeze token', async function () {
			// accounts[1] is not a super admin
			(await this.freezable.frozenToken()).should.be.equal(false);
			await this.freezable.freezeToken(true);
			(await this.freezable.frozenToken()).should.be.equal(true);

			await assertRevert(
				this.freezable.freezeToken(true)
			); 

		});

		it('non owner can not freeze token', async function () {
			// accounts[1] is not a super admin
			(await this.freezable.frozenToken()).should.be.equal(false);
			await assertRevert(
				this.freezable.freezeToken(true, {from: accounts[1]})
			); 
			(await this.freezable.frozenToken()).should.be.equal(false);
		});


		it('contract owner can add a frozen account', async function () {
			// accounts[1] is not a super admin
			(await this.freezable.frozenAccounts(accounts[1])).should.be.equal(false);
			// account[0] is the contract owner so can add superAdmin
			await this.freezable.freezeAccount(accounts[1], true);
			// accounts[1] is now a super admin
			(await this.freezable.frozenAccounts(accounts[1])).should.be.equal(true);
		});

		it('a non super admin can not freeze another account', async function () {
			// this should fail because accounts[1] is not a super admin
			await assertRevert(
				this.freezable.freezeAccount(accounts[2], true, {from: accounts[1]})
			);
		});

		it('cannot add a frozen account that is already a frozen account', async function () {
		  	await this.freezable.freezeAccount(accounts[1], true);
		  	(await this.freezable.frozenAccounts(accounts[1])).should.be.equal(true);
		 	// second call fails
		  	await assertRevert(
				this.freezable.freezeAccount(accounts[1], true)
			); 
		});
	});
});