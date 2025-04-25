use anchor_lang::prelude::*;

declare_id!("Hpp18F9QoJM1bfubPHj4QEa3nnHf67FKbzUZ1HwQRbEZ");

#[program]
pub mod solana_arbitrage_dev {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
