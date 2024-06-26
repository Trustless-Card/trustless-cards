# Proof Update Helper

When someone tries to execute a voucher or to validate a notice, they need to provide a proof.
This proof is checked on-chain by the DApp contract.
In order to test the proof verification scheme, we need to generate proofs and check them with Forge.
The scripts in this folder help automate the process of updating the proofs.
If you're curious to know how the `update-proofs.sh` script works, here's a diagram of the pipeline.

```mermaid
graph TD
    forge[forge test] -- writes --> inputs[(input/*.json)]
    inputs -- is read by --> dockerImage[docker image]
    dockerImage[docker image] -- writes--> finishEpochResponse[(output/finish_epoch_response.json)]
    finishEpochResponse -- is read by --> forge
```
