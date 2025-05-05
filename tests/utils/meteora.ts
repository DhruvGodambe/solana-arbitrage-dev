import { Program, BN } from "@coral-xyz/anchor";
import { SolanaArbitrageDev } from "../../target/types/solana_arbitrage_dev";
import {
  Connection,
  ConfirmOptions,
  PublicKey,
  Keypair,
  Signer,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  ComputeBudgetInstruction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
    getAuthAddress,
    getPoolAddress,
    getPoolLpMintAddress,
    getPoolVaultAddress,
    createTokenMintAndAssociatedTokenAccount,
    getOrcleAccountAddress,
  } from "./index";
import { cpSwapProgram } from "../config";


export async function handle_dlmm_swap(
  program: Program<SolanaArbitrageDev>,
  owner: Signer,
  configAddress: PublicKey,
  inputToken: PublicKey,
  inputTokenProgram: PublicKey,
  outputToken: PublicKey,
  outputTokenProgram: PublicKey,
  amount_in: BN,
  minimum_amount_out: BN,
  confirmOptions?: ConfirmOptions
) {
  const [auth] = await getAuthAddress(cpSwapProgram);
  const [poolAddress] = await getPoolAddress(
    configAddress,
    inputToken,
    outputToken,
    cpSwapProgram
  );
  console.log("poolAddress: ", poolAddress.toString());

  const [inputVault] = await getPoolVaultAddress(
    poolAddress,
    inputToken,
    cpSwapProgram
  );
  const [outputVault] = await getPoolVaultAddress(
    poolAddress,
    outputToken,
    cpSwapProgram
  );

  const inputTokenAccount = getAssociatedTokenAddressSync(
    inputToken,
    owner.publicKey,
    false,
    inputTokenProgram
  );
  const outputTokenAccount = getAssociatedTokenAddressSync(
    outputToken,
    owner.publicKey,
    false,
    outputTokenProgram
  );
  const [observationAddress] = await getOrcleAccountAddress(
    poolAddress,
    cpSwapProgram
  );

  const tx = await program.methods
    .proxySwapBaseInput(amount_in, minimum_amount_out)
    .accounts({
      cpSwapProgram: cpSwapProgram,
      payer: owner.publicKey,
      authority: auth,
      ammConfig: configAddress,
      poolState: poolAddress,
      inputTokenAccount,
      outputTokenAccount,
      inputVault,
      outputVault,
      inputTokenProgram: inputTokenProgram,
      outputTokenProgram: outputTokenProgram,
      inputTokenMint: inputToken,
      outputTokenMint: outputToken,
      observationState: observationAddress,
    })
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    ])
    .rpc();

  return tx;
}