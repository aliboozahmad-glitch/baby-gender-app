from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Get Emergent LLM Key
EMERGENT_LLM_KEY = os.getenv('EMERGENT_LLM_KEY')

# Define Models
class Child(BaseModel):
    order: int
    gender: str  # 'male' or 'female'

class GenderPredictionRequest(BaseModel):
    current_pregnancy_order: int
    wife_family_children: List[Child]
    husband_family_children: List[Child]
    language: str = 'ar'  # 'ar' or 'en'

class GenderPredictionResponse(BaseModel):
    predicted_gender: str
    confidence_percentage: int
    # explanation and patterns stored in DB only, not sent to user

class GeneticDiseaseRequest(BaseModel):
    wife_family_diseases: List[str]
    husband_family_diseases: List[str]
    gender: str  # 'male' or 'female'
    language: str = 'ar'

class GeneticDiseaseResponse(BaseModel):
    risk_assessment: str
    diseases_info: List[dict]
    recommendations: str
    detailed_explanation: str

class PredictionHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # 'gender' or 'genetic'
    data: dict
    result: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Helper function to predict gender based on family pattern
def predict_gender_from_pattern(current_order: int, wife_children: List[Child], husband_children: List[Child]):
    """
    Traditional method: Compare same order in both families
    If they match (boy+boy or girl+girl), that's the prediction
    If they differ (boy+girl), return to first child of both families
    """
    wife_pattern = [c.gender for c in sorted(wife_children, key=lambda x: x.order)]
    husband_pattern = [c.gender for c in sorted(husband_children, key=lambda x: x.order)]
    
    # Get the child at current pregnancy order (index is order-1)
    index = current_order - 1
    
    predicted_gender = None
    confidence = "medium"
    
    # Check if both families have a child at this order
    if index < len(wife_pattern) and index < len(husband_pattern):
        wife_gender = wife_pattern[index]
        husband_gender = husband_pattern[index]
        
        if wife_gender == husband_gender:
            predicted_gender = wife_gender
            confidence = "high"
        else:
            # They differ, so return to first child
            if len(wife_pattern) > 0 and len(husband_pattern) > 0:
                if wife_pattern[0] == husband_pattern[0]:
                    predicted_gender = wife_pattern[0]
                    confidence = "medium"
                else:
                    # Even first child differs, take most common
                    all_genders = wife_pattern + husband_pattern
                    male_count = all_genders.count('male')
                    female_count = all_genders.count('female')
                    predicted_gender = 'male' if male_count >= female_count else 'female'
                    confidence = "low"
    elif len(wife_pattern) > 0 and len(husband_pattern) > 0:
        # One family doesn't have enough children, use first child logic
        if wife_pattern[0] == husband_pattern[0]:
            predicted_gender = wife_pattern[0]
            confidence = "medium"
        else:
            all_genders = wife_pattern + husband_pattern
            male_count = all_genders.count('male')
            female_count = all_genders.count('female')
            predicted_gender = 'male' if male_count >= female_count else 'female'
            confidence = "low"
    else:
        # Not enough data
        predicted_gender = 'male'  # default
        confidence = "very_low"
    
    return predicted_gender, confidence, wife_pattern, husband_pattern

# Helper function to get AI explanation
async def get_ai_explanation(prompt: str, language: str) -> str:
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=f"You are a helpful assistant providing information about baby gender prediction and genetics. Respond in {'Arabic' if language == 'ar' else 'English'}."
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logging.error(f"AI explanation error: {e}")
        return "تفسير غير متوفر حالياً" if language == 'ar' else "Explanation not available"

# Add your routes to the router
@api_router.get("/")
async def root():
    return {"message": "Baby Gender & Genetics Prediction API", "version": "1.0"}

@api_router.post("/predict-gender", response_model=GenderPredictionResponse)
async def predict_gender(request: GenderPredictionRequest):
    try:
        # Predict gender using traditional method
        predicted_gender, confidence, wife_pattern, husband_pattern = predict_gender_from_pattern(
            request.current_pregnancy_order,
            request.wife_family_children,
            request.husband_family_children
        )
        
        # Generate AI explanation
        if request.language == 'ar':
            prompt = f"""بناءً على الطريقة التقليدية لتوقع نوع الجنين:
- ترتيب الحمل الحالي: {request.current_pregnancy_order}
- نمط عائلة الزوجة: {', '.join(['ذكر' if g == 'male' else 'أنثى' for g in wife_pattern])}
- نمط عائلة الزوج: {', '.join(['ذكر' if g == 'male' else 'أنثى' for g in husband_pattern])}
- التوقع: {'ذكر' if predicted_gender == 'male' else 'أنثى'}
- مستوى الثقة: {confidence}

اشرح كيف تم الوصول لهذا التوقع بطريقة بسيطة ومختصرة (3-4 جمل فقط). مع التذكير أن هذه طريقة تقليدية وليست علمية."""
        else:
            prompt = f"""Based on the traditional baby gender prediction method:
- Current pregnancy order: {request.current_pregnancy_order}
- Wife's family pattern: {', '.join(['Boy' if g == 'male' else 'Girl' for g in wife_pattern])}
- Husband's family pattern: {', '.join(['Boy' if g == 'male' else 'Girl' for g in husband_pattern])}
- Prediction: {'Boy' if predicted_gender == 'male' else 'Girl'}
- Confidence level: {confidence}

Explain briefly how this prediction was reached (3-4 sentences only). Remind that this is a traditional method, not scientific."""
        
        explanation = await get_ai_explanation(prompt, request.language)
        
        # Save to database
        prediction = PredictionHistory(
            type="gender",
            data=request.dict(),
            result={
                "predicted_gender": predicted_gender,
                "confidence": confidence,
                "explanation": explanation
            }
        )
        await db.predictions.insert_one(prediction.dict())
        
        return GenderPredictionResponse(
            predicted_gender=predicted_gender,
            confidence=confidence,
            explanation=explanation,
            wife_pattern=wife_pattern,
            husband_pattern=husband_pattern
        )
    except Exception as e:
        logging.error(f"Gender prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/predict-genetic-diseases", response_model=GeneticDiseaseResponse)
async def predict_genetic_diseases(request: GeneticDiseaseRequest):
    try:
        # Common genetic diseases
        genetic_diseases_info = {
            'thalassemia': {
                'ar': 'الثلاسيميا (أنيميا البحر المتوسط)',
                'en': 'Thalassemia',
                'inheritance': 'autosomal_recessive',
                'risk_level': 'high' if 'thalassemia' in [d.lower() for d in request.wife_family_diseases + request.husband_family_diseases] else 'low'
            },
            'sickle_cell': {
                'ar': 'فقر الدم المنجلي',
                'en': 'Sickle Cell Anemia',
                'inheritance': 'autosomal_recessive',
                'risk_level': 'high' if 'sickle' in ' '.join(request.wife_family_diseases + request.husband_family_diseases).lower() else 'low'
            },
            'hemophilia': {
                'ar': 'الهيموفيليا (نزف الدم الوراثي)',
                'en': 'Hemophilia',
                'inheritance': 'x_linked',
                'risk_level': 'high' if request.gender == 'male' and 'hemophilia' in ' '.join(request.wife_family_diseases).lower() else 'low'
            },
            'color_blindness': {
                'ar': 'عمى الألوان',
                'en': 'Color Blindness',
                'inheritance': 'x_linked',
                'risk_level': 'medium' if request.gender == 'male' and 'color' in ' '.join(request.wife_family_diseases + request.husband_family_diseases).lower() else 'low'
            },
            'cystic_fibrosis': {
                'ar': 'التليف الكيسي',
                'en': 'Cystic Fibrosis',
                'inheritance': 'autosomal_recessive',
                'risk_level': 'high' if 'fibrosis' in ' '.join(request.wife_family_diseases + request.husband_family_diseases).lower() else 'low'
            },
            'duchenne': {
                'ar': 'ضمور العضلات الدوشيني',
                'en': 'Duchenne Muscular Dystrophy',
                'inheritance': 'x_linked',
                'risk_level': 'high' if request.gender == 'male' and 'duchenne' in ' '.join(request.wife_family_diseases).lower() else 'low'
            }
        }
        
        # Get AI analysis
        if request.language == 'ar':
            prompt = f"""تحليل الأمراض الوراثية:
- أمراض عائلة الزوجة: {', '.join(request.wife_family_diseases) if request.wife_family_diseases else 'لا توجد'}
- أمراض عائلة الزوج: {', '.join(request.husband_family_diseases) if request.husband_family_diseases else 'لا توجد'}
- جنس الطفل المتوقع: {'ذكر' if request.gender == 'male' else 'أنثى'}

قدم:
1. تقييم عام للمخاطر (منخفض/متوسط/عالي)
2. شرح مختصر للأمراض الوراثية المحتملة
3. توصيات عامة (الفحص الجيني، استشارة طبية)

اجعل الإجابة مطمئنة ومختصرة (5-6 جمل). مع التذكير بأهمية استشارة طبيب متخصص."""
        else:
            prompt = f"""Genetic disease analysis:
- Wife's family diseases: {', '.join(request.wife_family_diseases) if request.wife_family_diseases else 'None'}
- Husband's family diseases: {', '.join(request.husband_family_diseases) if request.husband_family_diseases else 'None'}
- Expected baby gender: {'Male' if request.gender == 'male' else 'Female'}

Provide:
1. General risk assessment (low/medium/high)
2. Brief explanation of potential genetic diseases
3. General recommendations (genetic testing, medical consultation)

Keep the response reassuring and brief (5-6 sentences). Remind about the importance of consulting a specialist."""
        
        detailed_explanation = await get_ai_explanation(prompt, request.language)
        
        # Calculate overall risk
        all_diseases = request.wife_family_diseases + request.husband_family_diseases
        risk_level = "low"
        if len(all_diseases) > 2:
            risk_level = "medium"
        if len(all_diseases) > 4:
            risk_level = "high"
        
        diseases_list = []
        for disease_key, disease_info in genetic_diseases_info.items():
            diseases_list.append({
                'name': disease_info['ar' if request.language == 'ar' else 'en'],
                'risk_level': disease_info['risk_level']
            })
        
        # Save to database
        prediction = PredictionHistory(
            type="genetic",
            data=request.dict(),
            result={
                "risk_assessment": risk_level,
                "diseases_info": diseases_list,
                "detailed_explanation": detailed_explanation
            }
        )
        await db.predictions.insert_one(prediction.dict())
        
        if request.language == 'ar':
            recommendations = "يُنصح بإجراء فحص جيني شامل واستشارة طبيب متخصص في الأمراض الوراثية قبل الحمل أو في المراحل المبكرة منه."
        else:
            recommendations = "It is recommended to undergo comprehensive genetic testing and consult a specialist in genetic diseases before pregnancy or in its early stages."
        
        return GeneticDiseaseResponse(
            risk_assessment=risk_level,
            diseases_info=diseases_list,
            recommendations=recommendations,
            detailed_explanation=detailed_explanation
        )
    except Exception as e:
        logging.error(f"Genetic disease prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/history")
async def get_history():
    """Get prediction history"""
    try:
        predictions = await db.predictions.find({}, {"_id": 0}).sort("timestamp", -1).limit(50).to_list(50)
        return predictions
    except Exception as e:
        logging.error(f"History retrieval error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class TraitsRequest(BaseModel):
    mother_traits: dict
    father_traits: dict
    language: str = 'ar'

class TraitsResponse(BaseModel):
    predicted_traits: dict
    explanation: str

@api_router.post("/predict-traits", response_model=TraitsResponse)
async def predict_traits(request: TraitsRequest):
    """Predict physical traits based on parents' characteristics"""
    try:
        mother = request.mother_traits
        father = request.father_traits
        lang = request.language
        
        # Simple genetic prediction logic
        predicted = {}
        
        # Hair Color (simplified genetics - dark is usually dominant)
        hair_dominance = {'black': 4, 'brown': 3, 'red': 2, 'blonde': 1}
        mother_hair_score = hair_dominance.get(mother.get('hairColor', 'brown'), 2)
        father_hair_score = hair_dominance.get(father.get('hairColor', 'brown'), 2)
        avg_hair = (mother_hair_score + father_hair_score) / 2
        
        if avg_hair >= 3.5:
            predicted['hair_color'] = 'أسود' if request.language == 'ar' else 'Black'
        elif avg_hair >= 2.5:
            predicted['hair_color'] = 'بني' if request.language == 'ar' else 'Brown'
        elif avg_hair >= 1.5:
            predicted['hair_color'] = 'أحمر' if request.language == 'ar' else 'Red'
        else:
            predicted['hair_color'] = 'أشقر' if request.language == 'ar' else 'Blonde'
        
        # Eye Color (brown is dominant over green/blue)
        eye_dominance = {'dark_brown': 5, 'light_brown': 4, 'hazel': 3, 'green': 2, 'blue': 1}
        mother_eye_score = eye_dominance.get(mother.get('eyeColor', 'dark_brown').replace(' ', '_').lower(), 3)
        father_eye_score = eye_dominance.get(father.get('eyeColor', 'dark_brown').replace(' ', '_').lower(), 3)
        avg_eye = (mother_eye_score + father_eye_score) / 2
        
        if avg_eye >= 4.5:
            predicted['eye_color'] = 'بني غامق' if request.language == 'ar' else 'Dark Brown'
        elif avg_eye >= 3.5:
            predicted['eye_color'] = 'بني فاتح' if request.language == 'ar' else 'Light Brown'
        elif avg_eye >= 2.5:
            predicted['eye_color'] = 'عسلي' if request.language == 'ar' else 'Hazel'
        elif avg_eye >= 1.5:
            predicted['eye_color'] = 'أخضر' if request.language == 'ar' else 'Green'
        else:
            predicted['eye_color'] = 'أزرق' if request.language == 'ar' else 'Blue'
        
        # Skin Tone (blend of parents)
        skin_scale = {'very_fair': 1, 'fair': 2, 'medium': 3, 'olive': 4, 'brown': 5, 'dark': 6}
        mother_skin_score = skin_scale.get(mother.get('skinTone', 'medium'), 3)
        father_skin_score = skin_scale.get(father.get('skinTone', 'medium'), 3)
        avg_skin = (mother_skin_score + father_skin_score) / 2
        
        if avg_skin <= 1.5:
            predicted['skin_tone'] = 'فاتح جداً' if request.language == 'ar' else 'Very Fair'
        elif avg_skin <= 2.5:
            predicted['skin_tone'] = 'فاتح' if request.language == 'ar' else 'Fair'
        elif avg_skin <= 3.5:
            predicted['skin_tone'] = 'متوسط' if request.language == 'ar' else 'Medium'
        elif avg_skin <= 4.5:
            predicted['skin_tone'] = 'زيتوني' if request.language == 'ar' else 'Olive'
        elif avg_skin <= 5.5:
            predicted['skin_tone'] = 'بني' if request.language == 'ar' else 'Brown'
        else:
            predicted['skin_tone'] = 'غامق' if request.language == 'ar' else 'Dark'
        
        # Height (average of parents with slight variation)
        height_scale = {'short': 1, 'average': 2, 'tall': 3}
        mother_height_score = height_scale.get(mother.get('height', 'average'), 2)
        father_height_score = height_scale.get(father.get('height', 'average'), 2)
        avg_height = (mother_height_score + father_height_score) / 2
        
        if avg_height <= 1.5:
            predicted['height'] = 'قصير' if request.language == 'ar' else 'Short'
        elif avg_height <= 2.5:
            predicted['height'] = 'متوسط' if request.language == 'ar' else 'Average'
        else:
            predicted['height'] = 'طويل' if request.language == 'ar' else 'Tall'
        
        # Generate AI explanation
        if request.language == 'ar':
            ar_prompt = (
                "اشرح توقع الصفات الوراثية التالية للطفل بناءً على صفات الوالدين:\n\n"
                "صفات الأم:\n"
                f"- لون الشعر: {mother.get('hairColor', 'غير محدد')}\n"
                f"- لون العيون: {mother.get('eyeColor', 'غير محدد')}\n"
                f"- لون الجلد: {mother.get('skinTone', 'غير محدد')}\n"
                f"- الطول: {mother.get('height', 'غير محدد')}\n\n"
                "صفات الأب:\n"
                f"- لون الشعر: {father.get('hairColor', 'غير محدد')}\n"
                f"- لون العيون: {father.get('eyeColor', 'غير محدد')}\n"
                f"- لون الجلد: {father.get('skinTone', 'غير محدد')}\n"
                f"- الطول: {father.get('height', 'غير محدد')}\n\n"
                "الصفات المتوقعة للطفل:\n"
                f"- لون الشعر: {predicted['hair_color']}\n"
                f"- لون العيون: {predicted['eye_color']}\n"
                f"- لون الجلد: {predicted['skin_tone']}\n"
                f"- الطول: {predicted['height']}\n\n"
                "اشرح بشكل علمي مبسط (5-6 جمل) كيف تنتقل هذه الصفات وراثياً ولماذا هذه هي التوقعات. اذكر الجينات السائدة والمتنحية."
            )
            prompt = ar_prompt
        else:
            en_prompt = (
                "Explain the prediction of the following genetic traits for the child based on parents' characteristics:\n\n"
                "Mother's traits:\n"
                f"- Hair color: {mother.get('hairColor', 'not specified')}\n"
                f"- Eye color: {mother.get('eyeColor', 'not specified')}\n"
                f"- Skin tone: {mother.get('skinTone', 'not specified')}\n"
                f"- Height: {mother.get('height', 'not specified')}\n\n"
                "Father's traits:\n"
                f"- Hair color: {father.get('hairColor', 'not specified')}\n"
                f"- Eye color: {father.get('eyeColor', 'not specified')}\n"
                f"- Skin tone: {father.get('skinTone', 'not specified')}\n"
                f"- Height: {father.get('height', 'not specified')}\n\n"
                "Predicted child traits:\n"
                f"- Hair color: {predicted['hair_color']}\n"
                f"- Eye color: {predicted['eye_color']}\n"
                f"- Skin tone: {predicted['skin_tone']}\n"
                f"- Height: {predicted['height']}\n\n"
                "Explain scientifically but simply (5-6 sentences) how these traits are inherited and why these are the predictions. Mention dominant and recessive genes."
            )
            prompt = en_prompt
        
        explanation = await get_ai_explanation(prompt, request.language)
        
        # Save to database
        prediction = PredictionHistory(
            type="traits",
            data=request.dict(),
            result={
                "predicted_traits": predicted,
                "explanation": explanation
            }
        )
        await db.predictions.insert_one(prediction.dict())
        
        return TraitsResponse(
            predicted_traits=predicted,
            explanation=explanation
        )
    except Exception as e:
        logging.error(f"Traits prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()