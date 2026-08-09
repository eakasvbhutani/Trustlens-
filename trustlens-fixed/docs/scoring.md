# Trust Engine Scoring Methodology

The TrustLens Trust Engine calculates a composite score combining 4 independent risk vectors into a single 0–100 score.

## Dynamic Weight Formula

$$\text{WeightedRisk} = w_1 S_{\text{deepfake}} + w_2 S_{\text{gemini}} + w_3 S_{\text{metadata}} + w_4 S_{\text{context}}$$

$$\text{TrustScore} = 100.0 - \text{WeightedRisk}$$

Default Weights:
- $w_1 = 0.40$ (Specialized AI Deepfake Detection)
- $w_2 = 0.20$ (Multimodal AI Visual Forensics)
- $w_3 = 0.15$ (EXIF Metadata Anomalies)
- $w_4 = 0.25$ (Context & Source Verification)

## Risk Classifications & Recommendations

| Trust Score Range | Risk Level | Action Recommendation |
| :--- | :--- | :--- |
| **0 – 30** | `HIGH_RISK` | High risk of manipulation or synthetic AI generation. **Don't share until independently verified.** |
| **31 – 60** | `VERIFY` | Some signals are inconclusive or context mismatch was detected. **Consider verifying the source before sharing.** |
| **61 – 100** | `LOWER_RISK` | No significant manipulation indicators detected. **No automated system can guarantee absolute authenticity.** |

## Assessment Confidence Index

- **HIGH**: All 4 signal layers successfully extracted and analyzed.
- **MODERATE**: 3 signal layers analyzed (e.g. EXIF metadata was stripped).
- **LIMITED**: Fewer than 3 signal layers available.
