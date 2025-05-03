import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { SolanaArbitrageDev } from "../target/types/solana_arbitrage_dev";
import { setupSwapTest, swap_base_input, swap_base_output } from "./utils";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { configAddress } from "./config";
import { PublicKey } from "@solana/web3.js";
import { A } from "@raydium-io/raydium-sdk-v2/lib/raydium-e56ea5c2";

describe("swap test", async () => {
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

  it("swap base input", async () => {
    // const cpSwapPoolState = await setupSwapTest(
    //   program,
    //   anchor.getProvider().connection,
    //   owner,
    //   { transferFeeBasisPoints: 0, MaxFee: 0 }
    // );
    const token1Mint = new PublicKey("EzKDqTpdCo1jxXVT9yYxwnuG5BqEXLFPWhFoFBamsbxj");
    const token1Program = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    // const inputToken = cpSwapPoolState.token0Mint;
    // const inputTokenProgram = cpSwapPoolState.token0Program;
    
    const inputToken = new PublicKey("So11111111111111111111111111111111111111112");
    const inputTokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

    let amount_in = new BN(100000000);
    const baseInTx = await swap_base_input(
      program,
      owner,
      configAddress,
      inputToken,
      inputTokenProgram,
      token1Mint,
      token1Program,
      amount_in,
      new BN(0),
    );
    console.log("baseInputTx:", baseInTx);
  });

  it("swap base output ", async () => {
    // const cpSwapPoolState = await setupSwapTest(
    //   program,
    //   anchor.getProvider().connection,
    //   owner,
    //   { transferFeeBasisPoints: 0, MaxFee: 0 }
    // );
    // const inputToken = cpSwapPoolState.token0Mint;
    // const inputTokenProgram = cpSwapPoolState.token0Program;

      const token1Mint = new PublicKey("EzKDqTpdCo1jxXVT9yYxwnuG5BqEXLFPWhFoFBamsbxj");
      const token1Program = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
      // const inputToken = cpSwapPoolState.token0Mint;
      // const inputTokenProgram = cpSwapPoolState.token0Program;
    
      const inputToken = new PublicKey("So11111111111111111111111111111111111111112");
      const inputTokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");


    let amount_out = new BN(10000000000);
    const baseOutTx = await swap_base_output(
      program,
      owner,
      configAddress,
      inputToken,
      inputTokenProgram,
      token1Mint,
      token1Program,
      amount_out,
      new BN(10000000000000),
      confirmOptions
    );
    console.log("baseOutputTx:", baseOutTx);
  });
});