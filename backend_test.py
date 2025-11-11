#!/usr/bin/env python3
"""
Backend API Testing for Baby Gender & Genetic Diseases Prediction App
Tests all endpoints with various scenarios including Arabic/English language support
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://baby-reveal.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details=""):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        if not success:
            self.failed_tests.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test GET /api/ - Health check endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_test("Health Check", True, f"Response: {data}")
                else:
                    self.log_test("Health Check", False, f"Missing fields in response: {data}")
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
    
    def test_gender_prediction_arabic(self):
        """Test gender prediction with Arabic language"""
        try:
            payload = {
                "current_pregnancy_order": 2,
                "wife_family_children": [
                    {"order": 1, "gender": "male"}
                ],
                "husband_family_children": [
                    {"order": 1, "gender": "male"}
                ],
                "language": "ar"
            }
            
            response = requests.post(f"{BACKEND_URL}/predict-gender", 
                                   json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["predicted_gender", "confidence", "explanation", "wife_pattern", "husband_pattern"]
                
                if all(field in data for field in required_fields):
                    # Check if explanation is in Arabic (contains Arabic characters)
                    has_arabic = any('\u0600' <= char <= '\u06FF' for char in data["explanation"])
                    if has_arabic:
                        self.log_test("Gender Prediction (Arabic)", True, 
                                    f"Predicted: {data['predicted_gender']}, Confidence: {data['confidence']}")
                    else:
                        self.log_test("Gender Prediction (Arabic)", False, 
                                    "Explanation not in Arabic language")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Gender Prediction (Arabic)", False, f"Missing fields: {missing}")
            else:
                self.log_test("Gender Prediction (Arabic)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Gender Prediction (Arabic)", False, f"Exception: {str(e)}")
    
    def test_gender_prediction_english(self):
        """Test gender prediction with English language"""
        try:
            payload = {
                "current_pregnancy_order": 1,
                "wife_family_children": [
                    {"order": 1, "gender": "female"}
                ],
                "husband_family_children": [
                    {"order": 1, "gender": "male"}
                ],
                "language": "en"
            }
            
            response = requests.post(f"{BACKEND_URL}/predict-gender", 
                                   json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["predicted_gender", "confidence", "explanation", "wife_pattern", "husband_pattern"]
                
                if all(field in data for field in required_fields):
                    # Check confidence levels
                    valid_confidence = data["confidence"] in ["high", "medium", "low", "very_low"]
                    if valid_confidence:
                        self.log_test("Gender Prediction (English)", True, 
                                    f"Predicted: {data['predicted_gender']}, Confidence: {data['confidence']}")
                    else:
                        self.log_test("Gender Prediction (English)", False, 
                                    f"Invalid confidence level: {data['confidence']}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Gender Prediction (English)", False, f"Missing fields: {missing}")
            else:
                self.log_test("Gender Prediction (English)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Gender Prediction (English)", False, f"Exception: {str(e)}")
    
    def test_gender_prediction_edge_cases(self):
        """Test gender prediction edge cases"""
        # Test with high pregnancy order
        try:
            payload = {
                "current_pregnancy_order": 5,
                "wife_family_children": [
                    {"order": 1, "gender": "male"},
                    {"order": 2, "gender": "female"}
                ],
                "husband_family_children": [
                    {"order": 1, "gender": "female"}
                ],
                "language": "en"
            }
            
            response = requests.post(f"{BACKEND_URL}/predict-gender", 
                                   json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Gender Prediction (High Order)", True, 
                            f"Handled high pregnancy order successfully")
            else:
                self.log_test("Gender Prediction (High Order)", False, 
                            f"Failed with high pregnancy order: {response.text}")
                
        except Exception as e:
            self.log_test("Gender Prediction (High Order)", False, f"Exception: {str(e)}")
    
    def test_genetic_diseases_arabic(self):
        """Test genetic diseases prediction with Arabic"""
        try:
            payload = {
                "wife_family_diseases": ["thalassemia", "sickle cell"],
                "husband_family_diseases": ["hemophilia"],
                "gender": "male",
                "language": "ar"
            }
            
            response = requests.post(f"{BACKEND_URL}/predict-genetic-diseases", 
                                   json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["risk_assessment", "diseases_info", "recommendations", "detailed_explanation"]
                
                if all(field in data for field in required_fields):
                    # Check if explanation is in Arabic
                    has_arabic = any('\u0600' <= char <= '\u06FF' for char in data["detailed_explanation"])
                    valid_risk = data["risk_assessment"] in ["low", "medium", "high"]
                    
                    if has_arabic and valid_risk:
                        self.log_test("Genetic Diseases (Arabic)", True, 
                                    f"Risk: {data['risk_assessment']}, Diseases: {len(data['diseases_info'])}")
                    else:
                        issues = []
                        if not has_arabic:
                            issues.append("Not in Arabic")
                        if not valid_risk:
                            issues.append(f"Invalid risk level: {data['risk_assessment']}")
                        self.log_test("Genetic Diseases (Arabic)", False, f"Issues: {', '.join(issues)}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Genetic Diseases (Arabic)", False, f"Missing fields: {missing}")
            else:
                self.log_test("Genetic Diseases (Arabic)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Genetic Diseases (Arabic)", False, f"Exception: {str(e)}")
    
    def test_genetic_diseases_english(self):
        """Test genetic diseases prediction with English"""
        try:
            payload = {
                "wife_family_diseases": ["color blindness"],
                "husband_family_diseases": ["cystic fibrosis", "duchenne"],
                "gender": "female",
                "language": "en"
            }
            
            response = requests.post(f"{BACKEND_URL}/predict-genetic-diseases", 
                                   json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["risk_assessment", "diseases_info", "recommendations", "detailed_explanation"]
                
                if all(field in data for field in required_fields):
                    valid_risk = data["risk_assessment"] in ["low", "medium", "high"]
                    has_diseases_info = isinstance(data["diseases_info"], list) and len(data["diseases_info"]) > 0
                    
                    if valid_risk and has_diseases_info:
                        self.log_test("Genetic Diseases (English)", True, 
                                    f"Risk: {data['risk_assessment']}, Diseases: {len(data['diseases_info'])}")
                    else:
                        self.log_test("Genetic Diseases (English)", False, 
                                    f"Invalid data structure or risk level")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Genetic Diseases (English)", False, f"Missing fields: {missing}")
            else:
                self.log_test("Genetic Diseases (English)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Genetic Diseases (English)", False, f"Exception: {str(e)}")
    
    def test_genetic_diseases_edge_cases(self):
        """Test genetic diseases with edge cases"""
        # Test with empty disease lists
        try:
            payload = {
                "wife_family_diseases": [],
                "husband_family_diseases": [],
                "gender": "male",
                "language": "en"
            }
            
            response = requests.post(f"{BACKEND_URL}/predict-genetic-diseases", 
                                   json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                # Should still return valid response with low risk
                if data.get("risk_assessment") == "low":
                    self.log_test("Genetic Diseases (Empty Lists)", True, 
                                "Handled empty disease lists correctly")
                else:
                    self.log_test("Genetic Diseases (Empty Lists)", False, 
                                f"Unexpected risk for empty lists: {data.get('risk_assessment')}")
            else:
                self.log_test("Genetic Diseases (Empty Lists)", False, 
                            f"Failed with empty lists: {response.text}")
                
        except Exception as e:
            self.log_test("Genetic Diseases (Empty Lists)", False, f"Exception: {str(e)}")
    
    def test_history_endpoint(self):
        """Test GET /api/history - Get prediction history"""
        try:
            response = requests.get(f"{BACKEND_URL}/history", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    # Check if we have any predictions from previous tests
                    if len(data) > 0:
                        # Verify structure of first prediction
                        first_pred = data[0]
                        required_fields = ["id", "type", "data", "result", "timestamp"]
                        
                        if all(field in first_pred for field in required_fields):
                            valid_types = first_pred["type"] in ["gender", "genetic"]
                            if valid_types:
                                self.log_test("History Endpoint", True, 
                                            f"Retrieved {len(data)} predictions successfully")
                            else:
                                self.log_test("History Endpoint", False, 
                                            f"Invalid prediction type: {first_pred['type']}")
                        else:
                            missing = [f for f in required_fields if f not in first_pred]
                            self.log_test("History Endpoint", False, f"Missing fields in prediction: {missing}")
                    else:
                        self.log_test("History Endpoint", True, "Empty history (no predictions yet)")
                else:
                    self.log_test("History Endpoint", False, f"Expected list, got: {type(data)}")
            else:
                self.log_test("History Endpoint", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("History Endpoint", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests for: {BACKEND_URL}")
        print("=" * 60)
        
        # Test all endpoints
        self.test_health_check()
        self.test_gender_prediction_arabic()
        self.test_gender_prediction_english()
        self.test_gender_prediction_edge_cases()
        self.test_genetic_diseases_arabic()
        self.test_genetic_diseases_english()
        self.test_genetic_diseases_edge_cases()
        self.test_history_endpoint()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = total_tests - len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if not success:
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")