from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import torch.nn.functional as F
import re

# import the model and tokenizer
model_name = "ealvaradob/bert-finetuned-phishing"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# REGEX FUNCTIONS
# check if input is a url
def is_url(url):
    url_regex = re.compile(
        r"^(?:http|ftp)s?://"
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
        r"localhost|"
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        r"(?::\d+)?"
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )
    return re.match(url_regex, url) is not None

# check if input is an IP address
def is_ip(ip):
    ip_regex = re.compile(
        r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}"
        r"(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    )
    return re.match(ip_regex, ip) is not None

# check if input is a domain
def is_domain(domain):
    domain_regex = re.compile(
        r"^(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}$", re.IGNORECASE
    )
    return re.match(domain_regex, domain) is not None

# check if input is an email
def is_email(email):
    email_regex = re.compile(
        r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", re.IGNORECASE
    )
    return re.match(email_regex, email) is not None

# Extraction function to isolate URLs, IPs, domains, and emails from text
def extract_elements(text):
    words = text.split()
    urls, ips, domains, emails = [], [], [], []

    for word in words:
        if is_url(word):
            urls.append(word)
        elif is_ip(word):
            ips.append(word)
        elif is_domain(word):
            domains.append(word)
        elif is_email(word):
            emails.append(word)

    return {
        "URLs": urls,
        "IPs": ips,
        "Domains": domains,
        "Emails": emails,
    }

# if input is_url, is_ip, is_domain, or is_email, forward to model
def is_phishing(input):
    # print(input)

    # Extract elements from the text
    extracted = extract_elements(input)

    # Flatten all extracted elements into a single list
    elements = extracted["URLs"] + extracted["IPs"] + extracted["Domains"] + extracted["Emails"]
    if not elements:
        return "No valid URLs, IPs, domains, or emails found in the input."

    results = {}

    for item in elements:
        # Tokenize the item
        inputs = tokenizer(item, return_tensors="pt", truncation=True, padding=True)

        # Get model output
        outputs = model(**inputs)

        logits = outputs.logits
        probabilities = F.softmax(logits, dim=-1)
        predicted_class = torch.argmax(probabilities, dim=-1).item()

        # print confidence level
        phishing_prob = probabilities[0][1].item()  # Confidence level for phishing
        legit_prob = probabilities[0][0].item()  # Confidence level for legitimate

        # Store classification result
        if predicted_class == 1:
            results[item] = {
                "classification": "Phishing",
                "confidence": f"{phishing_prob:.2%}"
            }
        else:
            results[item] = {
                "classification": "Legitimate",
                "confidence": f"{legit_prob:.2%}"
            }

    return results
    
    
# EXAMPLE USAGE
input = "please send me your password here: https://phishing.com my backup email is oyingfang@gmail.com connect to the server at 100.42.65.230 visit us at https://spectrum.um.edu.my/"
results = is_phishing(input)
print(results)