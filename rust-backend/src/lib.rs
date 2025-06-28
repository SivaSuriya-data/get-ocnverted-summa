use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Import the `console.log` function from the `console` module
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a macro for easier console logging
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize)]
pub struct ConvertedDocument {
    pub name: String,
    pub data: Vec<u8>,
    pub document_type: String,
    pub format: String,
}

#[derive(Serialize, Deserialize)]
pub struct ExamFormat {
    pub photo_width: u32,
    pub photo_height: u32,
    pub signature_width: u32,
    pub signature_height: u32,
    pub dpi: u32,
    pub format: String,
    pub naming_convention: String,
}

// Exam-specific format configurations
fn get_exam_formats() -> HashMap<String, ExamFormat> {
    let mut formats = HashMap::new();
    
    // NEET format specifications
    formats.insert("neet".to_string(), ExamFormat {
        photo_width: 350,  // 3.5cm at 100 DPI
        photo_height: 450, // 4.5cm at 100 DPI
        signature_width: 350,
        signature_height: 150,
        dpi: 100,
        format: "JPEG".to_string(),
        naming_convention: "NEET_{document_type}".to_string(),
    });
    
    // JEE format specifications
    formats.insert("jee".to_string(), ExamFormat {
        photo_width: 350,
        photo_height: 450,
        signature_width: 350,
        signature_height: 150,
        dpi: 100,
        format: "JPEG".to_string(),
        naming_convention: "JEE_{document_type}".to_string(),
    });
    
    // UPSC format specifications
    formats.insert("upsc".to_string(), ExamFormat {
        photo_width: 400,  // 4cm at 100 DPI
        photo_height: 500, // 5cm at 100 DPI
        signature_width: 400,
        signature_height: 200,
        dpi: 100,
        format: "JPEG".to_string(),
        naming_convention: "UPSC_{document_type}".to_string(),
    });
    
    // CAT format specifications
    formats.insert("cat".to_string(), ExamFormat {
        photo_width: 350,
        photo_height: 450,
        signature_width: 350,
        signature_height: 150,
        dpi: 100,
        format: "JPEG".to_string(),
        naming_convention: "CAT_{document_type}".to_string(),
    });
    
    // GATE format specifications
    formats.insert("gate".to_string(), ExamFormat {
        photo_width: 350,
        photo_height: 450,
        signature_width: 350,
        signature_height: 150,
        dpi: 100,
        format: "JPEG".to_string(),
        naming_convention: "GATE_{document_type}".to_string(),
    });
    
    formats
}

#[wasm_bindgen]
pub fn convert_document(
    file_data: &[u8],
    document_type: &str,
    exam_type: &str,
    filename: &str,
) -> Result<JsValue, JsValue> {
    console_log!("Converting document: {} for exam: {}", document_type, exam_type);
    
    let formats = get_exam_formats();
    let exam_format = formats.get(exam_type)
        .ok_or_else(|| JsValue::from_str("Unsupported exam type"))?;
    
    let converted = match document_type {
        "passport_photo" => convert_photo(file_data, exam_format)?,
        "signature" => convert_signature(file_data, exam_format)?,
        "thumb_impression" => convert_thumb_impression(file_data, exam_format)?,
        _ => convert_document_generic(file_data, exam_format, document_type)?,
    };
    
    let result = ConvertedDocument {
        name: generate_filename(document_type, exam_format, filename),
        data: converted,
        document_type: document_type.to_string(),
        format: exam_format.format.clone(),
    };
    
    Ok(serde_wasm_bindgen::to_value(&result)?)
}

fn convert_photo(data: &[u8], format: &ExamFormat) -> Result<Vec<u8>, JsValue> {
    console_log!("Converting photo to {}x{}", format.photo_width, format.photo_height);
    
    // Load image
    let img = image::load_from_memory(data)
        .map_err(|e| JsValue::from_str(&format!("Failed to load image: {}", e)))?;
    
    // Resize to exact dimensions
    let resized = img.resize_exact(
        format.photo_width,
        format.photo_height,
        image::imageops::FilterType::Lanczos3,
    );
    
    // Convert to JPEG
    let mut output = Vec::new();
    resized.write_to(&mut std::io::Cursor::new(&mut output), image::ImageOutputFormat::Jpeg(90))
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;
    
    Ok(output)
}

fn convert_signature(data: &[u8], format: &ExamFormat) -> Result<Vec<u8>, JsValue> {
    console_log!("Converting signature to {}x{}", format.signature_width, format.signature_height);
    
    let img = image::load_from_memory(data)
        .map_err(|e| JsValue::from_str(&format!("Failed to load image: {}", e)))?;
    
    // Resize signature
    let resized = img.resize_exact(
        format.signature_width,
        format.signature_height,
        image::imageops::FilterType::Lanczos3,
    );
    
    // Convert to JPEG
    let mut output = Vec::new();
    resized.write_to(&mut std::io::Cursor::new(&mut output), image::ImageOutputFormat::Jpeg(90))
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;
    
    Ok(output)
}

fn convert_thumb_impression(data: &[u8], format: &ExamFormat) -> Result<Vec<u8>, JsValue> {
    console_log!("Converting thumb impression");
    
    let img = image::load_from_memory(data)
        .map_err(|e| JsValue::from_str(&format!("Failed to load image: {}", e)))?;
    
    // For thumb impression, use a square format
    let size = format.signature_height; // Use signature height as square dimension
    let resized = img.resize_exact(size, size, image::imageops::FilterType::Lanczos3);
    
    // Convert to JPEG
    let mut output = Vec::new();
    resized.write_to(&mut std::io::Cursor::new(&mut output), image::ImageOutputFormat::Jpeg(90))
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;
    
    Ok(output)
}

fn convert_document_generic(data: &[u8], format: &ExamFormat, doc_type: &str) -> Result<Vec<u8>, JsValue> {
    console_log!("Converting generic document: {}", doc_type);
    
    // For documents like marksheets, certificates, etc., we typically just ensure
    // they're in the right format (PDF or high-quality JPEG)
    
    // Try to load as image first
    if let Ok(img) = image::load_from_memory(data) {
        // If it's an image, convert to high-quality JPEG
        let mut output = Vec::new();
        img.write_to(&mut std::io::Cursor::new(&mut output), image::ImageOutputFormat::Jpeg(95))
            .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;
        return Ok(output);
    }
    
    // If it's not an image, assume it's already in the correct format (PDF)
    Ok(data.to_vec())
}

fn generate_filename(doc_type: &str, format: &ExamFormat, original: &str) -> String {
    let extension = if format.format == "JPEG" { "jpg" } else { "pdf" };
    
    let doc_name = match doc_type {
        "passport_photo" => "Photo",
        "signature" => "Signature", 
        "thumb_impression" => "Thumb_Impression",
        "aadhar_card" => "Aadhar_Card",
        "10th_marksheet" => "10th_Marksheet",
        "12th_marksheet" => "12th_Marksheet",
        "graduation_certificate" => "Graduation_Certificate",
        "community_certificate" => "Community_Certificate",
        "income_certificate" => "Income_Certificate",
        "pwd_certificate" => "PwD_Certificate",
        _ => "Document",
    };
    
    format!("{}_{}.{}", 
        format.naming_convention.replace("{document_type}", doc_name),
        chrono::Utc::now().format("%Y%m%d"),
        extension
    )
}

#[wasm_bindgen]
pub fn get_supported_exams() -> JsValue {
    let exams = vec!["neet", "jee", "upsc", "cat", "gate"];
    serde_wasm_bindgen::to_value(&exams).unwrap()
}

#[wasm_bindgen]
pub fn get_exam_requirements(exam_type: &str) -> Result<JsValue, JsValue> {
    let requirements = match exam_type {
        "neet" => vec![
            "passport_photo", "signature", "thumb_impression",
            "10th_marksheet", "12th_marksheet", "aadhar_card",
            "community_certificate"
        ],
        "jee" => vec![
            "passport_photo", "signature", "thumb_impression",
            "10th_marksheet", "12th_marksheet", "aadhar_card",
            "community_certificate", "pwd_certificate"
        ],
        "upsc" => vec![
            "passport_photo", "signature", "thumb_impression",
            "10th_marksheet", "12th_marksheet", "graduation_certificate",
            "aadhar_card", "community_certificate", "pwd_certificate"
        ],
        "cat" => vec![
            "passport_photo", "signature", "10th_marksheet",
            "12th_marksheet", "graduation_certificate", "aadhar_card",
            "community_certificate", "pwd_certificate"
        ],
        "gate" => vec![
            "passport_photo", "signature", "10th_marksheet",
            "12th_marksheet", "graduation_certificate", "aadhar_card",
            "community_certificate", "pwd_certificate"
        ],
        _ => return Err(JsValue::from_str("Unsupported exam type")),
    };
    
    Ok(serde_wasm_bindgen::to_value(&requirements)?)
}

// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn main() {
    console_log!("Exam converter WASM module initialized");
}