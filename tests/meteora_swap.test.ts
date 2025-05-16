import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { SolanaArbitrageDev } from "../target/types/solana_arbitrage_dev";
import { setupSwapTest, swap_base_input, swap_base_output } from "./utils";
import { getAccount, getAssociatedTokenAddress, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { configAddress } from "./config";
import { ComputeBudgetProgram, PublicKey, Transaction } from "@solana/web3.js";
import { A } from "@raydium-io/raydium-sdk-v2/lib/raydium-e56ea5c2";
import DLMM, { deriveEventAuthority } from "@meteora-ag/dlmm";

describe("Meteora swap test", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const owner = anchor.Wallet.local().payer;
  console.log("owner: ", owner.publicKey.toString());
//   const provider = await anchor.getProvider();
//   console.log("provider: ", provider);

  const program = anchor.workspace.SolanaArbitrageDev as Program<SolanaArbitrageDev>;
  // const program = new anchor.Program()

  const confirmOptions = {
    skipPreflight: true,
  };

  it("dlmm swap", async () => {
    // const cpSwapPoolState = await setupSwapTest(
    //   program,
    //   anchor.getProvider().connection,
    //   owner,
    //   { transferFeeBasisPoints: 0, MaxFee: 0 }
    // );
    const POOL_ADDRESS = new PublicKey("F6YoA7Vsso4XLNTDbvWVc7fnjFvMPorj9BDEkDnV9bQ9");
    
    const dlmmPool = await DLMM.create(anchor.getProvider().connection, POOL_ADDRESS);
    // console.log("dlmmPool: ", dlmmPool.lbPair.rewardInfos);


    const inputToken = new PublicKey("EzKDqTpdCo1jxXVT9yYxwnuG5BqEXLFPWhFoFBamsbxj");
    const inputTokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    // const inputToken = cpSwapPoolState.token0Mint;
    // const inputTokenProgram = cpSwapPoolState.token0Program;
    
    const outputToken = new PublicKey("So11111111111111111111111111111111111111112");
    const outputTokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

    let amount_in = new BN(10000000);


    const eventAuthority = new PublicKey("D1ZN9Wj1fRSUQfCjhvnu1hqDMT7hzjzBBpi12nVniYD6")

    const userTokenIn = await getAssociatedTokenAddress(outputToken, owner.publicKey);
    const userTokenOut = await getAssociatedTokenAddressSync(inputToken, owner.publicKey);

    // console.log("userTokenIn: ", userTokenIn.toString());
    // console.log("userTokenOut: ", userTokenOut.toString());
    // console.log("dlmmPool.lbPair.reserveX: ", dlmmPool.lbPair.reserveX.toString());
    // console.log("dlmmPool.lbPair.reserveY: ", dlmmPool.lbPair.reserveY.toString());

    const swapYtoX = false;
    const binArrays = await dlmmPool.getBinArrayForSwap(swapYtoX);
    const swapQuote = await dlmmPool.swapQuote(amount_in, swapYtoX, new BN(5), binArrays)

    console.log("binArrays : ", swapQuote.binArraysPubkey);

    try {
        const accounts = {
            lbPair: POOL_ADDRESS,
            binArrayBitmapExtension: new PublicKey("LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"),
            reserveX: dlmmPool.lbPair.reserveX,
            reserveY: dlmmPool.lbPair.reserveY,
            userTokenIn,
            userTokenOut,
            tokenXMint: dlmmPool.lbPair.tokenXMint,
            tokenYMint: dlmmPool.lbPair.tokenYMint,
            oracle: dlmmPool.lbPair.oracle,
            hostFeeIn: new PublicKey("LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"),
            user: owner.publicKey,
            eventAuthority,
            tokenXProgram: inputTokenProgram,
            tokenYProgram: outputTokenProgram,
        };

        console.log("accounts: ", accounts);

        const tx = await program.methods
        .dlmmSwap(amount_in, new BN(0))
        .accounts(accounts)
        .remainingAccounts(swapQuote.binArraysPubkey.map((binArray) => {
            return {
                pubkey: binArray,
                isWritable: true,
                isSigner: false,
            }
        }))
        .rpc();
    
    
        console.log("tx: ", tx);
    } catch (error) {
        console.error("Error: ", error);
    }

    // const baseInTx = await swap_base_input(
    //   program,
    //   owner,
    //   configAddress,
    //   inputToken,
    //   inputTokenProgram,
    //   token1Mint,
    //   token1Program,
    //   amount_in,
    //   new BN(0),
    // );
    // console.log("baseInputTx:", baseInTx);
  }).addListener("error", (err) => {
    console.error("Error: ", err);
  });
});