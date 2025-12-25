import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("dataset/plant_disease_with_ndvi_1000.csv")

# Features (INPUTS)
X = df[["temperature", "humidity", "rainfall", "soil_pH"]]

# Label (OUTPUT)
y = df["disease_present"]  # 0 = no disease, 1 = disease

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "ml/model.pkl")

print("✅ Model trained successfully")
print("✅ model.pkl created inside ml/")
