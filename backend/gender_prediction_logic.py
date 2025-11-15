# نظام توقع نوع الجنين بناءً على التاريخ العائلي
# Gender Prediction System Based on Family History

import random

# جدول التوقعات - 36 حالة
# Prediction Table - 36 Cases
PREDICTION_TABLE = {
    # التوقع 1-6: عائلة الزوجة (ذكر، ذكر، أنثى)
    ("ذكر", "ذكر", "أنثى", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "ذكر"},  # 1
    ("ذكر", "ذكر", "أنثى", "ذكر", "أنثى", "أنثى"): {"first": "ذكر", "second": "ذكر"},  # 2
    ("ذكر", "ذكر", "أنثى", "أنثى", "ذكر", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 3
    ("ذكر", "ذكر", "أنثى", "أنثى", "ذكر", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 4
    ("ذكر", "ذكر", "أنثى", "أنثى", "أنثى", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 5
    ("ذكر", "ذكر", "أنثى", "ذكر", "أنثى", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 6
    
    # التوقع 7-12: عائلة الزوجة (ذكر، أنثى، أنثى)
    ("ذكر", "أنثى", "أنثى", "ذكر", "أنثى", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 7
    ("ذكر", "أنثى", "أنثى", "أنثى", "ذكر", "أنثى"): {"first": "أنثى", "second": "ذكر"},  # 8
    ("ذكر", "أنثى", "أنثى", "أنثى", "ذكر", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 9
    ("ذكر", "أنثى", "أنثى", "أنثى", "أنثى", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 10
    ("ذكر", "أنثى", "أنثى", "ذكر", "أنثى", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 11
    ("ذكر", "أنثى", "أنثى", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "ذكر"},  # 12
    
    # التوقع 13-18: عائلة الزوجة (أنثى، ذكر، أنثى)
    ("أنثى", "ذكر", "أنثى", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 13
    ("أنثى", "ذكر", "أنثى", "ذكر", "أنثى", "أنثى"): {"first": "أنثى", "second": "ذكر"},  # 14
    ("أنثى", "ذكر", "أنثى", "أنثى", "ذكر", "أنثى"): {"first": "أنثى", "second": "ذكر"},  # 15
    ("أنثى", "ذكر", "أنثى", "أنثى", "ذكر", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 16
    ("أنثى", "ذكر", "أنثى", "أنثى", "أنثى", "ذكر"): {"first": "أنثى", "second": "أنثى"},  # 17
    ("أنثى", "ذكر", "أنثى", "ذكر", "أنثى", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 18
    
    # التوقع 19-24: عائلة الزوجة (أنثى، ذكر، ذكر)
    ("أنثى", "ذكر", "ذكر", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 19
    ("أنثى", "ذكر", "ذكر", "ذكر", "أنثى", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 20
    ("أنثى", "ذكر", "ذكر", "أنثى", "ذكر", "أنثى"): {"first": "أنثى", "second": "ذكر"},  # 21
    ("أنثى", "ذكر", "ذكر", "أنثى", "ذكر", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 22
    ("أنثى", "ذكر", "ذكر", "أنثى", "أنثى", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 23
    ("أنثى", "ذكر", "ذكر", "ذكر", "أنثى", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 24
    
    # التوقع 25-30: عائلة الزوجة (أنثى، أنثى، ذكر)
    ("أنثى", "أنثى", "ذكر", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 25
    ("أنثى", "أنثى", "ذكر", "ذكر", "أنثى", "أنثى"): {"first": "أنثى", "second": "ذكر"},  # 26
    ("أنثى", "أنثى", "ذكر", "أنثى", "ذكر", "أنثى"): {"first": "أنثى", "second": "ذكر"},  # 27
    ("أنثى", "أنثى", "ذكر", "أنثى", "ذكر", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 28
    ("أنثى", "أنثى", "ذكر", "أنثى", "أنثى", "ذكر"): {"first": "أنثى", "second": "أنثى"},  # 29
    ("أنثى", "أنثى", "ذكر", "ذكر", "أنثى", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 30
    
    # التوقع 31-36: عائلة الزوجة (ذكر، أنثى، ذكر)
    ("ذكر", "أنثى", "ذكر", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "ذكر"},  # 31
    ("ذكر", "أنثى", "ذكر", "ذكر", "أنثى", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 32
    ("ذكر", "أنثى", "ذكر", "أنثى", "ذكر", "أنثى"): {"first": "ذكر", "second": "أنثى"},  # 33
    ("ذكر", "أنثى", "ذكر", "أنثى", "ذكر", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 34
    ("ذكر", "أنثى", "ذكر", "أنثى", "أنثى", "ذكر"): {"first": "أنثى", "second": "ذكر"},  # 35
    ("ذكر", "أنثى", "ذكر", "ذكر", "أنثى", "ذكر"): {"first": "ذكر", "second": "أنثى"},  # 36
    
    # التوقعات 37-40: حالة طفل واحد من كل عائلة
    ("ذكر", "أنثى"): {"first": "أنثى", "second": "أنثى"},  # 37
    ("أنثى", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 38
    ("أنثى", "أنثى"): {"first": "أنثى", "second": "أنثى"},  # 39
    ("ذكر", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 40
    
    # التوقعات 41-52: حالة طفلين من كل عائلة
    ("ذكر", "ذكر", "ذكر", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 41
    ("ذكر", "أنثى", "ذكر", "أنثى"): {"first": "ذكر", "second": "ذكر"},  # 42
    ("أنثى", "أنثى", "أنثى", "أنثى"): {"first": "أنثى", "second": "أنثى"},  # 43
    ("أنثى", "ذكر", "أنثى", "ذكر"): {"first": "أنثى", "second": "أنثى"},  # 44
    ("أنثى", "أنثى", "ذكر", "أنثى"): {"first": "أنثى", "second": "أنثى"},  # 45
    ("ذكر", "ذكر", "أنثى", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 46
    ("ذكر", "أنثى", "ذكر", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 47
    ("أنثى", "ذكر", "ذكر", "ذكر"): {"first": "ذكر", "second": "ذكر"},  # 48
    ("ذكر", "أنثى", "أنثى", "أنثى"): {"first": "أنثى", "second": "أنثى"},  # 49
    ("أنثى", "ذكر", "أنثى", "أنثى"): {"first": "أنثى", "second": "أنثى"},  # 50
    ("ذكر", "ذكر", "ذكر", "أنثى"): {"first": "ذكر", "second": "ذكر"},  # 51
    ("أنثى", "أنثى", "أنثى", "ذكر"): {"first": "أنثى", "second": "أنثى"},  # 52
}

# English version of the table
PREDICTION_TABLE_EN = {
    # Convert Arabic to English for lookups
    ("male", "male", "female", "male", "male", "female"): {"first": "male", "second": "male"},
    ("male", "male", "female", "male", "female", "female"): {"first": "male", "second": "male"},
    ("male", "male", "female", "female", "male", "female"): {"first": "male", "second": "female"},
    ("male", "male", "female", "female", "male", "male"): {"first": "male", "second": "female"},
    ("male", "male", "female", "female", "female", "male"): {"first": "male", "second": "female"},
    ("male", "male", "female", "male", "female", "male"): {"first": "male", "second": "female"},
    
    ("male", "female", "female", "male", "female", "female"): {"first": "male", "second": "female"},
    ("male", "female", "female", "female", "male", "female"): {"first": "female", "second": "male"},
    ("male", "female", "female", "female", "male", "male"): {"first": "male", "second": "female"},
    ("male", "female", "female", "female", "female", "male"): {"first": "female", "second": "male"},
    ("male", "female", "female", "male", "female", "male"): {"first": "male", "second": "female"},
    ("male", "female", "female", "male", "male", "female"): {"first": "male", "second": "male"},
    
    ("female", "male", "female", "male", "male", "female"): {"first": "male", "second": "female"},
    ("female", "male", "female", "male", "female", "female"): {"first": "female", "second": "male"},
    ("female", "male", "female", "female", "male", "female"): {"first": "female", "second": "male"},
    ("female", "male", "female", "female", "male", "male"): {"first": "female", "second": "male"},
    ("female", "male", "female", "female", "female", "male"): {"first": "female", "second": "female"},
    ("female", "male", "female", "male", "female", "male"): {"first": "male", "second": "female"},
    
    ("female", "male", "male", "male", "male", "female"): {"first": "male", "second": "female"},
    ("female", "male", "male", "male", "female", "female"): {"first": "male", "second": "female"},
    ("female", "male", "male", "female", "male", "female"): {"first": "female", "second": "male"},
    ("female", "male", "male", "female", "male", "male"): {"first": "female", "second": "male"},
    ("female", "male", "male", "female", "female", "male"): {"first": "female", "second": "male"},
    ("female", "male", "male", "male", "female", "male"): {"first": "male", "second": "female"},
    
    ("female", "female", "male", "male", "male", "female"): {"first": "male", "second": "female"},
    ("female", "female", "male", "male", "female", "female"): {"first": "female", "second": "male"},
    ("female", "female", "male", "female", "male", "female"): {"first": "female", "second": "male"},
    ("female", "female", "male", "female", "male", "male"): {"first": "female", "second": "male"},
    ("female", "female", "male", "female", "female", "male"): {"first": "female", "second": "female"},
    ("female", "female", "male", "male", "female", "male"): {"first": "female", "second": "male"},
    
    ("male", "female", "male", "male", "male", "female"): {"first": "male", "second": "male"},
    ("male", "female", "male", "male", "female", "female"): {"first": "male", "second": "female"},
    ("male", "female", "male", "female", "male", "female"): {"first": "male", "second": "female"},
    ("male", "female", "male", "female", "male", "male"): {"first": "male", "second": "male"},
    ("male", "female", "male", "female", "female", "male"): {"first": "female", "second": "male"},
    ("male", "female", "male", "male", "female", "male"): {"first": "male", "second": "female"},
    
    # Cases 37-40: One child from each family
    ("male", "female"): {"first": "female", "second": "female"},  # 37
    ("female", "male"): {"first": "male", "second": "male"},  # 38
    ("female", "female"): {"first": "female", "second": "female"},  # 39
    ("male", "male"): {"first": "male", "second": "male"},  # 40
    
    # Cases 41-52: Two children from each family
    ("male", "male", "male", "male"): {"first": "male", "second": "male"},  # 41
    ("male", "female", "male", "female"): {"first": "male", "second": "male"},  # 42
    ("female", "female", "female", "female"): {"first": "female", "second": "female"},  # 43
    ("female", "male", "female", "male"): {"first": "female", "second": "female"},  # 44
    ("female", "female", "male", "female"): {"first": "female", "second": "female"},  # 45
    ("male", "male", "female", "male"): {"first": "male", "second": "male"},  # 46
    ("male", "female", "male", "male"): {"first": "male", "second": "male"},  # 47
    ("female", "male", "male", "male"): {"first": "male", "second": "male"},  # 48
    ("male", "female", "female", "female"): {"first": "female", "second": "female"},  # 49
    ("female", "male", "female", "female"): {"first": "female", "second": "female"},  # 50
    ("male", "male", "male", "female"): {"first": "male", "second": "male"},  # 51
    ("female", "female", "female", "male"): {"first": "female", "second": "female"},  # 52
}


def normalize_gender_ar_to_en(gender_ar):
    """تحويل الجنس من العربية للإنجليزية"""
    if gender_ar in ["ذكر", "male", "boy", "m"]:
        return "male"
    elif gender_ar in ["أنثى", "female", "girl", "f"]:
        return "female"
    return gender_ar.lower()


def predict_gender(wife_family, husband_family, child_number=1):
    """
    توقع نوع الجنين بناءً على التاريخ العائلي
    
    Args:
        wife_family: list of 3 genders from wife's family [child1, child2, child3]
        husband_family: list of 3 genders from husband's family [child1, child2, child3]
        child_number: 1 for first child, 2 for second child
        
    Returns:
        dict: {"gender": "male/female", "confidence": 70-90 for first, 50-60 for second}
    """
    
    # Normalize inputs to English
    wife_normalized = tuple([normalize_gender_ar_to_en(g) for g in wife_family])
    husband_normalized = tuple([normalize_gender_ar_to_en(g) for g in husband_family])
    
    # Create lookup key
    lookup_key = wife_normalized + husband_normalized
    
    # Get prediction
    prediction = PREDICTION_TABLE_EN.get(lookup_key)
    
    if not prediction:
        # If pattern not found, return default
        return {
            "gender": "male",
            "confidence": random.randint(50, 60),
            "note": "Pattern not found in database, using default prediction"
        }
    
    # Get predicted gender for requested child
    if child_number == 1:
        predicted_gender = prediction["first"]
        confidence = random.randint(70, 90)  # 70-90% للطفل الأول
    elif child_number == 2:
        predicted_gender = prediction["second"]
        confidence = random.randint(50, 60)  # 50-60% للطفل الثاني
    else:
        # For 3rd+ children, use lower confidence
        predicted_gender = random.choice(["male", "female"])
        confidence = random.randint(40, 50)
    
    return {
        "gender": predicted_gender,
        "confidence": confidence
    }


def get_explanation_ar(wife_family, husband_family, predicted_gender, child_number):
    """إنشاء شرح بالعربية للتوقع"""
    
    wife_pattern = " - ".join(wife_family)
    husband_pattern = " - ".join(husband_family)
    
    gender_ar = "ذكر" if predicted_gender == "male" else "أنثى"
    child_order_ar = "الأول" if child_number == 1 else "الثاني"
    
    explanation = f"""
    📊 التوقع بناءً على التاريخ العائلي:
    
    🔹 نمط عائلة الزوجة: {wife_pattern}
    🔹 نمط عائلة الزوج: {husband_pattern}
    
    ✨ النتيجة المتوقعة للطفل {child_order_ar}: {gender_ar}
    
    📝 ملاحظة: هذا التوقع مبني على دراسة أنماط التاريخ العائلي وليس فحصاً طبياً.
    للتأكد الدقيق، يُرجى مراجعة الطبيب المختص.
    """
    
    return explanation.strip()


def get_explanation_en(wife_family, husband_family, predicted_gender, child_number):
    """Generate English explanation for the prediction"""
    
    wife_pattern = " - ".join([normalize_gender_ar_to_en(g) for g in wife_family])
    husband_pattern = " - ".join([normalize_gender_ar_to_en(g) for g in husband_family])
    
    child_order_en = "first" if child_number == 1 else "second"
    
    explanation = f"""
    📊 Prediction based on family history:
    
    🔹 Wife's family pattern: {wife_pattern}
    🔹 Husband's family pattern: {husband_pattern}
    
    ✨ Predicted result for {child_order_en} child: {predicted_gender}
    
    📝 Note: This prediction is based on family history patterns and is not a medical test.
    For accurate confirmation, please consult with a medical professional.
    """
    
    return explanation.strip()
