# This module analyses the raise dispute description and decides if this dispute needs to be expedited
'''
Features:
- Detects the sentiment of the raise dispute description: Patient, Impatient, Neutral
- If the sentiment is Patient, the dispute is not expedited
- If the sentiment is Impatient, the dispute is expedited
- If the sentiment is Neutral, the dispute is not expedited
'''
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import torch.nn.functional as F
import re

# import the model and tokenizer
model_name = "tabularisai/multilingual-sentiment-analysis"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)