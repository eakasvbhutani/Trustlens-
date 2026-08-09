import io
import logging
from typing import Optional, Dict, Any, Tuple
from PIL import Image, ExifTags
from app.schemas.analysis import MetadataResult

logger = logging.getLogger(__name__)

class MetadataService:
    """
    Extracts EXIF and container metadata from media files, performing privacy redactions on location data.
    """
    def extract_metadata(self, file_bytes: bytes, filename: str) -> MetadataResult:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            exif_data = image._getexif()
            
            if not exif_data:
                return MetadataResult(
                    available=False,
                    score=15.0, # Missing metadata is common, mild risk score
                    camera="Unknown",
                    software="Stripped / None",
                    creation_date=None,
                    gps_available=False,
                    location_summary="No EXIF metadata found in image header (common for social media uploads).",
                    anomalies=["EXIF metadata missing or stripped."],
                    raw_fields={}
                )
                
            decoded_exif: Dict[str, Any] = {}
            for tag_id, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                if isinstance(value, bytes):
                    # Sanitize binary bytes
                    decoded_exif[tag_name] = f"<binary data {len(value)} bytes>"
                else:
                    decoded_exif[tag_name] = str(value)
                    
            camera_make = decoded_exif.get("Make", "")
            camera_model = decoded_exif.get("Model", "")
            camera = f"{camera_make} {camera_model}".strip() or "Unknown Camera"
            
            software = decoded_exif.get("Software", "Unspecified")
            creation_date = decoded_exif.get("DateTimeOriginal") or decoded_exif.get("DateTime")
            
            # Check GPS tag presence (GPSInfo is tag 34853)
            gps_available = "GPSInfo" in decoded_exif or 34853 in exif_data
            location_summary = "Location metadata detected (coordinates redacted for privacy)." if gps_available else "No GPS location data recorded."
            
            anomalies = []
            risk_score = 0.0
            
            # Check if AI image generation software tags exist (e.g. Midjourney, Stable Diffusion, Photoshop Generative Fill)
            software_lower = software.lower()
            ai_tools = ["midjourney", "stable diffusion", "dall-e", "dalle", "comfyui", "automatic1111", "photoshop generative", "firefly"]
            for tool in ai_tools:
                if tool in software_lower:
                    anomalies.append(f"AI generation or edit software signature detected in EXIF header ({software}).")
                    risk_score = max(risk_score, 85.0)
                    
            if not anomalies:
                if "photoshop" in software_lower or "gimp" in software_lower:
                    anomalies.append(f"Image editing software tag present ({software}).")
                    risk_score = max(risk_score, 35.0)
                else:
                    risk_score = 5.0

            return MetadataResult(
                available=True,
                score=risk_score,
                camera=camera,
                software=software,
                creation_date=creation_date,
                gps_available=gps_available,
                location_summary=location_summary,
                anomalies=anomalies,
                raw_fields={k: str(v) for k, v in list(decoded_exif.items())[:15]}
            )
            
        except Exception:
            # Log the real cause server-side; do not leak library internals to API clients.
            logger.exception("Metadata extraction failed for %s", filename)
            return MetadataResult(
                available=False,
                score=20.0,
                camera="Unknown",
                software="Parse Error",
                creation_date=None,
                gps_available=False,
                location_summary="Unable to parse EXIF payload.",
                anomalies=["Metadata extraction failed."],
                raw_fields={}
            )

metadata_service = MetadataService()
