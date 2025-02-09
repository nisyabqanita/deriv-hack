# Compare all the available information and make a decision.
'''
Output: Refund the seller, Refund the buyer, Escalate to the dispute resolution team
'''

import os
import json
from dotenv import load_dotenv
import malicious_text_analyser as mta
import fraudalent_POT_analyser as fpa
import user_risk_rating as risk
import anthropic

load_dotenv()

claude_key = os.getenv("CLAUDE_API_KEY")
if not claude_key:
    raise ValueError(
        "API Key not found. Make sure you have set CLAUDE_API_KEY in your .env file."
    )
claude_client = anthropic.Anthropic(api_key=claude_key)

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

def get_chat_history(username):
    chat_histories = load_chat_histories()

    user_chats = [
        chat
        for chat in chat_histories
        if chat["buyer_username"] == username or chat["seller_username"] == username
    ]

    return user_chats if user_chats else f"No chat history found for user '{username}'."


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


def get_usernames_by_ad_id(advertisement_id):
    with open(user_chat_history_json, "r", encoding="utf-8") as file:
        chat_histories = json.load(file)

    for chat in chat_histories:
        if chat["advertisement_id"] == advertisement_id:
            return chat["buyer_username"], chat["seller_username"]
        

def dispute_resolution(advertisement_id):
    usernames = get_usernames_by_ad_id(advertisement_id)
    buyer, seller = usernames[0], usernames[1]

    # buyer_risk = risk.calculate_risk_profile(buyer)
    # print(buyer_risk)

    seller_risk = risk.calculate_risk_profile(seller)
    print(seller_risk)

search_ad_id = "AD12345"
usernames = get_usernames_by_ad_id(search_ad_id)
print(usernames)

# search_ad_id = "AD12345"
# dispute_resolution(search_ad_id)
