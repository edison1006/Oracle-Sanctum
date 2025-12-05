from typing import List
from datetime import datetime
import json

from fastapi import Depends, FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .db import Base, engine, get_db
from .ocr import analyze_image_text

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fortune Telling API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/readings", response_model=schemas.ReadingOut)
def create_reading(reading: schemas.ReadingCreate, db: Session = Depends(get_db)):
    db_reading = models.Reading(
        type=reading.type,
        input_data=reading.input_data,
        result=reading.result,
        user_id=reading.user_id,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading


@app.get("/readings", response_model=List[schemas.ReadingOut])
def list_readings(db: Session = Depends(get_db)):
    return db.query(models.Reading).order_by(models.Reading.created_at.desc()).limit(50).all()


HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
FIVE_ELEMENTS = {
    "甲": "木",
    "乙": "木",
    "丙": "火",
    "丁": "火",
    "戊": "土",
    "己": "土",
    "庚": "金",
    "辛": "金",
    "壬": "水",
    "癸": "水",
}
CHINESE_ZODIAC = [
    "鼠",
    "牛",
    "虎",
    "兔",
    "龙",
    "蛇",
    "马",
    "羊",
    "猴",
    "鸡",
    "狗",
    "猪",
]


def compute_year_pillar(year: int) -> schemas.BaziPillar:
    """
    Very simplified year pillar calculation using 1984 (甲子年) as base of 60-year cycle.
    This is enough for a first version and can be refined later.
    """
    base_year = 1984  # 甲子年
    offset = (year - base_year) % 60
    stem = HEAVENLY_STEMS[offset % 10]
    branch_index = offset % 12
    branch = EARTHLY_BRANCHES[branch_index]
    element = FIVE_ELEMENTS[stem]
    animal = CHINESE_ZODIAC[branch_index]
    return schemas.BaziPillar(stem=stem, branch=branch, element=element, animal=animal)


@app.post("/bazi", response_model=schemas.BaziResponse)
def calculate_bazi(payload: schemas.BaziRequest, db: Session = Depends(get_db)):
    """
    Very first version of Bazi: calculate only the year pillar from birth date.
    Later we can extend to month/day/hour pillars and more detailed interpretation.
    """
    try:
        # Parse YYYY-MM-DD format
        birth = datetime.strptime(payload.birth_date, "%Y-%m-%d")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid birth_date format, expected YYYY-MM-DD: {str(e)}")

    year_pillar = compute_year_pillar(birth.year)

    summary = f"{year_pillar.stem}{year_pillar.branch}年，五行属{year_pillar.element}，生肖为{year_pillar.animal}。"

    # Save into readings table for history (optional, don't fail if DB is unavailable)
    try:
        reading = models.Reading(
            type="bazi",
            input_data=json.dumps(payload.dict(), ensure_ascii=False),
            result=json.dumps(
                {
                    "year_pillar": year_pillar.dict(),
                    "summary": summary,
                },
                ensure_ascii=False,
            ),
            user_id=payload.user_id,
        )
        db.add(reading)
        db.commit()
        db.refresh(reading)
    except Exception as db_error:
        # Log but don't fail - calculation is more important than saving
        print(f"Warning: Failed to save reading to database: {db_error}")

    return schemas.BaziResponse(year_pillar=year_pillar, summary=summary, raw_input=payload)

@app.post("/ocr/face")
async def ocr_face(image: UploadFile = File(...)):
    """
    Upload a face photo; returns raw OCR text extracted by AWS Textract.
    """
    return await analyze_image_text(image, mode="face")


@app.post("/ocr/palm")
async def ocr_palm(image: UploadFile = File(...)):
    """
    Upload a palm photo; returns raw OCR text extracted by AWS Textract.
    """
    return await analyze_image_text(image, mode="palm")




