# TrustCurve Registry

A community-maintained directory of AI evaluators, methods, funding disclosures, and evidence.

**Help make AI evaluation easier to inspect.** Suggest an organization, add a primary source, correct a record, or review a contribution. Start with one claim and the evidence behind it.

[Explore TrustCurve](https://trustcurve.com) · [Suggest an organization](https://github.com/trustcurve/registry/issues/new?template=suggest-organization.yml) · [Contribute research](https://github.com/trustcurve/registry/issues/new?template=contribute-research.yml)

## Current coverage

51 imported organization records; 11 have linked funding sources and one has a linked policy source. All claims await independent community review. Inclusion is not verification, certification, or endorsement. The directory includes research and governance organizations that may not offer third-party evaluation services.

## Start contributing

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Choose one organization in `data/organizations/`.
3. Add a source in `data/sources/` and link it from a claim.
4. Open a pull request and disclose your relationship to the organization.

You can also use an issue form. You do not need to edit code to contribute.

## Local commands

Requires Node.js 22 or later. No package installation is required.

```sh
node scripts/validate-data.mjs
node scripts/build-registry.mjs
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000. The build generates `site/registry-data.js` from the records. Do not edit that generated file.

## Repository layout

- `data/organizations/`: one JSON record per organization.
- `data/sources/`: reusable source references.
- `schemas/`: machine-readable field contracts.
- `docs/`: inclusion, evidence, review, conflict, and correction policies.
- `examples/`: a record template; excluded from the directory.
- `site/`: the reference website.
- `.github/`: contribution forms, review ownership, and workflows.

JSON keeps contributions explicit and lets validation run without dependencies. Source dates may be unknown; do not invent them.

## Governance and publication

Started by [@brij](https://x.com/brij). The initial repository administrator is [@trustcurve](https://github.com/trustcurve). See [GOVERNANCE.md](GOVERNANCE.md).

Validation checks structure, not factual truth. The `publish` workflow produces a reviewed-branch website artifact; it does not deploy to the existing Sites website. Repository rules and required reviewers must be enabled separately in GitHub Settings.

The GitHub repository's existing MIT license is preserved. Linked third-party documents retain their own rights; submit short factual summaries and links, not copied reports.
