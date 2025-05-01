import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { SolanaArbitrageDev } from "../target/types/solana_arbitrage_dev";
import { setupInitializeTest, initialize } from "./utils";

describe("initialize test", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const owner = anchor.Wallet.local().payer;
  console.log("owner: ", owner.publicKey.toString());

  const program = anchor.workspace.SolanaArbitrageDev as Program<SolanaArbitrageDev>;

  const confirmOptions = {
    skipPreflight: true,
  };

  it("initialize", async () => {

    const { configAddress, token0, token0Program, token1, token1Program } =
      await setupInitializeTest(
        anchor.getProvider().connection,
        owner,
        { transferFeeBasisPoints: 0, MaxFee: 0 },
        confirmOptions
      );

      console.log(configAddress, token0, token0Program, token1, token1Program);
    const initAmount0 = new BN(1000000);
    const initAmount1 = new BN(1000000);
    const { poolAddress, cpSwapPoolState, tx } = await initialize(
      program,
      owner,
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
      confirmOptions,
      { initAmount0, initAmount1 }
    );

    console.log("pool address: ", poolAddress.toString(), " tx:", tx);
  }).addListener("error", (error) => {
    console.error("Error in test:", error);
  });
});