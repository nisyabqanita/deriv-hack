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
def detect_malicious_activity(new_message):
    add_message("user", new_message)

    message = claude_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system="You are a chatbot that detects fraudulent user behavior. You will analyse the message and only flag if you detect malicious activity.",
        messages=chat_history,
        temperature=0.2,
    )

    reply = message.content[0].text
    add_message("assistant", reply)
    
    return reply

# Test the function
print(detect_malicious_activity("Hello, you clicked on my ad, are you interested."))
print(detect_malicious_activity("Yes, I am interested.")) 
print(detect_malicious_activity("Can I make a payment outside the platform?"))