# Disease Prediction System 🏥

An AI-powered disease prediction system that uses machine learning to predict diseases based on symptoms. The system employs an ensemble of models including Random Forest and Neural Networks to provide accurate predictions with confidence levels.

## 🌟 Features

- **Multi-Model Prediction**: Combines Random Forest and Neural Network predictions
- **Interactive UI**: User-friendly interface for symptom selection and result display
- **Detailed Analysis**: Provides disease descriptions, precautions, and confidence levels
- **Real-time Processing**: Instant predictions with smooth animations

## 🔧 Technology Stack

- **Backend**:
  - Python 3.9.13
  - Flask  
  - PyTorch
  - Scikit-learn

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript
  - jQuery
  - Select2

- **ML/DL**:
  - PyTorch
  - Scikit-learn
  - Numpy
  - Pandas

## 📋 Prerequisites

- Python 3.9.13
- pip (Python package manager)
- Git

## 🚀 Installation

1. Clone the repository:
```
git clone https://github.com/IshuTak/disease_prediction.git
cd disease_prediction
```

2. Create and activate virtual environment:
```
conda create -p venv python==3.10 -y
conda activate venv/
```

3. Install required packages:
```
pip install -r requirements.txt
```
4. Download and process the dataset:
```
python scripts/download_datasets.py
python scripts/data_collection/get_disease_data.py
```
5. Train the model:
```
python scripts/train_model.py
```
## 🎯 Usage
1. Start the Flask application:
```
python src/api/app.py
```
2. Open your browser and navigate to:
```
http://localhost:5000
```
3. Select symptoms from the dropdown menu
4. Click "Predict Disease" to get results
## 💯 Results
![Screenshot_12-2-2025_13455_127 0 0 1](https://github.com/user-attachments/assets/ec1a27c6-8604-4d8e-b72e-7c035aaa2567)

## 📊 Project Structure
```
disease_prediction/
├── data/                  # Dataset files
│   ├── raw/              # Raw dataset files
│   └── processed/        # Processed dataset files
├── models/               # Trained model files
├── src/                  # Source code
│   ├── api/             # Flask application
│   ├── models/          # ML model implementations
│   └── utils/           # Utility functions
├── scripts/             # Setup and training scripts
├── static/              # Static files (CSS, JS)
├── templates/           # HTML templates
└── uploads/             # User uploaded files
```
## 🔍 Model Details
The system uses an ensemble approach combining:

- Random Forest Classifier
- Neural Network
- Feature importance analysis
- Confidence scoring
- 
## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors
- Your Name - Ishu Tak
  
## 🙏 Acknowledgments
- Dataset source: Kaggle Disease Symptom Prediction Dataset
- Medical information references
- Open source community
  
## 🚨 Disclaimer
This system is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
