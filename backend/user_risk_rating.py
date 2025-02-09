# User risk rating module is used to calculate the risk rating of the user based on the
# chat history, the transaction documents, transaction history, user profile, and others

"""
Factors:
- Chat history risk report
- Transaction documents analysis
- Transaction history analysis
- User country
- User account lifetime
- User account activity
- Number of successful transactions
- Number of failed transactions
- User account verification status
- User account activity

Weightage:
- User background risk score: 20%
- Chat history risk report: 50%
- Transaction documents analysis: 30%
"""

import phishing_bert as pb
import fraudalent_POT_analyser as fpa
import malicious_text_analyser as mta
import json
import ast
import os

# risk weightage
WEIGHTS = {
    "user_background_risk_score": 0.3,
    "chat_history_risk_report": 0.7,
    # "transaction_documents_analysis": 0.3,
}

HIGH_RISK_COUNTRIES = [
    "Nigeria",
    "Russia",
    "China",
    "Pakistan",
    "India",
    "Ukraine",
    "Brazil",
    "South Africa",
]

FRAUD_SEVERITY = {
    "Scam tactics": 50,
    "Payment fraud": 30,
    "Suspicious activity": 20,
    "Policy violation": 10,
}

user_profile_json = "backend/users_dummy_data.json"
user_chat_history_json = "backend/chat_histories.json"


def load_profiles():
    if not os.path.exists(user_profile_json):
        raise FileNotFoundError("Profiles file not found.")

    with open(user_profile_json, "r", encoding="utf-8") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            raise ValueError("Error reading JSON file. The file may be corrupted.")


def get_profiles(username=None):
    profiles = load_profiles()
    if username:
        result = [profile for profile in profiles if profile["username"] == username]
        return result if result else f"User '{username}' not found."

    return profiles


def load_chat_histories():
    """Load chat history from the JSON file."""
    if not os.path.exists(user_chat_history_json):
        raise FileNotFoundError("Chat history file not found.")

    with open(user_chat_history_json, "r", encoding="utf-8") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            raise ValueError(
                "Error reading chat history file. The file may be corrupted."
            )


def get_chat_history(username):
    chat_histories = load_chat_histories()

    user_chats = [
        chat
        for chat in chat_histories
        if chat["buyer_username"] == username or chat["seller_username"] == username
    ]

    return user_chats if user_chats else f"No chat history found for user '{username}'."


def calculate_user_background_risk(user):
    """Calculate user background risk based on country, account lifetime, trade history, and verification."""
    risk_score = 0

    # Country risk factor
    if user["country_of_origin"] in HIGH_RISK_COUNTRIES:
        risk_score += 40  # Higher risk for flagged countries

    # Account lifetime risk (shorter = riskier)
    if user["account_lifetime"] < 3:
        risk_score += 30
    elif user["account_lifetime"] < 6:
        risk_score += 15

    # Trade success ratio (more failed trades = higher risk)
    total_trades = user["successful_trade"] + user["unsuccessful_trade"]
    if total_trades > 0:
        failure_ratio = user["unsuccessful_trade"] / total_trades
        risk_score += failure_ratio * 30  # Max 30 points if failure ratio is 100%

    # Verification status (Unverified = riskier)
    if user["verification_status"] == "Unverified":
        risk_score += 30

    return min(risk_score, 100)  # Ensure max is 100


def calculate_chat_history_risk(username):
    """Calculate the risk score based on the chat history."""
    risk_score = 0

    chat_history = get_chat_history(username)
    user_chats = [chat for chat in chat_history if chat["buyer_username"] == username or chat["seller_username"] == username]

    chat_messages = []
    for chat in user_chats:
        for message in chat["chat_history"]:
            chat_messages.append({"role": "user" if message["sender"] == username else "assistant", "content": message["message"]})

    
    response_data = mta.analyse_chat_history(chat_messages)
    # response_str = response_str.replace("'", '"')
    # print(response_data)

    # Convert the string to a Python dictionary
    # response_data = json.loads(response_str)

    # Extract flagged activity list
    flagged_data = response_data.get('flagged_activity', [])

    # Loop through flagged data
    for flag in flagged_data:
        fraud_type = flag.get("fraud_type", "Unknown")
        risk_score += FRAUD_SEVERITY.get(fraud_type, 10)  # Default risk for unknown fraud types

    return min(risk_score, 100)  # Scale risk max to 100

    
def calculate_risk_profile(username):
    """Calculate total risk score for a given user."""
    # Load user profiles
    if not os.path.exists(user_profile_json):
        raise FileNotFoundError("Profiles file not found.")
    
    with open(user_profile_json, "r", encoding="utf-8") as file:
        users = json.load(file)
    
    user = next((u for u in users if u["username"] == username), None)
    if not user:
        return f"User '{username}' not found."

    # Calculate user background risk
    background_risk = calculate_user_background_risk(user)

    # Calculate chat and transaction risks
    chat_risk = calculate_chat_history_risk(username)

    # Final risk score (weighted sum)
    total_risk = (
        (background_risk * WEIGHTS["user_background_risk_score"]) +
        (chat_risk * WEIGHTS["chat_history_risk_report"])
    )

    return {
        "username": username,
        "user_background_risk_score": round(background_risk, 2),
        "chat_history_risk_report": round(chat_risk, 2),
        "total_risk": round(total_risk, 2)
    }

# Example usage
# all_profiles = get_profiles()
# print(all_profiles)

# profile = get_profiles("CryptoGhost99")
# print(profile)

# history = get_chat_history("CryptoGhost99")
# print(history)

# risk_profile = calculate_risk_profile("CryptoGhost99")
# print(risk_profile)

# Output
'''
{'username': 'CryptoGhost99', 'user_background_risk_score': 100, 'chat_history_risk_report': 70, 'total_risk': 79.0}
'''
