# This module analyses the chat history between the buyer and seller to detect any malicious activity
'''
Features:
- Detects malicious activity in the chat history using sentiment analysis
- Browse through known malicious and fraud chat patterns and compare them with the chat history
- If malicious activity is detected, the chat is flagged

To-do:
- normalize chat history
'''

### Get the latest chat 
# Pass the latest chat to the sentiment analysis model


import os
from dotenv import load_dotenv
import anthropic

load_dotenv()

# Using claude for rolling chat context analysis
claude_key = os.getenv("CLAUDE_API_KEY")
if not claude_key:
    raise ValueError(
        "API Key not found. Make sure you have set CLAUDE_API_KEY in your .env file."
    )
claude_client = anthropic.Anthropic(api_key=claude_key)

chat_history = []

# Maintains a rolling window of last 10 messages
def add_message(role, content):
    chat_history.append({"role": role, "content": content}) # To retrive from database
    
    if len(chat_history) > 10:
        chat_history.pop(0) # remove the oldest non-system message

# Send chat history along with the latest message to claude
def live_detect_malicious_activity(new_message):
    add_message("user", new_message)

    message = claude_client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1024,
        system="You are a chatbot that detects fraudulent user behavior. You will analyse the message and only flag if you detect malicious activity. give output in dictionary format, for example {'flag': True, 'reason': 'phishing'}",
        messages=chat_history,
        temperature=0.2,
    )

    reply = message.content[0].text
    
    return reply

import json
# Analyse the overall chat history for report generation
def analyse_chat_history(chat_history):
    # Read the md file
    with open("backend/prompts/suspicious_chat.md", "r", encoding="utf-8") as file:
        prompt = file.read()

    message = claude_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system=prompt,
        messages=chat_history,
        temperature=0.2,
    )

    # print(message.content[0].text)

    try:
        raw_text = message.content[0].text
        cleaned_text = raw_text.split("<<<end of human interaction>>>")[0].strip()
        response_json = json.loads(cleaned_text)
        return response_json  # Returns a dictionary
    except json.JSONDecodeError:
        raise ValueError("Failed to decode response JSON from Claude API.")

    # return message.content[0].text


# Test the function
print(live_detect_malicious_activity("Hi! I want to buy $200 USDT from you. Is it still available?"))
# print(live_detect_malicious_activity("Yes, it’s available. You can send the payment using the listed method")) 
# print(live_detect_malicious_activity("Great! I’ll send via bank transfer (instant). What’s your account number?"))
# print(live_detect_malicious_activity("Great! I’ll send via bank transfer (instant). What’s your account number?"))
# print(live_detect_malicious_activity("Please follow the instructions on Deriv P2P. The platform will show my bank details after you initiate the order."))
# print(live_detect_malicious_activity("Oh, my Deriv app is lagging! Can you send me your bank details here instead? I’ll transfer manually."))
# print(live_detect_malicious_activity("I just sent the $200 USDT. Please check your account! ✅"))
# print(live_detect_malicious_activity("I haven’t received anything yet. Can you send a screenshot of the transaction?"))
# print(live_detect_malicious_activity("Here’s the proof. The money should reflect soon. Please release the USDT now."))
# print(live_detect_malicious_activity("Let me verify with my bank first. I won’t release the USDT until I confirm the funds."))
# print(live_detect_malicious_activity("I already sent it! Maybe your bank is slow. Just release the crypto so we don’t waste time."))
# print(live_detect_malicious_activity("Sorry, I can’t. If it’s a real transaction, I’ll see it in my account."))
# print(live_detect_malicious_activity("Why are you delaying? I need this urgently."))
# print(live_detect_malicious_activity("If you don’t release the USDT, I will report you to Deriv for scamming buyers."))
# print(live_detect_malicious_activity("I follow the platform’s rules. If your payment is real, I’ll see it in my bank."))
# print(live_detect_malicious_activity("Fine! I’ll cancel the order. But you wasted my time."))
# print(live_detect_malicious_activity("Okay"))

# print(analyse_chat_history())

'''
Example output:
This appears to be a normal transaction inquiry. No malicious activity detected.
This appears to be a normal transaction response. No malicious activity detected.
This appears to be a normal transaction inquiry. No malicious activity detected.
This appears to be a normal transaction inquiry. No malicious activity detected.
This appears to be a normal instruction directing to a legitimate P2P platform. No malicious activity detected.
Potential malicious activity detected
Potential malicious activity detected
Potential malicious activity detected
Potential malicious activity detected
This appears to be a legitimate safety precaution from a user. No malicious activity detected.
Potential malicious activity detected
This appears to be a legitimate cautious response. No malicious activity detected.
Potential malicious activity detected
Potential malicious activity detected
This appears to be a legitimate cautious response. No malicious activity detected.
This appears to be a frustrated but non-malicious response. No malicious activity detected.
This appears to be a simple acknowledgment. No malicious activity detected.


However, reviewing the full conversation thread, there are some concerning patterns that warrant a security report: 

SECURITY ANALYSIS REPORT:

Red Flags Detected:
1. Urgency/pressure tactics ("Why are you delaying? I need this urgently")
2. Threats ("I will report you to Deriv for scamming")
3. References to USDT (cryptocurrency) transfers
4. Pattern suggests possible crypto/financial scam attempt

Recommendation:
- Flag conversation for review
- Monitor for additional suspicious patterns
- Possible scam attempt using common tactics: urgency, threats, and cryptocurrency

Risk Level: Medium
Further investigation recommended to determine if this is part of a larger pattern of suspicious activity.
'''
