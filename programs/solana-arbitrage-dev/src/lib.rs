use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;

declare_program!(dlmm);

use crate::dlmm_swap::*;

declare_id!("D4VcAccDSPWigvYbgP3bqQAFnf7SqLF8YcA1f3jSYTNm");

#[program]
pub mod solana_arbitrage_dev {
    use super::*;

    // Meteora DLMM Swap
    pub fn dlmm_swap<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, DlmmSwap<'info>>,
        amount_in: u64,
        min_amount_out: u64,
    ) -> Result<()> {
        instructions::meteora_dlmm::dlmm_swap::handle_dlmm_swap(ctx, amount_in, min_amount_out)
    }

    // Raydium Input Swap
    pub fn proxy_swap_base_input(
        ctx: Context<ProxySwapBaseInput>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        instructions::raydium_cpmm::proxy_swap_base_input(ctx, amount_in, minimum_amount_out)
    }

    // Raydium Output Swap
    pub fn proxy_swap_base_output(
        ctx: Context<ProxySwapBaseOutput>,
        max_amount_in: u64,
        amount_out: u64,
    ) -> Result<()> {
        instructions::raydium_cpmm::proxy_swap_base_output(ctx, max_amount_in, amount_out)
    }
}

#[derive(Accounts)]
pub struct Initialize {}