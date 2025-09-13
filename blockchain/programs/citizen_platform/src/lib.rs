use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use anchor_spl::metadata::{
    create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata as MetaplexMetadata,
};
use mpl_token_metadata::accounts::Metadata;
use mpl_token_metadata::types::{DataV2, Creator, Collection};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod citizen_platform {
    use super::*;

    // Initialize the platform
    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.total_properties = 0;
        platform.total_certificates = 0;
        Ok(())
    }

    // Add issuer to whitelist
    pub fn add_issuer(ctx: Context<AddIssuer>, issuer: Pubkey) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authorized_issuers.push(issuer);
        Ok(())
    }

    // Mint education certificate NFT
    pub fn mint_certificate(
        ctx: Context<MintCertificate>,
        student_name: String,
        course_name: String,
        issuer_name: String,
        metadata_uri: String,
    ) -> Result<()> {
        // Verify issuer is authorized
        let platform = &ctx.accounts.platform;
        require!(
            platform.authorized_issuers.contains(&ctx.accounts.issuer.key()),
            PlatformError::UnauthorizedIssuer
        );

        // Create certificate account
        let certificate = &mut ctx.accounts.certificate;
        certificate.student = ctx.accounts.student.key();
        certificate.issuer = ctx.accounts.issuer.key();
        certificate.student_name = student_name;
        certificate.course_name = course_name;
        certificate.issuer_name = issuer_name;
        certificate.mint_time = Clock::get()?.unix_timestamp;

        // Mint NFT
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.platform.to_account_info(),
                },
            ),
            1,
        )?;

        // Create metadata
        let data_v2 = DataV2 {
            name: format!("{} Certificate", course_name),
            symbol: "EDU".to_string(),
            uri: metadata_uri,
            seller_fee_basis_points: 0,
            creators: Some(vec![Creator {
                address: ctx.accounts.issuer.key(),
                verified: true,
                share: 100,
            }]),
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    mint_authority: ctx.accounts.platform.to_account_info(),
                    update_authority: ctx.accounts.platform.to_account_info(),
                    payer: ctx.accounts.issuer.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            data_v2,
            true,
            true,
            None,
        )?;

        // Update platform stats
        let platform = &mut ctx.accounts.platform;
        platform.total_certificates += 1;

        Ok(())
    }

    // Initialize real estate property
    pub fn initialize_property(
        ctx: Context<InitializeProperty>,
        property_name: String,
        total_value: u64,
        total_tokens: u64,
        metadata_uri: String,
    ) -> Result<()> {
        let property = &mut ctx.accounts.property;
        property.name = property_name;
        property.total_value = total_value;
        property.total_tokens = total_tokens;
        property.tokens_sold = 0;
        property.metadata_uri = metadata_uri;
        property.mint = ctx.accounts.mint.key();

        // Update platform stats
        let platform = &mut ctx.accounts.platform;
        platform.total_properties += 1;

        Ok(())
    }

    // Buy property tokens
    pub fn buy_property_tokens(ctx: Context<BuyPropertyTokens>, amount: u64) -> Result<()> {
        let property = &mut ctx.accounts.property;
        
        require!(
            property.tokens_sold + amount <= property.total_tokens,
            PlatformError::InsufficientTokensAvailable
        );

        // Mint tokens to buyer
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.platform.to_account_info(),
                },
            ),
            amount,
        )?;

        property.tokens_sold += amount;

        Ok(())
    }

    // Simulate rent distribution
    pub fn claim_rent(ctx: Context<ClaimRent>) -> Result<()> {
        let property = &ctx.accounts.property;
        let token_balance = ctx.accounts.user_token_account.amount;
        
        require!(token_balance > 0, PlatformError::NoTokensOwned);

        // Calculate rent share (simplified - in real implementation would use oracle)
        let monthly_rent = property.total_value / 100; // 1% monthly return simulation
        let user_share = (monthly_rent * token_balance) / property.total_tokens;

        // Transfer SOL as rent (simplified - would be stablecoin in production)
        **ctx.accounts.platform.to_account_info().try_borrow_mut_lamports()? -= user_share;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += user_share;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = Platform::SIZE,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddIssuer<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MintCertificate<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        init,
        payer = issuer,
        space = Certificate::SIZE,
        seeds = [b"certificate", mint.key().as_ref()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
    #[account(
        init,
        payer = issuer,
        mint::decimals = 0,
        mint::authority = platform,
        mint::freeze_authority = platform,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = issuer,
        associated_token::mint = mint,
        associated_token::authority = student,
    )]
    pub token_account: Account<'info, TokenAccount>,
    /// CHECK: Metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    /// CHECK: Student receiving the certificate
    pub student: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, MetaplexMetadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializeProperty<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        init,
        payer = authority,
        space = Property::SIZE,
        seeds = [b"property", mint.key().as_ref()],
        bump
    )]
    pub property: Account<'info, Property>,
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = platform,
    )]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyPropertyTokens<'info> {
    #[account(
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        mut,
        seeds = [b"property", mint.key().as_ref()],
        bump
    )]
    pub property: Account<'info, Property>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRent<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(
        seeds = [b"property", mint.key().as_ref()],
        bump
    )]
    pub property: Account<'info, Property>,
    pub mint: Account<'info, Mint>,
    #[account(
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub total_properties: u64,
    pub total_certificates: u64,
    pub authorized_issuers: Vec<Pubkey>,
}

impl Platform {
    pub const SIZE: usize = 8 + 32 + 8 + 8 + (4 + 32 * 10); // Allow up to 10 issuers
}

#[account]
pub struct Certificate {
    pub student: Pubkey,
    pub issuer: Pubkey,
    pub student_name: String,
    pub course_name: String,
    pub issuer_name: String,
    pub mint_time: i64,
}

impl Certificate {
    pub const SIZE: usize = 8 + 32 + 32 + (4 + 100) + (4 + 100) + (4 + 100) + 8;
}

#[account]
pub struct Property {
    pub name: String,
    pub total_value: u64,
    pub total_tokens: u64,
    pub tokens_sold: u64,
    pub metadata_uri: String,
    pub mint: Pubkey,
}

impl Property {
    pub const SIZE: usize = 8 + (4 + 100) + 8 + 8 + 8 + (4 + 200) + 32;
}

#[error_code]
pub enum PlatformError {
    #[msg("Unauthorized issuer")]
    UnauthorizedIssuer,
    #[msg("Insufficient tokens available")]
    InsufficientTokensAvailable,
    #[msg("No tokens owned")]
    NoTokensOwned,
}