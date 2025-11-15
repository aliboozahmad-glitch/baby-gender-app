import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type Gender = 'male' | 'female';

export default function GenderPrediction() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const language = (params.language as 'ar' | 'en') || 'ar';

  // State: flexible children from wife's family and husband's family (1-3)
  const [wifeFamily, setWifeFamily] = useState<Gender[]>(['male']);
  const [husbandFamily, setHusbandFamily] = useState<Gender[]>(['male']);
  const [childNumber, setChildNumber] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const translations = {
    ar: {
      title: 'توقع نوع الجنين',
      subtitle: 'بناءً على التاريخ العائلي',
      wifeFamily: 'نمط عائلة الزوجة',
      husbandFamily: 'نمط عائلة الزوج',
      child: 'الطفل',
      male: 'ذكر',
      female: 'أنثى',
      whichChild: 'أي طفل تريد توقعه؟',
      firstChild: 'الطفل الأول',
      secondChild: 'الطفل الثاني',
      predict: 'احسب النتيجة',
      prediction: 'النتيجة المتوقعة',
      boy: 'ولد 👦',
      girl: 'بنت 👧',
      confidence: 'نسبة الدقة',
      back: 'رجوع',
      newPrediction: 'توقع جديد',
      note: 'ملاحظة: هذا التوقع مبني على التاريخ العائلي وليس فحصاً طبياً',
      instructions: 'حدد نوع الأطفال من كل عائلة (1-3 أطفال)',
      addChild: 'إضافة طفل',
      removeChild: 'حذف طفل',
    },
    en: {
      title: 'Gender Prediction',
      subtitle: 'Based on Family History',
      wifeFamily: "Wife's Family Pattern",
      husbandFamily: "Husband's Family Pattern",
      child: 'Child',
      male: 'Boy',
      female: 'Girl',
      whichChild: 'Which child to predict?',
      firstChild: 'First Child',
      secondChild: 'Second Child',
      predict: 'Calculate Result',
      prediction: 'Predicted Result',
      boy: 'Boy 👦',
      girl: 'Girl 👧',
      confidence: 'Accuracy Rate',
      back: 'Back',
      newPrediction: 'New Prediction',
      note: 'Note: This prediction is based on family history and is not a medical test',
      instructions: 'Select gender of children from each family (1-3 children)',
      addChild: 'Add Child',
      removeChild: 'Remove Child',
    },
  };

  const t = translations[language];

  const toggleWifeChild = (index: number) => {
    const updated = [...wifeFamily];
    updated[index] = updated[index] === 'male' ? 'female' : 'male';
    setWifeFamily(updated);
  };

  const toggleHusbandChild = (index: number) => {
    const updated = [...husbandFamily];
    updated[index] = updated[index] === 'male' ? 'female' : 'male';
    setHusbandFamily(updated);
  };

  const addWifeChild = () => {
    if (wifeFamily.length < 3) {
      setWifeFamily([...wifeFamily, 'male']);
    }
  };

  const removeWifeChild = () => {
    if (wifeFamily.length > 1) {
      setWifeFamily(wifeFamily.slice(0, -1));
    }
  };

  const addHusbandChild = () => {
    if (husbandFamily.length < 3) {
      setHusbandFamily([...husbandFamily, 'male']);
    }
  };

  const removeHusbandChild = () => {
    if (husbandFamily.length > 1) {
      setHusbandFamily(husbandFamily.slice(0, -1));
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      // Prepare data in the format expected by backend
      const wifeChildren = wifeFamily.map((gender, index) => ({
        order: index + 1,
        gender: gender,
      }));

      const husbandChildren = husbandFamily.map((gender, index) => ({
        order: index + 1,
        gender: gender,
      }));

      const response = await axios.post(`${BACKEND_URL}/api/predict-gender`, {
        current_pregnancy_order: childNumber,
        wife_family_children: wifeChildren,
        husband_family_children: husbandChildren,
        language: language,
      });

      setResult(response.data);
    } catch (error: any) {
      console.error('Prediction error:', error);
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'حدث خطأ أثناء التوقع' : 'An error occurred during prediction'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setWifeFamily(['male']);
    setHusbandFamily(['male']);
    setChildNumber(1);
  };

  // Result Screen
  if (result) {
    const resultColors = result.predicted_gender === 'male' 
      ? ['#87CEEB', '#4682B4', '#1E90FF']
      : ['#FFB6C1', '#FF69B4', '#FF1493'];
    
    return (
      <LinearGradient colors={resultColors} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons
              name={language === 'ar' ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.resultContainer}>
            <Text style={[styles.resultTitle, language === 'ar' && styles.rtl]}>
              {t.prediction}
            </Text>

            <View style={styles.genderIcon}>
              <Text style={styles.genderEmoji}>
                {result.predicted_gender === 'male' ? '👦' : '👧'}
              </Text>
            </View>

            <Text style={[styles.genderText, language === 'ar' && styles.rtl]}>
              {result.predicted_gender === 'male' ? t.boy : t.girl}
            </Text>

            <View style={styles.confidenceContainer}>
              <Text style={[styles.confidenceLabel, language === 'ar' && styles.rtl]}>
                {t.confidence}
              </Text>
              <Text style={styles.confidenceValue}>
                {result.confidence_percentage}%
              </Text>
            </View>

            <Text style={[styles.note, language === 'ar' && styles.rtl]}>
              {t.note}
            </Text>

            <TouchableOpacity onPress={resetForm} style={styles.newPredictionButton}>
              <Text style={[styles.newPredictionText, language === 'ar' && styles.rtl]}>
                {t.newPrediction}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Input Form
  return (
    <LinearGradient colors={['#E0BBE4', '#957DAD', '#D291BC']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name={language === 'ar' ? 'arrow-forward' : 'arrow-back'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <Text style={[styles.title, language === 'ar' && styles.rtl]}>{t.title}</Text>
        <Text style={[styles.subtitle, language === 'ar' && styles.rtl]}>{t.subtitle}</Text>
        
        <Text style={[styles.instructions, language === 'ar' && styles.rtl]}>
          {t.instructions}
        </Text>

        {/* Wife's Family Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
              {t.wifeFamily}
            </Text>
            <View style={styles.addRemoveButtons}>
              <TouchableOpacity
                onPress={removeWifeChild}
                style={[styles.smallButton, wifeFamily.length <= 1 && styles.buttonDisabled]}
                disabled={wifeFamily.length <= 1}
              >
                <Ionicons name="remove" size={20} color={wifeFamily.length <= 1 ? '#ccc' : 'white'} />
              </TouchableOpacity>
              <Text style={styles.countText}>{wifeFamily.length}</Text>
              <TouchableOpacity
                onPress={addWifeChild}
                style={[styles.smallButton, wifeFamily.length >= 3 && styles.buttonDisabled]}
                disabled={wifeFamily.length >= 3}
              >
                <Ionicons name="add" size={20} color={wifeFamily.length >= 3 ? '#ccc' : 'white'} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.childrenRow}>
            {wifeFamily.map((gender, index) => (
              <TouchableOpacity
                key={`wife-${index}`}
                style={[
                  styles.childButton,
                  gender === 'male' ? styles.maleButton : styles.femaleButton,
                ]}
                onPress={() => toggleWifeChild(index)}
              >
                <Text style={styles.childNumber}>{t.child} {index + 1}</Text>
                <Text style={styles.childGenderEmoji}>
                  {gender === 'male' ? '👦' : '👧'}
                </Text>
                <Text style={styles.childGenderText}>
                  {gender === 'male' ? t.male : t.female}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Husband's Family Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
              {t.husbandFamily}
            </Text>
            <View style={styles.addRemoveButtons}>
              <TouchableOpacity
                onPress={removeHusbandChild}
                style={[styles.smallButton, husbandFamily.length <= 1 && styles.buttonDisabled]}
                disabled={husbandFamily.length <= 1}
              >
                <Ionicons name="remove" size={20} color={husbandFamily.length <= 1 ? '#ccc' : 'white'} />
              </TouchableOpacity>
              <Text style={styles.countText}>{husbandFamily.length}</Text>
              <TouchableOpacity
                onPress={addHusbandChild}
                style={[styles.smallButton, husbandFamily.length >= 3 && styles.buttonDisabled]}
                disabled={husbandFamily.length >= 3}
              >
                <Ionicons name="add" size={20} color={husbandFamily.length >= 3 ? '#ccc' : 'white'} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.childrenRow}>
            {husbandFamily.map((gender, index) => (
              <TouchableOpacity
                key={`husband-${index}`}
                style={[
                  styles.childButton,
                  gender === 'male' ? styles.maleButton : styles.femaleButton,
                ]}
                onPress={() => toggleHusbandChild(index)}
              >
                <Text style={styles.childNumber}>{t.child} {index + 1}</Text>
                <Text style={styles.childGenderEmoji}>
                  {gender === 'male' ? '👦' : '👧'}
                </Text>
                <Text style={styles.childGenderText}>
                  {gender === 'male' ? t.male : t.female}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Child Number Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
            {t.whichChild}
          </Text>
          
          <View style={styles.childNumberRow}>
            <TouchableOpacity
              style={[
                styles.childNumberButton,
                childNumber === 1 && styles.childNumberButtonActive,
              ]}
              onPress={() => setChildNumber(1)}
            >
              <Text style={[
                styles.childNumberText,
                childNumber === 1 && styles.childNumberTextActive,
                language === 'ar' && styles.rtl
              ]}>
                {t.firstChild}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.childNumberButton,
                childNumber === 2 && styles.childNumberButtonActive,
              ]}
              onPress={() => setChildNumber(2)}
            >
              <Text style={[
                styles.childNumberText,
                childNumber === 2 && styles.childNumberTextActive,
                language === 'ar' && styles.rtl
              ]}>
                {t.secondChild}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Predict Button */}
        <TouchableOpacity
          onPress={handlePredict}
          style={styles.predictButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[styles.predictButtonText, language === 'ar' && styles.rtl]}>
              {t.predict}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.noteSmall, language === 'ar' && styles.rtl]}>
          {t.note}
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  instructions: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  addRemoveButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
    opacity: 0.5,
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    minWidth: 25,
    textAlign: 'center',
  },
  childrenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  childButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  maleButton: {
    borderWidth: 3,
    borderColor: '#4682B4',
  },
  femaleButton: {
    borderWidth: 3,
    borderColor: '#FF69B4',
  },
  childNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  childGenderEmoji: {
    fontSize: 40,
    marginVertical: 5,
  },
  childGenderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  childNumberRow: {
    flexDirection: 'row',
    gap: 15,
  },
  childNumberButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  childNumberButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFF8DC',
  },
  childNumberText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  childNumberTextActive: {
    color: '#333',
    fontWeight: 'bold',
  },
  accuracyHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  predictButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  predictButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteSmall: {
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  // Result Screen Styles
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  genderIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  genderEmoji: {
    fontSize: 80,
  },
  genderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  confidenceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    minWidth: 200,
  },
  confidenceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  confidenceValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  note: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  newPredictionButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  newPredictionText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
