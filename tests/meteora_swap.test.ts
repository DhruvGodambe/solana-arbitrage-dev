import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { SolanaArbitrageDev } from "../target/types/solana_arbitrage_dev";
import { setupSwapTest, swap_base_input, swap_base_output } from "./utils";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { configAddress } from "./config";
import { PublicKey } from "@solana/web3.js";
import { A } from "@raydium-io/raydium-sdk-v2/lib/raydium-e56ea5c2";
import DLMM, { deriveEventAuthority } from "@meteora-ag/dlmm";

describe("Meteora swap test", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const owner = anchor.Wallet.local().payer;
  console.log("owner: ", owner.publicKey.toString());
  // const provider = await anchor.getProvider();
  // console.log("provider: ", provider);

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
    console.log("dlmmPool: ", dlmmPool);


    const inputToken = new PublicKey("EzKDqTpdCo1jxXVT9yYxwnuG5BqEXLFPWhFoFBamsbxj");
    const inputTokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    // const inputToken = cpSwapPoolState.token0Mint;
    // const inputTokenProgram = cpSwapPoolState.token0Program;
    
    const outputToken = new PublicKey("So11111111111111111111111111111111111111112");
    const outputTokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

    let amount_in = new BN(100000000);

    const dummy = anchor.web3.SystemProgram.programId;

    const eventAuthority = new PublicKey("D1ZN9Wj1fRSUQfCjhvnu1hqDMT7hzjzBBpi12nVniYD6")

    const tx = await program.methods
    .dlmmSwap(amount_in, new BN(0))
    .accounts({
        lbPair: POOL_ADDRESS,
        binArrayBitmapExtension: dummy,
        reserveX: dlmmPool.lbPair.reserveX,
        reserveY: dlmmPool.lbPair.reserveY,
        userTokenIn: dlmmPool.lbPair.tokenXMint,
        userTokenOut: dlmmPool.lbPair.tokenYMint,
        tokenXMint: dlmmPool.lbPair.tokenXMint,
        tokenYMint: dlmmPool.lbPair.tokenYMint,
        oracle: dlmmPool.lbPair.oracle,
        hostFeeIn: dummy,
        user: owner.publicKey,
        // dlmmProgram: "",
        eventAuthority,
        tokenXProgram: inputTokenProgram,
        tokenYProgram: outputTokenProgram,
    })
    // .preInstructions([
    //   ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    // ])
    .rpc();

    console.log("tx: ", tx);
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