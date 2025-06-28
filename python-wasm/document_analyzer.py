import re
import base64
from typing import Dict, List, Optional, Tuple
from io import BytesIO

# Pre-compiled regex patterns for faster matching
DOCUMENT_KEYWORDS = {
    "aadhar_card": [
        re.compile(r"uidai", re.IGNORECASE),
        re.compile(r"aadhar", re.IGNORECASE),
        re.compile(r"unique identification", re.IGNORECASE),
        re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
    ],
    "community_certificate": [
        re.compile(r"community", re.IGNORECASE),
        re.compile(r"caste", re.IGNORECASE),
        re.compile(r"scheduled caste", re.IGNORECASE),
        re.compile(r"scheduled tribe", re.IGNORECASE),
        re.compile(r"MBC|BC|OC|FC|SC|ST", re.IGNORECASE)
    ],
    "income_certificate": [
        re.compile(r"income certificate", re.IGNORECASE),
        re.compile(r"annual income", re.IGNORECASE)
    ],
    "nativity_certificate": [
        re.compile(r"nativity certificate", re.IGNORECASE),
        re.compile(r"native of", re.IGNORECASE)
    ],
    "obc_certificate": [
        re.compile(r"obc", re.IGNORECASE),
        re.compile(r"other backward class", re.IGNORECASE)
    ],
    "pwd_certificate": [
        re.compile(r"disability certificate", re.IGNORECASE),
        re.compile(r"benchmark disability", re.IGNORECASE),
        re.compile(r"pwbd", re.IGNORECASE)
    ],
    "driving_license": [
        re.compile(r"driving license", re.IGNORECASE),
        re.compile(r"dl no", re.IGNORECASE),
        re.compile(r"licence", re.IGNORECASE)
    ],
    "voter_id": [
        re.compile(r"election commission", re.IGNORECASE),
        re.compile(r"voter id", re.IGNORECASE),
        re.compile(r"epic", re.IGNORECASE)
    ],
    "passport": [
        re.compile(r"passport", re.IGNORECASE),
        re.compile(r"republic of india", re.IGNORECASE)
    ],
    "10th_marksheet": [
        re.compile(r"10th", re.IGNORECASE),
        re.compile(r"ssc", re.IGNORECASE),
        re.compile(r"secondary school", re.IGNORECASE),
        re.compile(r"matriculation", re.IGNORECASE)
    ],
    "11th_marksheet": [
        re.compile(r"11th", re.IGNORECASE),
        re.compile(r"higher secondary", re.IGNORECASE),
        re.compile(r"plus one", re.IGNORECASE)
    ],
    "12th_marksheet": [
        re.compile(r"12th", re.IGNORECASE),
        re.compile(r"higher secondary course", re.IGNORECASE),
        re.compile(r"plus two", re.IGNORECASE),
        re.compile(r"hr sec", re.IGNORECASE)
    ],
    "graduation_certificate": [
        re.compile(r"bachelor", re.IGNORECASE),
        re.compile(r"degree", re.IGNORECASE),
        re.compile(r"graduation", re.IGNORECASE),
        re.compile(r"university", re.IGNORECASE)
    ],
    "birth_certificate": [
        re.compile(r"birth certificate", re.IGNORECASE),
        re.compile(r"date of birth", re.IGNORECASE),
        re.compile(r"place of birth", re.IGNORECASE)
    ],
    "passport_photo": [
        re.compile(r"passport.*photo", re.IGNORECASE),
        re.compile(r"photo.*passport", re.IGNORECASE)
    ],
    "signature": [
        re.compile(r"signature", re.IGNORECASE),
        re.compile(r"signed by", re.IGNORECASE)
    ],
    "thumb_impression": [
        re.compile(r"thumb impression", re.IGNORECASE),
        re.compile(r"fingerprint", re.IGNORECASE),
        re.compile(r"thumb print", re.IGNORECASE)
    ]
}

def extract_text_from_image(image_data: bytes) -> str:
    """Extract text from image using OCR (simplified for WASM)"""
    try:
        # In a real implementation, you would use pytesseract here
        # For WASM, we'll use a simplified approach or web-based OCR
        
        # Convert to base64 for processing
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        
        # This would be replaced with actual OCR in production
        # For now, return empty string to avoid errors
        return ""
        
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

def classify_document(text: str) -> Tuple[str, float]:
    """Classify document type based on extracted text"""
    if not text:
        return "unknown_document", 0.0
    
    text_lower = text.lower()
    best_match = "unknown_document"
    best_confidence = 0.0
    
    for doc_type, patterns in DOCUMENT_KEYWORDS.items():
        matches = sum(1 for pattern in patterns if pattern.search(text_lower))
        confidence = matches / len(patterns)
        
        if confidence > best_confidence:
            best_confidence = confidence
            best_match = doc_type
    
    return best_match, best_confidence

def generate_filename(doc_type: str, original_name: str) -> str:
    """Generate standardized filename based on document type"""
    import os
    
    # Get file extension
    _, ext = os.path.splitext(original_name)
    
    # Create standardized name
    standardized_name = doc_type.replace('_', '_').upper()
    
    return f"{standardized_name}{ext}"

def analyze_and_classify(file_data: bytes, filename: str) -> Dict:
    """Main function to analyze and classify a document"""
    try:
        # Extract text (simplified for WASM)
        extracted_text = extract_text_from_image(file_data)
        
        # Classify document
        doc_type, confidence = classify_document(extracted_text)
        
        # Generate new filename
        new_filename = generate_filename(doc_type, filename)
        
        return {
            "classified_name": new_filename,
            "document_type": doc_type,
            "confidence": confidence,
            "extracted_text": extracted_text[:200],  # First 200 chars for debugging
            "original_filename": filename
        }
        
    except Exception as e:
        return {
            "classified_name": filename,
            "document_type": "unknown_document",
            "confidence": 0.0,
            "error": str(e),
            "original_filename": filename
        }

# For WASM compatibility
def process_document_batch(files_data: List[Dict]) -> List[Dict]:
    """Process multiple documents in batch"""
    results = []
    
    for file_info in files_data:
        result = analyze_and_classify(
            file_info['data'], 
            file_info['filename']
        )
        results.append(result)
    
    return results