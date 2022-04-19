
const { assertRevert } = require('./helpers/assertRevert');
const Administratable = artifacts.require('Administratable');

const should = require('chai')
  .should();

contract('Administratable', (accounts) => {
  beforeEach(async function () {
    this.administratable = await Administratable.new({from: accounts[0]});
  });

  describe('addSuperAdmin', () => {
    it('contract owner can add a super Admin', async function () {
      // accounts[1] is not a super admin
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(false);

      // account[0] is the contract owner so can add superAdmin
      await this.administratable.addSuperAdmin(accounts[1]);

      // accounts[1] is now a super admin
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(true);
    });

    it('a super admin can not add another super admin', async function () {
      // this should fail because accounts[1] is not a super admin
      await assertRevert(
        this.administratable.addSuperAdmin(accounts[2], {from: accounts[1]})
      );
    });

    it('a non super admin cannot add another super admin', async function () {
      // this should fail because accounts[1] is not a super admin
      await assertRevert(
        this.administratable.addSuperAdmin(accounts[1], {from: accounts[2]})
      );
    });

    it('cannot add a super admin that is already a super admin', async function () {
      await this.administratable.addSuperAdmin(accounts[1]);

      // second call fails
      await assertRevert(this.administratable.addSuperAdmin(accounts[1]));
    });
  });

  describe('removeSuperAdmin', () => {
    it('contract owner can remove a super Admin', async function () {
      // accounts[1] is not a super admin
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(false);

      // account[0] is the contract owner so can add superAdmin
      await this.administratable.addSuperAdmin(accounts[1]);

      // accounts[1] is now a super admin
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(true);

      // account[0] is the contract owner so can add superAdmin
      await this.administratable.removeSuperAdmin(accounts[1]);

      // accounts[1] is now a super admin
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(false);

    });

    it('a super admin can not remove another super admin', async function () {
      // this should fail because accounts[1] is not a super admin

      // accounts[1] is not a super admin
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(false);
      await this.administratable.addSuperAdmin(accounts[1]);
      (await this.administratable.superAdmins(accounts[1])).should.be.equal(true);

      (await this.administratable.superAdmins(accounts[2])).should.be.equal(false);
      await this.administratable.addSuperAdmin(accounts[2]);
      (await this.administratable.superAdmins(accounts[2])).should.be.equal(true);

      await assertRevert(
        this.administratable.addSuperAdmin(accounts[2])
      );

      await assertRevert(
        this.administratable.removeSuperAdmin(accounts[2], {from: accounts[1]})
      );

      await assertRevert(
        this.administratable.removeSuperAdmin(accounts[3])
      );

      await assertRevert(
        this.administratable.removeSuperAdmin(this.administratable.address)
      );
    });

    it('a non super admin cannot add another super admin', async function () {
      // this should fail because accounts[1] is not a super admin
      await assertRevert(
        this.administratable.addSuperAdmin(accounts[1], {from: accounts[2]})
      );
    });

    it('cannot add a super admin that is already a super admin', async function () {
      await this.administratable.addSuperAdmin(accounts[1]);

      // second call fails
      await assertRevert(this.administratable.addSuperAdmin(accounts[1]));
    });
  });

});