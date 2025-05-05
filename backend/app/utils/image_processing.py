import cv2
import numpy as np
from PIL import Image
import json
import os
from ..core.config import settings

def extract_features(image_path: str) -> np.ndarray:
    """
    Extract features from an image using OpenCV
    """
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Resize image to a fixed size
    resized = cv2.resize(gray, (224, 224))
    
    # Extract features using ORB
    orb = cv2.ORB_create()
    keypoints, descriptors = orb.detectAndCompute(resized, None)
    
    # If no descriptors found, return zeros
    if descriptors is None:
        return np.zeros(32)
    
    # Flatten descriptors and take mean
    features = descriptors.flatten()
    if len(features) > 32:
        features = features[:32]
    elif len(features) < 32:
        features = np.pad(features, (0, 32 - len(features)))
    
    return features

def save_features(features: np.ndarray, filename: str) -> str:
    """
    Save features to a file
    """
    features_path = os.path.join(settings.FEATURE_EXTRACTION_MODEL_PATH, f"{filename}.json")
    with open(features_path, 'w') as f:
        json.dump(features.tolist(), f)
    return features_path

def load_features(features_path: str) -> np.ndarray:
    """
    Load features from a file
    """
    with open(features_path, 'r') as f:
        features = json.load(f)
    return np.array(features)

def calculate_similarity(features1: np.ndarray, features2: np.ndarray) -> float:
    """
    Calculate similarity between two feature vectors
    """
    # Normalize features
    features1 = features1 / np.linalg.norm(features1)
    features2 = features2 / np.linalg.norm(features2)
    
    # Calculate cosine similarity
    similarity = np.dot(features1, features2)
    return float(similarity) 