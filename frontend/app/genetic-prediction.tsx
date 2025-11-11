import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function GeneticPrediction() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const language = (params.language as 'ar' | 'en') || 'ar';

  const [wifeDiseases, setWifeDiseases] = useState<string[]>([]);
  const [husbandDiseases, setHusbandDiseases] = useState<string[]>([]);
  const [wifeInput, setWifeInput] = useState('');
  const [husbandInput, setHusbandInput] = useState('');
  const [babyGender, setBabyGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const translations = {
    ar: {
      title: 'توقع الأمراض الوراثية',
      wifeFamily: 'أمراض عائلة الزوجة',
      husbandFamily: 'أمراض عائلة الزوج',
      addDisease: 'إضافة مرض',
      babyGender: 'جنس الطفل المتوقع',
      male: 'ذكر',
      female: 'أنثى',
      analyze: 'تحليل المخاطر',
      riskAssessment: 'تقييم المخاطر',
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      diseases: 'الأمراض',
      recommendations: 'التوصيات',
      explanation: 'التفسير التفصيلي',
      back: 'رجوع',
      newAnalysis: 'تحليل جديد',
      placeholder: 'اكتب اسم المرض',
      commonDiseases: 'أمراض شائعة:',
      thalassemia: 'الثلاسيميا',
      sicklecell: 'فقر الدم المنجلي',
      hemophilia: 'الهيموفيليا',
      colorblindness: 'عمى الألوان',
    },
    en: {
      title: 'Genetic Diseases Prediction',
      wifeFamily: "Wife's Family Diseases",
      husbandFamily: "Husband's Family Diseases",
      addDisease: 'Add Disease',
      babyGender: 'Expected Baby Gender',
      male: 'Male',
      female: 'Female',
      analyze: 'Analyze Risks',
      riskAssessment: 'Risk Assessment',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      diseases: 'Diseases',
      recommendations: 'Recommendations',
      explanation: 'Detailed Explanation',
      back: 'Back',
      newAnalysis: 'New Analysis',
      placeholder: 'Type disease name',
      commonDiseases: 'Common diseases:',
      thalassemia: 'Thalassemia',
      sicklecell: 'Sickle Cell Anemia',
      hemophilia: 'Hemophilia',
      colorblindness: 'Color Blindness',
    },
  };

  const t = translations[language];

  const addWifeDisease = () => {
    if (wifeInput.trim()) {
      setWifeDiseases([...wifeDiseases, wifeInput.trim()]);
      setWifeInput('');
    }
  };

  const addHusbandDisease = () => {
    if (husbandInput.trim()) {
      setHusbandDiseases([...husbandDiseases, husbandInput.trim()]);
      setHusbandInput('');
    }
  };

  const removeWifeDisease = (index: number) => {
    setWifeDiseases(wifeDiseases.filter((_, i) => i !== index));
  };

  const removeHusbandDisease = (index: number) => {
    setHusbandDiseases(husbandDiseases.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/predict-genetic-diseases`, {
        wife_family_diseases: wifeDiseases,
        husband_family_diseases: husbandDiseases,
        gender: babyGender,
        language: language,
      });

      setResult(response.data);
    } catch (error: any) {
      console.error('Analysis error:', error);
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'حدث خطأ أثناء التحليل' : 'An error occurred during analysis'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setWifeDiseases([]);
    setHusbandDiseases([]);
    setWifeInput('');
    setHusbandInput('');
    setBabyGender('male');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFA726';
      case 'low':
        return '#66BB6A';
      default:
        return '#A0AEC0';
    }
  };

  if (result) {
    const resultColors = babyGender === 'male' 
      ? ['#87CEEB', '#4682B4', '#87CEEB'] // أزرق للذكر
      : ['#FFB6C1', '#FF69B4', '#FFB6C1']; // وردي للأنثى
    
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
              {t.riskAssessment}
            </Text>

            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(result.risk_assessment) }]}>
              <Text style={styles.riskText}>
                {result.risk_assessment === 'low'
                  ? t.low
                  : result.risk_assessment === 'medium'
                  ? t.medium
                  : t.high}
              </Text>
            </View>

            {/* Diseases List */}
            <View style={styles.diseasesContainer}>
              <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.diseases}:</Text>
              {result.diseases_info.map((disease: any, index: number) => (
                <View key={index} style={styles.diseaseItem}>
                  <View style={[styles.diseaseRisk, { backgroundColor: getRiskColor(disease.risk_level) }]} />
                  <Text style={[styles.diseaseName, language === 'ar' && styles.rtl]}>{disease.name}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsContainer}>
              <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                {t.recommendations}:
              </Text>
              <Text style={[styles.recommendationsText, language === 'ar' && styles.rtl]}>
                {result.recommendations}
              </Text>
            </View>

            {/* Detailed Explanation */}
            <View style={styles.explanationContainer}>
              <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>
                {t.explanation}:
              </Text>
              <Text style={[styles.explanationText, language === 'ar' && styles.rtl]}>
                {result.detailed_explanation}
              </Text>
            </View>

            <TouchableOpacity onPress={resetForm} style={styles.newAnalysisButton}>
              <Text style={styles.newAnalysisButtonText}>{t.newAnalysis}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F5E6D3', '#E8D4B8', '#F5E6D3']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons
              name={language === 'ar' ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Text style={[styles.title, language === 'ar' && styles.rtl]}>{t.title}</Text>
        </View>

        {/* Common Diseases Info */}
        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, language === 'ar' && styles.rtl]}>{t.commonDiseases}</Text>
          <Text style={[styles.infoText, language === 'ar' && styles.rtl]}>
            {t.thalassemia}, {t.sicklecell}, {t.hemophilia}, {t.colorblindness}
          </Text>
        </View>

        {/* Wife's Family Diseases */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.wifeFamily}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={wifeInput}
              onChangeText={setWifeInput}
              placeholder={t.placeholder}
              placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity onPress={addWifeDisease} style={styles.addIconButton}>
              <Ionicons name="add-circle" size={32} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.diseasesList}>
            {wifeDiseases.map((disease, index) => (
              <View key={index} style={styles.diseaseTag}>
                <Text style={styles.diseaseTagText}>{disease}</Text>
                <TouchableOpacity onPress={() => removeWifeDisease(index)}>
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Husband's Family Diseases */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.husbandFamily}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={husbandInput}
              onChangeText={setHusbandInput}
              placeholder={t.placeholder}
              placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity onPress={addHusbandDisease} style={styles.addIconButton}>
              <Ionicons name="add-circle" size={32} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.diseasesList}>
            {husbandDiseases.map((disease, index) => (
              <View key={index} style={styles.diseaseTag}>
                <Text style={styles.diseaseTagText}>{disease}</Text>
                <TouchableOpacity onPress={() => removeHusbandDisease(index)}>
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Baby Gender Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.babyGender}</Text>
          <View style={styles.genderButtons}>
            <TouchableOpacity
              onPress={() => setBabyGender('male')}
              style={[styles.genderButton, babyGender === 'male' && styles.genderButtonActive]}
            >
              <Ionicons name="male" size={24} color={babyGender === 'male' ? 'white' : '#4682B4'} />
              <Text
                style={[
                  styles.genderButtonText,
                  babyGender === 'male' && styles.genderButtonTextActive,
                ]}
              >
                {t.male}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBabyGender('female')}
              style={[styles.genderButton, babyGender === 'female' && styles.genderButtonActive]}
            >
              <Ionicons name="female" size={24} color={babyGender === 'female' ? 'white' : '#FF69B4'} />
              <Text
                style={[
                  styles.genderButtonText,
                  babyGender === 'female' && styles.genderButtonTextActive,
                ]}
              >
                {t.female}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading}
          style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#4682B4" />
          ) : (
            <Text style={styles.analyzeButtonText}>{t.analyze}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  rtl: {
    writingDirection: 'rtl',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  addIconButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diseasesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  diseaseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  diseaseTagText: {
    fontSize: 14,
    color: '#2D3748',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  genderButtonActive: {
    backgroundColor: '#4682B4',
    borderColor: '#4682B4',
  },
  genderButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  analyzeButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  resultContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  riskBadge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    marginBottom: 32,
  },
  riskText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  diseasesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  diseaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  diseaseRisk: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  diseaseName: {
    fontSize: 16,
    color: '#2D3748',
  },
  recommendationsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  recommendationsText: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginTop: 12,
  },
  explanationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  explanationText: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginTop: 12,
  },
  newAnalysisButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    alignItems: 'center',
  },
  newAnalysisButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4682B4',
  },
});