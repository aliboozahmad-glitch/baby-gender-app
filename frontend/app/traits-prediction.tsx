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

interface TraitSelection {
  hairColor: string;
  eyeColor: string;
  skinTone: string;
  height: string;
}

export default function TraitsPrediction() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const language = (params.language as 'ar' | 'en') || 'ar';

  const [motherTraits, setMotherTraits] = useState<TraitSelection>({
    hairColor: '',
    eyeColor: '',
    skinTone: '',
    height: '',
  });

  const [fatherTraits, setFatherTraits] = useState<TraitSelection>({
    hairColor: '',
    eyeColor: '',
    skinTone: '',
    height: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const translations = {
    ar: {
      title: 'توقع الصفات الوراثية',
      mother: 'صفات الأم',
      father: 'صفات الأب',
      hairColor: 'لون الشعر',
      eyeColor: 'لون العيون',
      skinTone: 'لون الجلد',
      height: 'الطول',
      predict: 'توقع الصفات',
      back: 'رجوع',
      newPrediction: 'توقع جديد',
      results: 'النتائج المتوقعة',
      explanation: 'التفسير العلمي',
      // Hair colors
      black: 'أسود',
      brown: 'بني',
      blonde: 'أشقر',
      red: 'أحمر',
      // Eye colors
      darkBrown: 'بني غامق',
      lightBrown: 'بني فاتح',
      blue: 'أزرق',
      green: 'أخضر',
      hazel: 'عسلي',
      // Skin tones
      veryFair: 'فاتح جداً',
      fair: 'فاتح',
      medium: 'متوسط',
      olive: 'زيتوني',
      brown_skin: 'بني',
      dark: 'غامق',
      // Height
      short: 'قصير',
      average: 'متوسط',
      tall: 'طويل',
    },
    en: {
      title: 'Physical Traits Prediction',
      mother: "Mother's Traits",
      father: "Father's Traits",
      hairColor: 'Hair Color',
      eyeColor: 'Eye Color',
      skinTone: 'Skin Tone',
      height: 'Height',
      predict: 'Predict Traits',
      back: 'Back',
      newPrediction: 'New Prediction',
      results: 'Predicted Results',
      explanation: 'Scientific Explanation',
      // Hair colors
      black: 'Black',
      brown: 'Brown',
      blonde: 'Blonde',
      red: 'Red',
      // Eye colors
      darkBrown: 'Dark Brown',
      lightBrown: 'Light Brown',
      blue: 'Blue',
      green: 'Green',
      hazel: 'Hazel',
      // Skin tones
      veryFair: 'Very Fair',
      fair: 'Fair',
      medium: 'Medium',
      olive: 'Olive',
      brown_skin: 'Brown',
      dark: 'Dark',
      // Height
      short: 'Short',
      average: 'Average',
      tall: 'Tall',
    },
  };

  const t = translations[language];

  const hairColors = [
    { value: 'black', label: t.black },
    { value: 'brown', label: t.brown },
    { value: 'blonde', label: t.blonde },
    { value: 'red', label: t.red },
  ];

  const eyeColors = [
    { value: 'dark_brown', label: t.darkBrown },
    { value: 'light_brown', label: t.lightBrown },
    { value: 'blue', label: t.blue },
    { value: 'green', label: t.green },
    { value: 'hazel', label: t.hazel },
  ];

  const skinTones = [
    { value: 'very_fair', label: t.veryFair },
    { value: 'fair', label: t.fair },
    { value: 'medium', label: t.medium },
    { value: 'olive', label: t.olive },
    { value: 'brown', label: t.brown_skin },
    { value: 'dark', label: t.dark },
  ];

  const heights = [
    { value: 'short', label: t.short },
    { value: 'average', label: t.average },
    { value: 'tall', label: t.tall },
  ];

  const handlePredict = async () => {
    if (!motherTraits.hairColor || !motherTraits.eyeColor || !motherTraits.skinTone || !motherTraits.height ||
        !fatherTraits.hairColor || !fatherTraits.eyeColor || !fatherTraits.skinTone || !fatherTraits.height) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'الرجاء اختيار جميع الصفات للأم والأب' : 'Please select all traits for both parents'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/predict-traits`, {
        mother_traits: motherTraits,
        father_traits: fatherTraits,
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
    setMotherTraits({ hairColor: '', eyeColor: '', skinTone: '', height: '' });
    setFatherTraits({ hairColor: '', eyeColor: '', skinTone: '', height: '' });
  };

  if (result) {
    return (
      <LinearGradient colors={['#DDA15E', '#BC6C25', '#DDA15E']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons
              name={language === 'ar' ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.resultContainer}>
            <Text style={[styles.resultTitle, language === 'ar' && styles.rtl]}>{t.results}</Text>

            {/* Hair Color Result */}
            <View style={styles.traitResult}>
              <View style={styles.traitHeader}>
                <Ionicons name="cut" size={24} color="white" />
                <Text style={[styles.traitLabel, language === 'ar' && styles.rtl]}>{t.hairColor}</Text>
              </View>
              <Text style={[styles.traitValue, language === 'ar' && styles.rtl]}>
                {result.predicted_traits.hair_color}
              </Text>
            </View>

            {/* Eye Color Result */}
            <View style={styles.traitResult}>
              <View style={styles.traitHeader}>
                <Ionicons name="eye" size={24} color="white" />
                <Text style={[styles.traitLabel, language === 'ar' && styles.rtl]}>{t.eyeColor}</Text>
              </View>
              <Text style={[styles.traitValue, language === 'ar' && styles.rtl]}>
                {result.predicted_traits.eye_color}
              </Text>
            </View>

            {/* Skin Tone Result */}
            <View style={styles.traitResult}>
              <View style={styles.traitHeader}>
                <Ionicons name="person" size={24} color="white" />
                <Text style={[styles.traitLabel, language === 'ar' && styles.rtl]}>{t.skinTone}</Text>
              </View>
              <Text style={[styles.traitValue, language === 'ar' && styles.rtl]}>
                {result.predicted_traits.skin_tone}
              </Text>
            </View>

            {/* Height Result */}
            <View style={styles.traitResult}>
              <View style={styles.traitHeader}>
                <Ionicons name="resize" size={24} color="white" />
                <Text style={[styles.traitLabel, language === 'ar' && styles.rtl]}>{t.height}</Text>
              </View>
              <Text style={[styles.traitValue, language === 'ar' && styles.rtl]}>
                {result.predicted_traits.height}
              </Text>
            </View>

            {/* Explanation */}
            <View style={styles.explanationContainer}>
              <Text style={[styles.explanationTitle, language === 'ar' && styles.rtl]}>
                {t.explanation}:
              </Text>
              <Text style={[styles.explanationText, language === 'ar' && styles.rtl]}>
                {result.explanation}
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

  const TraitSelector = ({ 
    title, 
    options, 
    selectedValue, 
    onSelect, 
    icon 
  }: { 
    title: string; 
    options: any[]; 
    selectedValue: string; 
    onSelect: (value: string) => void;
    icon: string;
  }) => (
    <View style={styles.traitSection}>
      <View style={styles.traitTitleContainer}>
        <Ionicons name={icon as any} size={20} color="#6B4423" />
        <Text style={[styles.traitTitle, language === 'ar' && styles.rtl]}>{title}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[
              styles.optionButton,
              selectedValue === option.value && styles.optionButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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

        {/* Mother's Traits */}
        <View style={styles.parentSection}>
          <Text style={[styles.parentTitle, language === 'ar' && styles.rtl]}>{t.mother}</Text>
          
          <TraitSelector
            title={t.hairColor}
            options={hairColors}
            selectedValue={motherTraits.hairColor}
            onSelect={(value) => setMotherTraits({ ...motherTraits, hairColor: value })}
            icon="cut"
          />

          <TraitSelector
            title={t.eyeColor}
            options={eyeColors}
            selectedValue={motherTraits.eyeColor}
            onSelect={(value) => setMotherTraits({ ...motherTraits, eyeColor: value })}
            icon="eye"
          />

          <TraitSelector
            title={t.skinTone}
            options={skinTones}
            selectedValue={motherTraits.skinTone}
            onSelect={(value) => setMotherTraits({ ...motherTraits, skinTone: value })}
            icon="person"
          />

          <TraitSelector
            title={t.height}
            options={heights}
            selectedValue={motherTraits.height}
            onSelect={(value) => setMotherTraits({ ...motherTraits, height: value })}
            icon="resize"
          />
        </View>

        {/* Father's Traits */}
        <View style={styles.parentSection}>
          <Text style={[styles.parentTitle, language === 'ar' && styles.rtl]}>{t.father}</Text>
          
          <TraitSelector
            title={t.hairColor}
            options={hairColors}
            selectedValue={fatherTraits.hairColor}
            onSelect={(value) => setFatherTraits({ ...fatherTraits, hairColor: value })}
            icon="cut"
          />

          <TraitSelector
            title={t.eyeColor}
            options={eyeColors}
            selectedValue={fatherTraits.eyeColor}
            onSelect={(value) => setFatherTraits({ ...fatherTraits, eyeColor: value })}
            icon="eye"
          />

          <TraitSelector
            title={t.skinTone}
            options={skinTones}
            selectedValue={fatherTraits.skinTone}
            onSelect={(value) => setFatherTraits({ ...fatherTraits, skinTone: value })}
            icon="person"
          />

          <TraitSelector
            title={t.height}
            options={heights}
            selectedValue={fatherTraits.height}
            onSelect={(value) => setFatherTraits({ ...fatherTraits, height: value })}
            icon="resize"
          />
        </View>

        {/* Predict Button */}
        <TouchableOpacity
          onPress={handlePredict}
          disabled={loading}
          style={[styles.predictButton, loading && styles.predictButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#BC6C25" />
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
    marginBottom: 24,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B4423',
    flex: 1,
  },
  rtl: {
    writingDirection: 'rtl',
  },
  parentSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  parentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B4423',
    marginBottom: 16,
  },
  traitSection: {
    marginBottom: 20,
  },
  traitTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  traitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5E3C',
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8D4B8',
  },
  optionButtonSelected: {
    backgroundColor: '#DDA15E',
    borderColor: '#BC6C25',
    borderWidth: 3,
  },
  optionText: {
    fontSize: 14,
    color: '#6B4423',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
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
    color: '#BC6C25',
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
  traitResult: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  traitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  traitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B4423',
    marginLeft: 8,
  },
  traitValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BC6C25',
    marginLeft: 32,
  },
  explanationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B4423',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 16,
    color: '#8B5E3C',
    lineHeight: 24,
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
    color: '#BC6C25',
  },
});