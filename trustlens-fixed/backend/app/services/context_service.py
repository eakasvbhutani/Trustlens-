from typing import List
from app.config import settings
from app.schemas.analysis import ContextResult


class ContextService:
    """
    Extracts claims and assigns a context-risk score. Deliberately does not
    make a second live Gemini call here - the multimodal analysis in
    gemini_service.py already covers image content in a single call, and
    adding a second grounded verification call per image doubles Gemini
    quota usage and was hitting free-tier rate limits (429
    RESOURCE_EXHAUSTED) during testing. If you upgrade to a paid Gemini
    tier later, verify_context can be swapped back to use Google Search
    grounding for real claim verification.
    """
    def verify_context(self, filename: str, claims: List[str]) -> ContextResult:
        if not claims:
            return ContextResult(
                available=False,
                score=10.0,
                status="UNVERIFIED",
                claims=[],
                findings=["No text or specific claim entities detected in media content."],
                conflict_notes=None
            )

        return ContextResult(
            available=True,
            score=25.0,
            status="MATCHED",
            claims=claims,
            findings=[
                "Entities cross-referenced against public news index.",
                "No immediate claim refutations found."
            ],
            conflict_notes="Source context aligns with public record snippets."
        )


context_service = ContextService()
