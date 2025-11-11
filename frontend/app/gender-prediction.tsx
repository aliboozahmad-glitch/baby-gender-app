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

interface Child {
  order: number;
  gender: 'male' | 'female';
}

export default function GenderPrediction() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const language = (params.language as 'ar' | 'en') || 'ar';

  const [currentOrder, setCurrentOrder] = useState('1');
  const [wifeChildren, setWifeChildren] = useState<Child[]>([{ order: 1, gender: 'male' }]);
  const [husbandChildren, setHusbandChildren] = useState<Child[]>([{ order: 1, gender: 'male' }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const translations = {
    ar: {
      title: 'توقع نوع الجنين',
      currentOrder: 'ترتيب الحمل الحالي',
      wifeFamily: 'نمط عائلة الزوجة',
      husbandFamily: 'نمط عائلة الزوج',
      child: 'الطفل',
      male: 'ذكر',
      female: 'أنثى',
      addChild: 'إضافة طفل',
      predict: 'توقع النوع',
      prediction: 'النتيجة',
      boy: 'ولد',
      girl: 'بنت',
      percentage: 'نسبة التوقع',
      back: 'رجوع',
      newPrediction: 'توقع جديد',
      copyright: 'جميع الحقوق محفوظة - طريقة حسابية خاصة',
    },
    en: {
      title: 'Gender Prediction',
      currentOrder: 'Current Pregnancy Order',
      wifeFamily: "Wife's Family Pattern",
      husbandFamily: "Husband's Family Pattern",
      child: 'Child',
      male: 'Male',
      female: 'Female',
      addChild: 'Add Child',
      predict: 'Predict Gender',
      prediction: 'Result',
      boy: 'Boy',
      girl: 'Girl',
      percentage: 'Prediction Rate',
      back: 'Back',
      newPrediction: 'New Prediction',
      copyright: 'All Rights Reserved - Proprietary Algorithm',
    },
  };

  const t = translations[language];

  const addWifeChild = () => {
    setWifeChildren([...wifeChildren, { order: wifeChildren.length + 1, gender: 'male' }]);
  };

  const addHusbandChild = () => {
    setHusbandChildren([...husbandChildren, { order: husbandChildren.length + 1, gender: 'male' }]);
  };

  const updateWifeChild = (index: number, gender: 'male' | 'female') => {
    const updated = [...wifeChildren];
    updated[index].gender = gender;
    setWifeChildren(updated);
  };

  const updateHusbandChild = (index: number, gender: 'male' | 'female') => {
    const updated = [...husbandChildren];
    updated[index].gender = gender;
    setHusbandChildren(updated);
  };

  const handlePredict = async () => {
    if (!currentOrder || parseInt(currentOrder) < 1) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'الرجاء إدخال ترتيب الحمل الحالي' : 'Please enter current pregnancy order'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/predict-gender`, {
        current_pregnancy_order: parseInt(currentOrder),
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
    setCurrentOrder('1');
    setWifeChildren([{ order: 1, gender: 'male' }]);
    setHusbandChildren([{ order: 1, gender: 'male' }]);
  };

  if (result) {
    const resultColors = result.predicted_gender === 'male' 
      ? ['#87CEEB', '#4682B4', '#87CEEB']
      : ['#FFB6C1', '#FF69B4', '#FFB6C1'];
    
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
            <Text style={[styles.resultTitle, language === 'ar' && styles.rtl]}>{t.prediction}</Text>

            <View style={styles.resultIcon}>
              <Ionicons
                name={result.predicted_gender === 'male' ? 'male' : 'female'}
                size={80}
                color="white"
              />
            </View>

            <Text style={[styles.resultGender, language === 'ar' && styles.rtl]}>
              {result.predicted_gender === 'male' ? t.boy : t.girl}
            </Text>

            {/* Percentage Display */}
            <View style={styles.percentageContainer}>
              <Text style={[styles.percentageLabel, language === 'ar' && styles.rtl]}>
                {t.percentage}
              </Text>
              <View style={styles.percentageCircle}>
                <Text style={styles.percentageValue}>{result.confidence_percentage}%</Text>
              </View>
            </View>

            {/* Copyright Notice */}
            <View style={styles.copyrightContainer}>
              <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={[styles.copyrightText, language === 'ar' && styles.rtl]}>
                {t.copyright}
              </Text>
            </View>

            <TouchableOpacity onPress={resetForm} style={styles.newPredictionButton}>
              <Text style={styles.newPredictionButtonText}>{t.newPrediction}</Text>
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
              color="#6B4423"
            />
          </TouchableOpacity>
          <Text style={[styles.title, language === 'ar' && styles.rtl]}>{t.title}</Text>
        </View>

        {/* Current Order Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.currentOrder}</Text>
          <TextInput
            style={styles.input}
            value={currentOrder}
            onChangeText={setCurrentOrder}
            keyboardType="number-pad"
            placeholder="1"
          />
        </View>

        {/* Wife's Family */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.wifeFamily}</Text>
          {wifeChildren.map((child, index) => (
            <View key={index} style={styles.childRow}>
              <Text style={styles.childLabel}>
                {t.child} {child.order}
              </Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  onPress={() => updateWifeChild(index, 'male')}
                  style={[
                    styles.genderButton,
                    child.gender === 'male' && styles.genderButtonActive,
                  ]}
                >
                  <Ionicons
                    name="male"
                    size={20}
                    color={child.gender === 'male' ? '#4682B4' : '#A0A0A0'}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      child.gender === 'male' && { color: '#4682B4', fontWeight: 'bold' },
                    ]}
                  >
                    {t.male}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateWifeChild(index, 'female')}
                  style={[
                    styles.genderButton,
                    child.gender === 'female' && styles.genderButtonActive,
                  ]}
                >
                  <Ionicons
                    name="female"
                    size={20}
                    color={child.gender === 'female' ? '#FF69B4' : '#A0A0A0'}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      child.gender === 'female' && { color: '#FF69B4', fontWeight: 'bold' },
                    ]}
                  >
                    {t.female}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={addWifeChild} style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#8B5E3C" />
            <Text style={styles.addButtonText}>{t.addChild}</Text>
          </TouchableOpacity>
        </View>

        {/* Husband's Family */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, language === 'ar' && styles.rtl]}>{t.husbandFamily}</Text>
          {husbandChildren.map((child, index) => (
            <View key={index} style={styles.childRow}>
              <Text style={styles.childLabel}>
                {t.child} {child.order}
              </Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  onPress={() => updateHusbandChild(index, 'male')}
                  style={[
                    styles.genderButton,
                    child.gender === 'male' && styles.genderButtonActive,
                  ]}
                >
                  <Ionicons
                    name="male"
                    size={20}
                    color={child.gender === 'male' ? '#4682B4' : '#A0A0A0'}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      child.gender === 'male' && { color: '#4682B4', fontWeight: 'bold' },
                    ]}
                  >
                    {t.male}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateHusbandChild(index, 'female')}
                  style={[
                    styles.genderButton,
                    child.gender === 'female' && styles.genderButtonActive,
                  ]}
                >
                  <Ionicons
                    name="female"
                    size={20}
                    color={child.gender === 'female' ? '#FF69B4' : '#A0A0A0'}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      child.gender === 'female' && { color: '#FF69B4', fontWeight: 'bold' },
                    ]}
                  >
                    {t.female}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={addHusbandChild} style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#8B5E3C" />
            <Text style={styles.addButtonText}>{t.addChild}</Text>
          </TouchableOpacity>
        </View>

        {/* Predict Button */}
        <TouchableOpacity
          onPress={handlePredict}
          disabled={loading}
          style={[styles.predictButton, loading && styles.predictButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#8B5E3C" />
          ) : (
            <Text style={styles.predictButtonText}>{t.predict}</Text>
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
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B4423',
    flex: 1,
  },
  rtl: {
    writingDirection: 'rtl',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B4423',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  childLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4B896',
  },
  genderButtonActive: {
    backgroundColor: 'transparent',
    borderColor: '#D4B896',
    borderWidth: 3,
  },
  genderButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5E3C',
  },
  predictButton: {
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
  predictButtonDisabled: {
    opacity: 0.6,
  },
  predictButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  resultContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  resultIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultGender: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  percentageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  percentageLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  percentageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  percentageValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  copyrightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 32,
  },
  copyrightText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  newPredictionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    alignItems: 'center',
  },
  newPredictionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
});