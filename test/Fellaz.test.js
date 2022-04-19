const { assertRevert } = require('./helpers/assertRevert');
const Cryptonium = artifacts.require('Fellaz');
const BigNumber = web3.BigNumber;
const INITIAL_SUPPLY = new BigNumber(1000000000).mul(1000000000000000000);

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';


const MAX_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
 const ADVISOR_LOCKUP_END = new BigNumber(1551398399);
 const TEAM_LOCKUP_END = new BigNumber(1567295999);

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Fellaz', (accounts) => {
  beforeEach(async function () {
    this.crn = await Cryptonium.new(
      // set accounts[1] to be registry
      accounts[1]
    );
  });

  describe('constructor', () => {
    it('validate token minting', async function () {
      // accounts[0] should be the owner
      (await this.crn.owner()).should.be.equal(accounts[0]);

      // total supply should be initial supply
      (await this.crn.totalSupply()).should.be.bignumber.equal(INITIAL_SUPPLY);

      // balance of register (accounts[1]) should be initial_supply
      (await this.crn.balanceOf(accounts[0])).should.be.bignumber.equal(0);
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);

      // accounts[1] should be a super admin
      (await this.crn.superAdmins(accounts[0])).should.be.equal(false);
      (await this.crn.superAdmins(accounts[1])).should.be.equal(true);
      (await this.crn.superAdmins(accounts[2])).should.be.equal(false);
    });
  });

  describe('transfer', () => {
    it('simple transfer case should succeed and change balance', async function () {
      // transfer tokens from registry (accounts[1]) to another account
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

      // perform transfer
      await this.crn.transfer(accounts[2], 5000, {from: accounts[1]});

      // balances should be updated
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY.sub(5000));
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));
    });

    it('batch transfer case should succeed and change balance', async function () {
      // transfer tokens from registry (accounts[1]) to another account
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

      // perform transfer
      await this.crn.batchTransfer([accounts[3], accounts[4]], [1000, 1000], {from: accounts[1]});

      // balances should be updated
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY.sub(2000));
      (await this.crn.balanceOf(accounts[3])).should.be.bignumber.equal(new BigNumber(1000));
      (await this.crn.balanceOf(accounts[4])).should.be.bignumber.equal(new BigNumber(1000));
    });


    it('transferFrom case should succeed and change balance', async function () {
      // transfer tokens from registry (accounts[1]) to another account
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

      // perform transfer
      await this.crn.transfer(accounts[2], 5000, {from: accounts[1]});
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));


      const spender = accounts[3];
      await this.crn.approve(spender, 1000, { from: accounts[2] });
      (await this.crn.allowance(accounts[2], spender)).should.be.bignumber.equal(1000);

      await this.crn.transferFrom(accounts[2], accounts[3], 1000, { from: spender });

      // balances should be updated
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(4000));
    });

    it('batchTransferFrom case should succeed and change balance', async function () {
      // transfer tokens from registry (accounts[1]) to another account
      (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

      // perform transfer
      await this.crn.transfer(accounts[2], 5000, {from: accounts[1]});
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));


      const spender = accounts[3];
      await this.crn.approve(spender, 2000, { from: accounts[2] });
      (await this.crn.allowance(accounts[2], spender)).should.be.bignumber.equal(2000);

      await this.crn.batchTransferFrom(accounts[2], [accounts[3],accounts[4]], [1000, 1000], { from: spender });

      // balances should be updated
      (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(3000));
      (await this.crn.balanceOf(accounts[3])).should.be.bignumber.equal(new BigNumber(1000));
      (await this.crn.balanceOf(accounts[4])).should.be.bignumber.equal(new BigNumber(1000));

    }); 


   // it('batchTransferFrom case should failed when param array length is different', async function () {
   //    // transfer tokens from registry (accounts[1]) to another account
   //    (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
   //    (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

   //    // perform transfer
   //    await this.crn.transfer(accounts[2], 5000, {from: accounts[1]});
   //    (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));


   //    const spender = accounts[3];
   //    await this.crn.approve(spender, 2000, { from: accounts[2] });
   //    (await this.crn.allowance(accounts[2], spender)).should.be.bignumber.equal(2000);

   //    // await assertRevert(await this.crn.batchTransferFrom(accounts[2], [accounts[4]], [1000, 1000], { from: spender }));

   //  }); 


   //  it('batchTransferFrom case should failed when receiver is zero address.', async function () {
   //    // transfer tokens from registry (accounts[1]) to another account
   //    (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
   //    (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

   //    // perform transfer
   //    await this.crn.transfer(accounts[2], 5000, {from: accounts[1]});
   //    (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));


   //    const spender = accounts[3];
   //    await this.crn.approve(spender, 2000, { from: accounts[2] });
   //    (await this.crn.allowance(accounts[2], spender)).should.be.bignumber.equal(2000);
   //    // await assertRevert(await this.crn.batchTransferFrom(accounts[2], [ZERO_ADDRESS, accounts[3]], [1000, 1000], { from: spender }));

   //  }); 

   //  it('batchTransferFrom case should failed when value is zero.', async function () {
   //    // transfer tokens from registry (accounts[1]) to another account
   //    (await this.crn.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
   //    (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(0);

   //    // perform transfer
   //    await this.crn.transfer(accounts[2], 5000, {from: accounts[1]});
   //    (await this.crn.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));


   //    const spender = accounts[3];
   //    await this.crn.approve(spender, 2000, { from: accounts[2] });
   //    (await this.crn.allowance(accounts[2], spender)).should.be.bignumber.equal(2000);
   //    // await assertRevert(await this.crn.batchTransferFrom(accounts[2], [accounts[3], accounts[4]], [0, 1000], { from: spender }));

   //  }); 




    it('transfer fails when token is frozen', async function () {
      // freeze accounts[1]
      await this.crn.freezeToken(true, {from: accounts[1]});
      (await this.crn.frozenToken()).should.be.equal(true);

      // perform transfer
      await assertRevert(this.crn.transfer(accounts[2], 5000, {from: accounts[1]}));
    });

    it('batchTransfer fails when token is frozen', async function () {
      // freeze accounts[1]
      await this.crn.freezeToken(true, {from: accounts[1]});
      (await this.crn.frozenToken()).should.be.equal(true);

      // perform transfer
      await assertRevert(this.crn.batchTransfer([accounts[2], accounts[3]], [1000, 1000], {from: accounts[1]}));
    });

    // it('batchTransfer fails when receiver is zero address.', async function () {
    //   await assertRevert(this.crn.batchTransfer([ZERO_ADDRESS, accounts[3]], [1000, 1000], {from: accounts[1]}));
    // });

    // it('batchTransfer fails when array length is different. ', async function () {
    //   await assertRevert(this.crn.batchTransfer([accounts[2], accounts[3]], [1000], {from: accounts[1]}));
    // });

    // it('batchTransfer fails when value is zero. ', async function () {
    //   await assertRevert(this.crn.batchTransfer([accounts[2], accounts[3]], [0, 1000], {from: accounts[1]}));
    // });

    // it('batchTransfer fails when sender is receiver. ', async function () {
    //   await assertRevert(this.crn.batchTransfer([accounts[1], accounts[3]], [1000, 1000], {from: accounts[1]}));
    // });





    it('transfer fails when token is frozen', async function () {
      // freeze accounts[1]
      await this.crn.freezeToken(true, {from: accounts[1]});
      (await this.crn.frozenToken()).should.be.equal(true);

      // perform transfer
      await assertRevert(this.crn.transfer(accounts[2], 5000, {from: accounts[1]}));
    });



    it('transfer fails if sender is frozen', async function () {
      // freeze accounts[1]
      await this.crn.freezeAccount(accounts[1], true, {from: accounts[1]});

      // perform transfer
      await assertRevert(this.crn.transfer(accounts[2], 5000, {from: accounts[1]}));
    });


    it('transfer fails if destination is frozen', async function () {
      // freeze accounts[1]
      await this.crn.freezeAccount(accounts[2], true, {from: accounts[1]});

      // perform transfer
      await assertRevert(this.crn.transfer(accounts[2], 5000, {from: accounts[1]}));
    });

    it('transfer fails if destination is not a valid address', async function () {
      /* TODO */
      
      await assertRevert(
        this.crn.transfer(ZERO_ADDRESS, 100, {from: accounts[2]})
      );
    });

    it('when the spender is the frozen account', async function () {
        const amount = 100;
        const spender = accounts[2];
        await this.crn.freezeAccount(accounts[1], true, {from: accounts[0]});
        // this should fail because accounts[1] is frozen account
        await assertRevert(this.crn.approve(spender, amount, { from: accounts[1] }));
    });

    it('when the spender is the frozen token', async function () {
        const amount = 100;
        const spender = accounts[2];
        // this should fail because accounts[1] is frozen account
        await this.crn.freezeToken(true, {from: accounts[0]});
        (await this.crn.frozenToken()).should.be.equal(true);

        await assertRevert(this.crn.approve(spender, amount, { from: accounts[1] }));
        await assertRevert(this.crn.transferFrom(accounts[1], accounts[3], amount, { from: spender }));
        await assertRevert(this.crn.batchTransferFrom(accounts[1], [accounts[3],accounts[4]], [1,1], { from: spender }));
    });

    it('when the spender is the frozen token[batchTransferFrom]', async function () {
        const amount = 100;
        const spender = accounts[2];
        // this should fail because accounts[1] is frozen account
        await this.crn.freezeToken(true, {from: accounts[0]});
        (await this.crn.frozenToken()).should.be.equal(true);

        await assertRevert(this.crn.approve(spender, amount, { from: accounts[1] }));
        await assertRevert(this.crn.batchTransferFrom(accounts[1], [accounts[3],accounts[4]], [1,1], { from: spender }));
    });

    // it('batchTransferFrom fails when array length is different.', async function () {
    //     const amount = 100;
    //     const spender = accounts[2];
    //     await assertRevert(this.crn.approve(spender, amount, { from: accounts[1] }));
    //     await assertRevert(this.crn.batchTransferFrom(accounts[1], [accounts[4]], [1,1], { from: spender }));
    // });



    it('when the spender is the frozen account(message sender)', async function () {
        const amount = 100;
        const spender = accounts[2];

        await this.crn.freezeAccount(accounts[1], true, {from: accounts[0]});
        await assertRevert(this.crn.approve(spender, amount, { from: accounts[1] }));
        await assertRevert(this.crn.transferFrom(accounts[1], accounts[3], amount, { from: spender }));
    });

    it('increase allowance', async function () {
        const amount = 100;
        const spender = accounts[2];
        const increasedAmount = 200;

        await this.crn.approve(spender, amount, { from: accounts[1] });
        (await this.crn.allowance(accounts[1], spender)).should.be.bignumber.equal(amount);


        await this.crn.increaseAllowance(spender, amount, { from: accounts[1] });
        (await this.crn.allowance(accounts[1], spender)).should.be.bignumber.equal(increasedAmount);
    });

    it('decrease allowance', async function () {
        const amount = 100;
        const spender = accounts[2];
        const decreasedAmount = 50;

        await this.crn.approve(spender, amount, { from: accounts[1] });
        (await this.crn.allowance(accounts[1], spender)).should.be.bignumber.equal(amount);

        await this.crn.decreaseAllowance(spender, decreasedAmount, { from: accounts[1] });
        (await this.crn.allowance(accounts[1], spender)).should.be.bignumber.equal(decreasedAmount);
    });

    it('change owner and add super admin', async function () {
        await this.crn.transferOwnership(accounts[2]);
        (await this.crn.owner()).should.be.equal(accounts[2]);
        await this.crn.addSuperAdmin(accounts[3], { from: accounts[2] });
        (await this.crn.superAdmins(accounts[3])).should.be.equal(true);

        await this.crn.removeSuperAdmin(accounts[3], { from: accounts[2] });
        (await this.crn.superAdmins(accounts[3])).should.be.equal(false);
        await assertRevert( this.crn.addSuperAdmin(accounts[3], { from: accounts[5] }));
    });
  });
});