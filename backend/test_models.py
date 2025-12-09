import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("\nListing available Gemini models...\n")

models = genai.list_models()

for m in models:
    print("----------------------------")
    print("Model:", m.name)
    print("Supported Methods:", m.supported_generation_methods)
