# This module analyses the raise dispute description and decides if this dispute needs to be expedited
'''
Features:
- Detects the sentiment of the raise dispute description: Very Negative, Negative, Neutral, Positive, Very Positive
'''
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import torch.nn.functional as F
import re

# import the model and tokenizer
model_name = "tabularisai/multilingual-sentiment-analysis"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def sentiment_analysis(raise_dispute_description):
    # clean the raise dispute description
    raise_dispute_description = re.sub(r'[^\w\s]', '', raise_dispute_description)
    raise_dispute_description = raise_dispute_description.lower()
    # tokenize the raise dispute description
    inputs = tokenizer(raise_dispute_description, return_tensors="pt")
    # get the logits
    logits = model(**inputs).logits
    # get the probabilities
    probs = F.softmax(logits, dim=-1)
    # get the predicted label
    predicted_class = torch.argmax(probs, dim=-1).item()
    # get the sentiment
    sentiment = model.config.id2label[predicted_class]
    return sentiment

# test the function
raise_dispute_description = "Fcking hell, I've been scammed again"
sentiment = sentiment_analysis(raise_dispute_description)
print(sentiment)
