from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image, ImageDraw
import io
import logging
import traceback

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def detect_pose_landmarks(image):
    """
    Enhanced pose detection using OpenCV and image analysis
    Returns optimized landmarks for better garment overlay
    """
    height, width = image.shape[:2]
    
    # Convert to grayscale for better edge detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Use edge detection to find body contours
    edges = cv2.Canny(gray, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour (likely the person)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Get bounding rectangle of the person
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        # Calculate more accurate landmarks based on body proportions
        landmarks = {
            'left_shoulder': (x + w * 0.25, y + h * 0.15),
            'right_shoulder': (x + w * 0.75, y + h * 0.15),
            'left_elbow': (x + w * 0.15, y + h * 0.35),
            'right_elbow': (x + w * 0.85, y + h * 0.35),
            'left_wrist': (x + w * 0.1, y + h * 0.55),
            'right_wrist': (x + w * 0.9, y + h * 0.55),
            'left_hip': (x + w * 0.35, y + h * 0.65),
            'right_hip': (x + w * 0.65, y + h * 0.65),
            'neck': (x + w * 0.5, y + h * 0.08),
            'waist': (x + w * 0.5, y + h * 0.55),
            'torso_width': w * 0.5,
            'torso_height': h * 0.5
        }
    else:
        # Fallback to center-based landmarks
        landmarks = {
            'left_shoulder': (width * 0.35, height * 0.25),
            'right_shoulder': (width * 0.65, height * 0.25),
            'left_elbow': (width * 0.25, height * 0.4),
            'right_elbow': (width * 0.75, height * 0.4),
            'left_wrist': (width * 0.2, height * 0.55),
            'right_wrist': (width * 0.8, height * 0.55),
            'left_hip': (width * 0.4, height * 0.6),
            'right_hip': (width * 0.6, height * 0.6),
            'neck': (width * 0.5, height * 0.2),
            'waist': (width * 0.5, height * 0.55),
            'torso_width': width * 0.3,
            'torso_height': height * 0.4
        }
    
    return landmarks

def overlay_garment_on_person(person_image, garment_image, garment_type='tshirt'):
    """
    Overlay garment on person using simple positioning
    """
    try:
        # Convert PIL to OpenCV format
        person_cv = cv2.cvtColor(np.array(person_image), cv2.COLOR_RGB2BGR)
        garment_cv = cv2.cvtColor(np.array(garment_image), cv2.COLOR_RGB2BGR)
        
        # Get image dimensions
        person_height, person_width = person_cv.shape[:2]
        
        # Get pose landmarks (simple approximation)
        landmarks = detect_pose_landmarks(person_cv)
        
        # Calculate garment positioning based on type with enhanced accuracy
        if garment_type in ['tshirt', 'hoodie', 'jacket']:
            # Upper body garment with better proportions
            shoulder_width = landmarks['right_shoulder'][0] - landmarks['left_shoulder'][0]
            torso_width = landmarks.get('torso_width', shoulder_width)
            
            garment_width = int(max(shoulder_width * 1.1, torso_width))
            garment_height = int(garment_width * 1.2)
            
            # Better positioning for upper body
            start_x = int(landmarks['left_shoulder'][0] - garment_width * 0.05)
            start_y = int(landmarks['neck'][1] + 10)
            
        elif garment_type == 'dress':
            # Full body garment with natural draping
            shoulder_width = landmarks['right_shoulder'][0] - landmarks['left_shoulder'][0]
            torso_width = landmarks.get('torso_width', shoulder_width)
            
            garment_width = int(max(shoulder_width * 1.2, torso_width * 1.1))
            garment_height = int(person_height * 0.65)
            
            start_x = int(landmarks['left_shoulder'][0] - garment_width * 0.1)
            start_y = int(landmarks['neck'][1] + 15)
            
        elif garment_type == 'pants':
            # Lower body garment with proper waist alignment
            hip_width = landmarks['right_hip'][0] - landmarks['left_hip'][0]
            torso_width = landmarks.get('torso_width', hip_width)
            
            garment_width = int(max(hip_width * 1.1, torso_width))
            garment_height = int(person_height * 0.45)
            
            start_x = int(landmarks['left_hip'][0] - garment_width * 0.05)
            start_y = int(landmarks['waist'][1] - 20)
            
        else:
            # Default to enhanced tshirt
            shoulder_width = landmarks['right_shoulder'][0] - landmarks['left_shoulder'][0]
            torso_width = landmarks.get('torso_width', shoulder_width)
            
            garment_width = int(max(shoulder_width * 1.1, torso_width))
            garment_height = int(garment_width * 1.2)
            start_x = int(landmarks['left_shoulder'][0] - garment_width * 0.05)
            start_y = int(landmarks['neck'][1] + 10)
        
        # Ensure dimensions are valid
        garment_width = max(50, min(garment_width, person_width))
        garment_height = max(50, min(garment_height, person_height))
        start_x = max(0, min(start_x, person_width - garment_width))
        start_y = max(0, min(start_y, person_height - garment_height))
        
        # Resize garment to fit
        garment_resized = cv2.resize(garment_cv, (garment_width, garment_height))
        
        # Create a simple overlay with transparency
        alpha = 0.7  # Transparency level
        
        # Blend the garment onto the person
        end_x = start_x + garment_width
        end_y = start_y + garment_height
        
        # Ensure we don't go out of bounds
        if end_x > person_width:
            end_x = person_width
            garment_width = end_x - start_x
        if end_y > person_height:
            end_y = person_height
            garment_height = end_y - start_y
            
        if garment_width > 0 and garment_height > 0:
            garment_resized = cv2.resize(garment_cv, (garment_width, garment_height))
            
            # Simple alpha blending
            roi = person_cv[start_y:end_y, start_x:end_x]
            blended = cv2.addWeighted(roi, 1-alpha, garment_resized, alpha, 0)
            person_cv[start_y:end_y, start_x:end_x] = blended
        
        # Convert back to PIL
        result_image = Image.fromarray(cv2.cvtColor(person_cv, cv2.COLOR_BGR2RGB))
        return result_image
        
    except Exception as e:
        logger.error(f"Error in overlay_garment_on_person: {str(e)}")
        logger.error(traceback.format_exc())
        return person_image  # Return original if overlay fails

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'virtual-tryon'})

@app.route('/api/detect-pose', methods=['POST'])
def detect_pose():
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo uploaded'}), 400
        
        photo_file = request.files['photo']
        
        # Load image
        image = Image.open(photo_file.stream).convert('RGB')
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Detect pose landmarks
        landmarks = detect_pose_landmarks(image_cv)
        
        return jsonify({
            'landmarks': landmarks,
            'detected': True
        })
        
    except Exception as e:
        logger.error(f"Error in detect_pose: {str(e)}")
        return jsonify({'error': 'Pose detection failed'}), 500

@app.route('/api/virtual-tryon', methods=['POST'])
def virtual_tryon():
    try:
        # Validate required files
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo uploaded'}), 400
        
        if 'garment' not in request.files:
            return jsonify({'error': 'No garment image provided'}), 400
        
        photo_file = request.files['photo']
        garment_file = request.files['garment']
        garment_type = request.form.get('garmentType', 'tshirt')
        
        logger.info(f"Processing virtual try-on: garment_type={garment_type}")
        
        # Load images
        person_image = Image.open(photo_file.stream).convert('RGB')
        garment_image = Image.open(garment_file.stream).convert('RGB')
        
        # Apply virtual try-on
        result_image = overlay_garment_on_person(person_image, garment_image, garment_type)
        
        # Convert to bytes
        img_buffer = io.BytesIO()
        result_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return send_file(
            img_buffer,
            mimetype='image/png',
            as_attachment=False
        )
        
    except Exception as e:
        logger.error(f"Error in virtual_tryon: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Virtual try-on processing failed'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)