from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
from analysis_engine import analyze_data, UserInputs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/api/analyze")
async def analyze_facial_health(image: UploadFile = File(...), lifestyleData: str = Form(...)):
    try:
        image_bytes = await image.read()
        user_inputs = UserInputs(**json.loads(lifestyleData))
        result = analyze_data(image_bytes, user_inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
