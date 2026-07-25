# Step 12 — Add a Custom Domain Later

## Status

Prepared for later activation. No custom domain is active.

## Current Free Website

https://nejatbakhsh-y.github.io/

The free GitHub Pages address remains the recommended initial address.

## Planned Custom Domain

yousefnejatbakhsh.com

## GitHub Pages Target

nejatbakhsh-y.github.io

## Required Future Sequence

1. Purchase and control the domain.
2. Verify the domain through the GitHub account.
3. Run the activation mode in this PowerShell automation.
4. Enter the records from dns-records.csv at the domain registrar.
5. Wait for DNS propagation.
6. Run Check mode.
7. Confirm that HTTPS is available.
8. Retain the GitHub domain-verification TXT record.

## Future Activation Command

Set-Location "C:\Users\nejat\OneDrive\Desktop\UN\Skills\GitHub 2026\Website"

.\P12_Add_Custom_Domain_Later.ps1 -Mode Activate -Domain "yousefnejatbakhsh.com" -ConfirmDomainOwnership -Publish

## Future Check Command

.\P12_Add_Custom_Domain_Later.ps1 -Mode Check -Domain "yousefnejatbakhsh.com"

## Future Removal Command

.\P12_Add_Custom_Domain_Later.ps1 -Mode Remove -Domain "yousefnejatbakhsh.com" -ConfirmRemoval -Publish

## Security Controls

- Do not use wildcard DNS records.
- Do not point the domain to GitHub before controlling the domain.
- Use the exact GitHub Pages target: nejatbakhsh-y.github.io.
- Do not include a repository path in the CNAME target.
- Keep the GitHub verification TXT record after verification.
