from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseDeepfakeProvider(ABC):
    @abstractmethod
    def analyze_image(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        Abstract method to analyze an image for synthetic or deepfake generation indicators.
        Returns dictionary with risk_score, confidence, model_name, and findings.
        """
        pass
