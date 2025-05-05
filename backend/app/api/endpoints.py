from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
import os
from fastapi import APIRouter, HTTPException, Query
import shutil
from datetime import datetime
from ..core.database import get_db
from ..models.image import Image
from ..core.image_processing import train_model_v1, test_model_v1, train_model_v2, test_model_v2
from ..core.config import settings
from fastapi.responses import FileResponse, StreamingResponse

router = APIRouter()

@router.delete("/clear-model")
async def clear_model(model_path: str = Query(default="saved_features.pkl")):
    try:
        model_path = os.path.join(model_path)
        if os.path.exists(model_path):
            os.remove(model_path)
            return {
                "status": "success",
                "message": f"Model file '{model_path}' deleted."
            }
        else:
            raise HTTPException(status_code=404, detail=f"Model file '{model_path}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/train")
async def train_images(files: List[UploadFile] = File(...)):
    try:
        image_data = []
        labels = []

        for file in files:
            image_bytes = await file.read()
            image_data.append(image_bytes)
            labels.append(file.filename.rsplit(".", 1)[0])  # Dùng tên file làm nhãn

        result = train_model_v2(image_data, labels)

        if result['status'] == 'success':
            return {
                "status": "success",
                "message": "Model trained successfully",
                "model_path_pickle": result['model_path_pickle'],
                "model_path_json": result['model_path_json'],
                "metadata": result
            }
        else:
            raise HTTPException(status_code=500, detail=result.get('message', 'Training failed'))

    except Exception as e:
        print("TRAIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test")
async def test_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = test_model_v2(image_bytes)

        if result['status'] == 'success':
            return {
                "status": "success",
                "predicted_class": result['predicted_class'],
                "similarity": result['similarity']
            }
        else:
            raise HTTPException(status_code=500, detail=result.get('message', 'Testing failed'))

    except Exception as e:
        print("TRAINING ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def get_models():
    try:
        models_dir = settings.FEATURE_EXTRACTION_MODEL_PATH
        if not os.path.exists(models_dir):
            return []
        
        models = []
        for filename in os.listdir(models_dir):
            if filename.endswith(".h5"):  # Assuming model files are .h5
                filepath = os.path.join(models_dir, filename)
                models.append({
                    "id": filename,
                    "name": filename,
                    "created_at": datetime.fromtimestamp(os.path.getctime(filepath)).isoformat(),
                    "size": f"{os.path.getsize(filepath) / 1024 / 1024:.2f} MB"
                })
        
        return models
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models/{model_id}/download")
async def download_model(model_id: str):
    try:
        model_path = os.path.join(settings.FEATURE_EXTRACTION_MODEL_PATH, model_id)
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="Model not found")
        
        return FileResponse(
            model_path,
            media_type="application/octet-stream",
            filename=model_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download-model")
async def download_model(model_path: str = Query(default="saved_features.pkl")):
    try:
        model_path = os.path.join(model_path)
        
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="Model not found. Please train the model first.")
        
        # Create a zip file containing the model files
        import zipfile
        import io
        
        # Create a BytesIO object to store the zip file
        zip_buffer = io.BytesIO()
        
        # Create zip file in memory
        with zipfile.ZipFile(zip_buffer, 'w') as zipf:
            # Add classifier file
            with open(model_path, 'rb') as f:
                zipf.writestr('model.pkl', f.read())
        
        # Reset buffer position
        zip_buffer.seek(0)
        
        # Return the zip file
        return Response(
            content=zip_buffer.getvalue(),
            media_type='application/zip',
            headers={
                'Content-Disposition': 'attachment; filename=model.zip'
            }
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def compare_features(features1, features2):
    # Simple cosine similarity
    import numpy as np
    features1 = np.array(features1)
    features2 = np.array(features2)
    return np.dot(features1, features2) / (np.linalg.norm(features1) * np.linalg.norm(features2)) 