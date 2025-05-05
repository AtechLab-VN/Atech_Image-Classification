import cv2
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.svm import OneClassSVM, SVC
import joblib
import os
from typing import List, Tuple, Dict, Any
import base64
from app.core.config import settings
import pickle
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import Model
from sklearn.metrics.pairwise import cosine_similarity

# Load pre-trained MobileNetV2 for feature extraction
mobilenet = MobileNetV2(weights="imagenet", include_top=False, pooling='avg')

def get_model_path(filename: str) -> str:
    """Get the full path for a model file"""
    model_dir = settings.FEATURE_EXTRACTION_MODEL_PATH
    os.makedirs(model_dir, exist_ok=True)
    return os.path.join(model_dir, filename)

def extract_features_from_bytes(image_bytes):
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Ảnh không hợp lệ hoặc bị lỗi (decode failed).")

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))

        img = img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img = preprocess_input(img)

        features = mobilenet.predict(img)
        return features.flatten()

    except Exception as e:
        print(f"[ERROR] extract_features_from_bytes: {e}")
        raise

def train_model_v1(image_data, labels):
    """Train the model using MobileNetV2 features"""
    try:
        X, y = [], []

        for img_bytes, label in zip(image_data, labels):
            feat = extract_features_from_bytes(img_bytes)
            X.append(feat)
            y.append(label)

        X = np.array(X)
        y = np.array(y)

        # Apply PCA for dimensionality reduction
        pca = PCA(n_components=min(100, X.shape[0], X.shape[1]))
        X_pca = pca.fit_transform(X)

        # Train classifier
        model = SVC(kernel='rbf', probability=True)
        model.fit(X_pca, y)

        # Save models
        model_path = get_model_path('classifier.pkl')
        pca_path = get_model_path('pca.pkl')
        
        with open(model_path, "wb") as f:
            pickle.dump(model, f)
            
        with open(pca_path, "wb") as f:
            pickle.dump(pca, f)

        return {
            "status": "success",
            "model_path": model_path,
            "num_samples": len(y),
            "labels": list(set(y))
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def test_model_v1(image_bytes):
    """Test the model with a new image"""
    try:
        model_path = get_model_path('classifier.pkl')
        pca_path = get_model_path('pca.pkl')
        
        if not os.path.exists(model_path) or not os.path.exists(pca_path):
            return {"status": "error", "message": "Model not found. Please train first."}

        # Load models
        with open(model_path, "rb") as f:
            model = pickle.load(f)
            
        with open(pca_path, "rb") as f:
            pca = pickle.load(f)

        # Extract and transform features
        features = extract_features_from_bytes(image_bytes)
        features_pca = pca.transform(features.reshape(1, -1))
        
        # Make prediction
        prediction = model.predict(features_pca)[0]
        probas = model.predict_proba(features_pca)[0]
        similarity = float(np.max(probas))

        return {
            "status": "success",
            "predicted_class": prediction,
            "similarity": similarity
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

def train_model_v2(image_data, labels, model_path="saved_features.pkl"):
    try:
        features_dict = {}

        for img_bytes, label in zip(image_data, labels):
            feat = extract_features_from_bytes(img_bytes)
            features_dict[label] = feat.tolist()  # Lưu mỗi label ứng với 1 vector

        with open(model_path, "wb") as f:
            pickle.dump(features_dict, f)

        return {
            "status": "success",
            "model_path": model_path,
            "num_samples": len(features_dict),
            "labels": list(features_dict.keys())
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def test_model_v2(image_bytes, model_path="saved_features.pkl"):
    try:
        # Load đặc trưng đã lưu
        with open(model_path, "rb") as f:
            features_dict = pickle.load(f)

        # Trích xuất đặc trưng từ ảnh mới
        test_feat = extract_features_from_bytes(image_bytes)

        # So sánh với tất cả vector đã lưu bằng cosine similarity
        best_label = None
        best_similarity = -1

        for label, saved_feat in features_dict.items():
            sim = cosine_similarity([test_feat], [saved_feat])[0][0]
            if sim > best_similarity:
                best_similarity = sim
                best_label = label

        return {
            "status": "success",
            "predicted_class": best_label,
            "similarity": float(best_similarity)
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

