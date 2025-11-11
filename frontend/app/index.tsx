import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const translations = {
    ar: {
      title: 'توقع نوع الجنين',
      subtitle: 'والأمراض الوراثية',
      description: 'تطبيق احترافي لتوقع نوع الجنين بناءً على نمط العائلة وتقييم الأمراض الوراثية',
      genderPrediction: 'توقع نوع الجنين',
      genderDesc: 'طريقة تقليدية معتمدة على نمط العائلة',
      geneticPrediction: 'توقع الأمراض الوراثية',
      geneticDesc: 'تقييم المخاطر الوراثية مع تفسيرات AI',
      language: 'اللغة',
    },
    en: {
      title: 'Baby Gender Prediction',
      subtitle: '& Genetic Diseases',
      description: 'Professional app for predicting baby gender based on family patterns and genetic disease assessment',
      genderPrediction: 'Gender Prediction',
      genderDesc: 'Traditional method based on family pattern',
      geneticPrediction: 'Genetic Diseases',
      geneticDesc: 'Genetic risk assessment with AI explanations',
      language: 'Language',
    },
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <LinearGradient
      colors={['#E8F5FE', '#FFF0F5', '#E8F5FE']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
            <Ionicons name="language" size={24} color="#6B46C1" />
            <Text style={styles.languageText}>{language === 'ar' ? 'EN' : 'ع'}</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FF69B4', '#87CEEB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Ionicons name="heart" size={50} color="white" />
            </LinearGradient>
          </View>
          <Text style={[styles.title, language === 'ar' && styles.rtl]}>{t.title}</Text>
          <Text style={[styles.subtitle, language === 'ar' && styles.rtl]}>{t.subtitle}</Text>
          <Text style={[styles.description, language === 'ar' && styles.rtl]}>{t.description}</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {/* Gender Prediction Card */}
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/gender-prediction', params: { language } })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFB6C1', '#FF69B4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="male-female" size={40} color="white" />
              </View>
              <Text style={[styles.cardTitle, language === 'ar' && styles.rtl]}>{t.genderPrediction}</Text>
              <Text style={[styles.cardDescription, language === 'ar' && styles.rtl]}>{t.genderDesc}</Text>
              <View style={styles.cardArrow}>
                <Ionicons 
                  name={language === 'ar' ? 'arrow-back' : 'arrow-forward'} 
                  size={24} 
                  color="white" 
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Genetic Prediction Card */}
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/genetic-prediction', params: { language } })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#87CEEB', '#4682B4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="medkit" size={40} color="white" />
              </View>
              <Text style={[styles.cardTitle, language === 'ar' && styles.rtl]}>{t.geneticPrediction}</Text>
              <Text style={[styles.cardDescription, language === 'ar' && styles.rtl]}>{t.geneticDesc}</Text>
              <View style={styles.cardArrow}>
                <Ionicons 
                  name={language === 'ar' ? 'arrow-back' : 'arrow-forward'} 
                  size={24} 
                  color="white" 
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Physical Traits Prediction Card */}
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/traits-prediction', params: { language } })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#DDA15E', '#BC6C25']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="eye" size={40} color="white" />
              </View>
              <Text style={[styles.cardTitle, language === 'ar' && styles.rtl]}>
                {language === 'ar' ? 'الصفات الوراثية' : 'Physical Traits'}
              </Text>
              <Text style={[styles.cardDescription, language === 'ar' && styles.rtl]}>
                {language === 'ar' ? 'توقع لون الشعر والعيون والجلد والطول' : 'Predict hair, eyes, skin color and height'}
              </Text>
              <View style={styles.cardArrow}>
                <Ionicons 
                  name={language === 'ar' ? 'arrow-back' : 'arrow-forward'} 
                  size={24} 
                  color="white" 
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {language === 'ar' ? 'طريقة تقليدية - النتائج ليست مضمونة طبياً' : 'Traditional method - Results are not medically guaranteed'}
          </Text>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  rtl: {
    writingDirection: 'rtl',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardArrow: {
    alignSelf: 'flex-end',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});