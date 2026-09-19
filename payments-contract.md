# Northwind Payments import contract v1

Synthetic sandbox fixture for testing a newly connected source's data quality. No real payments or customer records. Expected export: 16 rows for September 18, 2026, UTC. Intended grain: one payment per payment_id. export_row_id is an ingestion row locator, not the business key. Validate the full small export after inspecting the schema and a sample; a clean sample is not proof of a clean import.

## Expected mapped fields

| Field | Logical type | Rule |
|---|---|---|
| export_row_id | integer | Required unique row locator |
| payment_id | string | Required unique business key; pay_ followed by three digits |
| customer_id | string | Required; cus_ followed by three digits. Exact mapped field name required; aliases must be explicitly approved. |
| amount_minor | integer | Required, nonnegative; amount in currency minor units, not major units. Fractional values are invalid. |
| currency | string | Required; exactly USD, EUR, or GBP |
| status | string | Required; succeeded, pending, failed, partially_refunded, or refunded |
| created_at | timestamp | Required valid ISO 8601 UTC timestamp within September 18, 2026 |
| settled_at | timestamp | Required for succeeded, partially_refunded, and refunded; may be blank for pending or failed; if present must not precede created_at |
| refunded_minor | integer | Required; 0 <= refunded_minor <= amount_minor; zero for succeeded/pending/failed; strictly between zero and amount for partially_refunded; equals amount for refunded |
| livemode | boolean | Required false for this sandbox export |

CSV storage may expose fields as strings. Separate a storage/inference type from a logical-value error: losslessly parseable integers and booleans are acceptable ingestion representations, but reporting requires explicit correct types. Preserve missing values as missing; do not coerce them to zero. Do not silently rename fields, convert malformed amounts, deduplicate, or repair records during this read-only audit. A renamed customer field is only a possible mapping explanation, not a verified upstream cause. Do not aggregate mixed currencies into one monetary total. Zero-value successful payments are valid under this contract.

## Decision

The import is safe for reporting only when required mapped columns, values, uniqueness, and cross-field rules pass. Cite schema and record evidence; report counts and export_row_id/payment_id examples, severity, downstream impact, and recommended corrections. Distinguish source data defects from connector presentation and freshness warnings. This contract is the comparison baseline, not an assertion that the imported data complies.
