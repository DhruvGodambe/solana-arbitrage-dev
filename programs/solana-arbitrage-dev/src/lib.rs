use anchor_lang::prelude::*;

use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use raydium_cpmm_cpi::{
    program::RaydiumCpmm,
    states::{AmmConfig, ObservationState, PoolState},
};

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


    pub fn arbitrage<'a,'b,'c,'info>(
        ctx: Context<'a, 'b, 'c, 'info, Arbitrage<'info>>,
        amount_in: u64,
        min_amount_out: u64,
        raydium_base: bool
    ) -> Result<()> {

        if raydium_base {
            //call Dex 1 with token_in
            // swap token_in to token_out
            proxy_swap_base_input2(
                ctx.accounts.payer.clone(),
                ctx.accounts.raydium_auth.clone(),
                ctx.accounts.raydium_amm_config.clone(),
                ctx.accounts.raydium_pool_state.clone(),
                ctx.accounts.raydium_input_token_account.clone(),
                ctx.accounts.raydium_output_token_account.clone(),
                ctx.accounts.raydium_input_vault.clone(),
                ctx.accounts.raydium_output_vault.clone(),
                ctx.accounts.raydium_input_token_program.clone(),
                ctx.accounts.raydium_output_token_program.clone(),
                ctx.accounts.raydium_input_token_mint.clone(),
                ctx.accounts.raydium_output_token_mint.clone(),
                ctx.accounts.raydium_observation_state.clone(),
                ctx.accounts.cp_swap_program.clone(),
                amount_in,
                min_amount_out
            )?;
        } else {
            //call Dex 1 with token_in
            // swap token_in to token_out
            proxy_swap_base_output2(
                ctx.accounts.payer.clone(),
                ctx.accounts.raydium_auth.clone(),
                ctx.accounts.raydium_amm_config.clone(),
                ctx.accounts.raydium_pool_state.clone(),
                ctx.accounts.raydium_input_token_account.clone(),
                ctx.accounts.raydium_output_token_account.clone(),
                ctx.accounts.raydium_input_vault.clone(),
                ctx.accounts.raydium_output_vault.clone(),
                ctx.accounts.raydium_input_token_program.clone(),
                ctx.accounts.raydium_output_token_program.clone(),
                ctx.accounts.raydium_input_token_mint.clone(),
                ctx.accounts.raydium_output_token_mint.clone(),
                ctx.accounts.raydium_observation_state.clone(),
                ctx.accounts.cp_swap_program.clone(),
                amount_in,
                min_amount_out
            )?;
        }

        
        // call Dex 2 with token_out
        // let dlmm_swap_accounts = instructions::meteora_dlmm::DlmmSwap {
        //     lb_pair: ctx.accounts.meteora_lb_pair.to_account_info(),
        //     bin_array_bitmap_extension: ctx.accounts.meteora_bin_extension.to_account_info(),
        //     reserve_x: ctx.accounts.meteora_reserve_x.to_account_info(),
        //     reserve_y: ctx.accounts.meteora_reserve_y.to_account_info(),
        //     user_token_in: ctx.accounts.output_token_ata.to_account_info(),
        //     user_token_out: ctx.accounts.input_token_ata.to_account_info(),
        //     token_x_mint: ctx.accounts.meteora_token_x_mint.to_account_info(),
        //     token_y_mint: ctx.accounts.meteora_token_y_mint.to_account_info(),
        //     oracle: ctx.accounts.meteora_oracle.to_account_info(),
        //     host_fee_in: ctx.accounts.meteora_host_fee_in.to_account_info(),
        //     user: ctx.accounts.payer.to_account_info(),
        //     event_authority: ctx.accounts.meteora_event_authority.to_account_info(),
        //     token_x_program: ctx.accounts.meteora_token_x_program.to_account_info(),
        //     token_y_program: ctx.accounts.meteora_token_y_program.to_account_info(),
        // };
        // let dlmm_swap_context = Context::from(
        //     ctx,
        //     dlmm_swap_accounts
        // );
        // // swap token_out to token_in
        // dlmm_swap(
        //     dlmm_swap_context,
        //     amount_in,
        //     min_amount_out,
        // );


        // handle_dlmm_swap2(
        //     ctx.accounts.meteora_lb_pair.clone(),
        //     ctx.accounts.meteora_bin_extension.clone(),
        //     ctx.accounts.meteora_reserve_x.clone(),
        //     ctx.accounts.meteora_reserve_y.clone(),
        //     ctx.accounts.output_token_ata.clone(),
        //     ctx.accounts.input_token_ata.clone(),
        //     ctx.accounts.meteora_token_x_mint.clone(),
        //     ctx.accounts.meteora_token_y_mint.clone(),
        //     ctx.accounts.meteora_oracle.clone(),
        //     ctx.accounts.meteora_host_fee_in.clone(),
        //     ctx.accounts.payer.clone(),
        //     ctx.accounts.meteora_token_x_program.clone(),
        //     ctx.accounts.meteora_token_y_program.clone(),
        //     ctx.accounts.dlmm_program.clone(),
        //     ctx.accounts.meteora_event_authority.clone(),
        //     &ctx.remaining_accounts,
        //     amount_in,
        //     min_amount_out
        // )?;


        let mut dlmm_accounts = DlmmSwap {
            lb_pair: ctx.accounts.meteora_lb_pair.clone(),
            bin_array_bitmap_extension: ctx.accounts.meteora_bin_extension.clone(),
            reserve_x: ctx.accounts.meteora_reserve_x.clone(),
            reserve_y: ctx.accounts.meteora_reserve_y.clone(),
            user_token_in: ctx.accounts.output_token_ata.clone(),
            user_token_out: ctx.accounts.input_token_ata.clone(),
            token_x_mint: ctx.accounts.meteora_token_x_mint.clone(),
            token_y_mint: ctx.accounts.meteora_token_y_mint.clone(),
            oracle: ctx.accounts.meteora_oracle.clone(),
            host_fee_in: ctx.accounts.meteora_host_fee_in.clone(),
            user: ctx.accounts.payer.clone(),
            token_x_program: ctx.accounts.meteora_token_x_program.clone(),
            token_y_program: ctx.accounts.meteora_token_y_program.clone(),
            event_authority: ctx.accounts.meteora_event_authority.clone(),
            dlmm_program: ctx.accounts.dlmm_program.clone(),
        };

        // Build the CPI context manually with remaining accounts
        let cpi_ctx = Context {
            program_id: ctx.program_id,
            accounts: &mut dlmm_accounts,
            bumps: Default::default(),
            remaining_accounts: ctx.remaining_accounts,
        };

        // Call the DLMM CPI wrapper
        handle_dlmm_swap(cpi_ctx, min_amount_out, 0)?;


        Ok(())
    }
}

#[derive(Accounts)]
pub struct Arbitrage<'info> {
    /// The accounts for raydium
    pub cp_swap_program: Program<'info, RaydiumCpmm>,

    /// The account that will pay for the swap
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The authority of the Raydium pool
    #[account(
      seeds = [
        raydium_cpmm_cpi::AUTH_SEED.as_bytes(),
      ],
      seeds::program = cp_swap_program.key(),
      bump,
    )]
    pub raydium_auth: UncheckedAccount<'info>,

    /// The AMM config for Raydium
    #[account(address = raydium_pool_state.load()?.amm_config)]
    pub raydium_amm_config: Box<Account<'info, AmmConfig>>,

    /// The state of the Raydium pool
    #[account(mut)]
    pub raydium_pool_state: AccountLoader<'info, PoolState>,

    /// The program account for the most recent oracle observation
    #[account(mut, address = raydium_pool_state.load()?.observation_key)]
    pub raydium_observation_state: AccountLoader<'info, ObservationState>,

    /// The input token account for Raydium
    #[account(mut)]
    pub raydium_input_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The output token account for Raydium
    #[account(mut)]
    pub raydium_output_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub raydium_input_token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub raydium_output_token_mint: Box<InterfaceAccount<'info, Mint>>,
    
    // general accounts
    /// The input vault for Raydium
    #[account(mut)]
    pub raydium_input_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The output vault for Raydium
    #[account(mut)]
    pub raydium_output_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    /// CHECK: User token account to sell token
    pub input_token_ata: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: User token account to buy token
    pub output_token_ata: UncheckedAccount<'info>,

    /// SPL program for input token transfers
    pub raydium_input_token_program: Interface<'info, TokenInterface>,

    /// SPL program for output token transfers
    pub raydium_output_token_program: Interface<'info, TokenInterface>,


    /// The accounts for Meteora
    #[account(mut)]
    /// CHECK: The pool account
    pub meteora_lb_pair: UncheckedAccount<'info>,

    /// CHECK: Bin array extension account of the pool
    pub meteora_bin_extension: Option<UncheckedAccount<'info>>,

    #[account(mut)]
    /// CHECK: Reserve account of token X
    pub meteora_reserve_x: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: Reserve account of token Y
    pub meteora_reserve_y: UncheckedAccount<'info>,

    /// CHECK: Mint account of token X
    pub meteora_token_x_mint: UncheckedAccount<'info>,
    /// CHECK: Mint account of token Y
    pub meteora_token_y_mint: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK: Oracle account of the pool
    pub meteora_oracle: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK: Referral fee account
    pub meteora_host_fee_in: Option<UncheckedAccount<'info>>,

    /// CHECK: DLMM program event authority for event CPI
    pub meteora_event_authority: UncheckedAccount<'info>,

    /// CHECK: Token program of mint X
    pub meteora_token_x_program: UncheckedAccount<'info>,
    /// CHECK: Token program of mint Y
    pub meteora_token_y_program: UncheckedAccount<'info>,
    // Bin arrays need to be passed using remaining accounts

    /// CHECK: DLMM program
    #[account(address = dlmm::ID)]
    pub dlmm_program: UncheckedAccount<'info>
}