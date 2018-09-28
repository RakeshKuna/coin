let Web3 = require('web3');
var Promise = require("bluebird");
const util = require('ethereumjs-util');
var config = require('./../mlcConfig');
var async = require('async');
var TestRPC = require("ethereumjs-testrpc");
var tokenABI = require('./../TokenABI');

async function doTransaction(toAddress, tokensCount){

    try {
        let web3 = new Web3();

        var tokenAddress = config.tokenAddress;
        var fromAddress = config.fromAddress;
        var privateKey = config.privateKey;

        web3 = new Web3(new Web3.providers.HttpProvider(config.web3HTTPProvider));

        console.log("Tokens Count:", tokensCount/1000000000000000000);

        //const contractInstance = new web3.eth.Contract(tokenABI, tokenAddress,{from: fromAddress, gas: 1000000});
        const contractInstance = new web3.eth.Contract(tokenABI, tokenAddress);

        contractInstance.setProvider(new Web3.providers.HttpProvider(config.web3HTTPProvider));

        // web3.eth.personal.unlockAccount(tokenAddress, "raksan987", 600).then(console.log('Account unlocked!'));

        //let encodedABI = contractInstance.methods.transfer(to, amount).encodeABI();

        let encodedABI = contractInstance.methods.transfer(toAddress, tokensCount).encodeABI();

        var nonce_count = await web3.eth.getTransactionCount(fromAddress, "pending");
        //var nonce_count = await web3.eth.getTransactionCount(fromAddress);
        const nonceHex = web3.utils.toHex(nonce_count);

        var gp = 3000000000;
        //var gp = 3000000000/6;

        console.log("Nonce  value is", nonce_count);
        console.log("nonceHex  value is", nonceHex);
        console.log("gasprice value is", gp);

        const gasPriceHex = web3.utils.toHex(gp);
        const gasLimitHex = web3.utils.toHex(500000);
        const gasHex = web3.utils.toHex(1000000);

        const value = web3.utils.toHex(10);
        const chainId = 0x3;

        let tx = {
            nonce: nonceHex,
            from: fromAddress,
            to  : tokenAddress, // to transfer the token coins
            gas : gasHex,
            data: encodedABI,
            gasPrice: gasPriceHex,
            gasLimit: gasLimitHex,
            value : '0x0' // To transfer the token coins
        };

        return new Promise(async function(resolve, reject) {
            await web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            console.log("IN signTransaction in...");

            let tran =  web3.eth.sendSignedTransaction(signed.rawTransaction).on('transactionHash',  (hash)=>{
                console.log("Address is :",  toAddress);
                console.log("Hash is:", hash);
                resolve({"TxHash": hash});
                return hash;
                });

                /*
                let tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
                tran.on('transactionHash', (hash) => {
                   console.log("Transaction of :",  hash);
                    resolve({"TxHash": hash});
                });
                tran.on('receipt', (receipt) =>{
                    console.log("Transaction status in receipt :",receipt.status);    // Gives recipt of the transaction
                });
                */
            });
        });
        console.log("After signTransaction..");
        //console.log("Accounts:",web3.eth.accounts);

        } // End of the try
    catch(e) {
        console.log("Exception in Send SignedTransaction.......:", e.toString())
    }
} // End of doTransaction.

async function doStatus(transHash){

            let web3 = new Web3();

            var tokenAddress = config.tokenAddress;
            var fromAddress = config.fromAddress;
            var privateKey = config.privateKey;

            web3 = new Web3(new Web3.providers.HttpProvider(config.web3HTTPProvider));
            const contractInstance = new web3.eth.Contract(tokenABI, tokenAddress);
            contractInstance.setProvider(new Web3.providers.HttpProvider(config.web3HTTPProvider));


            return new Promise(async function(resolve, reject) {
            /*
                const Web3 = require('web3');
                let provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/<apiKey>");
                let web3 = new Web3(provider);
                web3.eth.getTransactionReceipt('0xc889aac1552dd93eb9ae8f3b96c671870ffb293651df0f9f8765236a8757a9ef)
                .then(txObj => {
                    console.log(typeof txObj.status); // logs "string"
                });
             */
                //console.log("Before getTransactionReceipt transHash  is :",   transHash);

                let tran =  await web3.eth.getTransactionReceipt(transHash).then(txObj => {
                    if (txObj) {
                        console.log("status  is :", txObj.status);
                        resolve({"txObj": txObj});
                    }
                    else{
                        console.log("In Correct TransactionHash  :", transHash);
                    }
                }); // end of sendSignedTransaction...
            });// end of promise
}


module.exports = {doTransaction, doStatus};

