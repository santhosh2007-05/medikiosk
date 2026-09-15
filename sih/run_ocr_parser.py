import sys
import os

# Fix Windows console UTF-8 encoding for unicode characters
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

try:
    import easyocr
    EASY_OCR_AVAILABLE = True
except ImportError:
    EASY_OCR_AVAILABLE = False

def extract_text_from_image(image_path):
    if not os.path.exists(image_path):
        print(f"Error: Image path {image_path} does not exist.")
        return ""
    
    print(f"[OCR ENGINE]: Analyzing image pixels from: {image_path}...")
    
    if EASY_OCR_AVAILABLE:
        try:
            reader = easyocr.Reader(['en'], gpu=False, verbose=False)
            results = reader.readtext(image_path)
            extracted_lines = [text for bbox, text, prob in results if prob > 0.20]
            full_text = "\n".join(extracted_lines)
            
            print("\n=== PADDLE / EASYOCR EXTRACTED REAL TEXT ===")
            print(full_text if full_text else "[No high-confidence text detected in image]")
            print("============================================\n")
            return full_text
        except Exception as e:
            print("OCR extraction error:", e)
            return ""
    else:
        print("EasyOCR module loading fallback.")
        return ""

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_text_from_image(sys.argv[1])
    else:
        print("Usage: python run_ocr_parser.py <path_to_image>")
