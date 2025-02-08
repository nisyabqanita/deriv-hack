# This module is used to validate the authenticity of the transaction documents using AI
"""
Features:
- Accept high resolution images of the transaction documents
- Inspection of the documents for any signs of tampering or forgery
- Uses image processing techniques to make tampering or forgery evident
- Determines if the sum of the transaction documents is accurate

To-do:
- Prompt engineering for better POT fraud detection
"""

import os
import base64
import anthropic
from openai import OpenAI
from dotenv import load_dotenv
from transformers import AutoModel, AutoTokenizer

load_dotenv()
openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise ValueError(
        "API Key not found. Make sure you have set OPENAI_API_KEY in your .env file."
    )

client = OpenAI(api_key=openai_key)


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Function to decode the image
def decode_image(image_path):
    base64_image = encode_image(image_path)
    return base64_image


# Function to call the OpenAI API
def call_openai_api(image_path):
    # To remove and replace with SQL call
    base64_image = encode_image(image_path)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You will validate the authenticity of the transaction documents.",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What is in this image?",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            },
        ],
        max_tokens=300,
    )

    return response.choices[0]


# Claude to compare the sum of the transaction documents
claude_key = os.getenv("CLAUDE_API_KEY")
if not claude_key:
    raise ValueError(
        "API Key not found. Make sure you have set CLAUDE_API_KEY in your .env file."
    )
client = anthropic.Anthropic(api_key=claude_key)


def call_claude_api(image_path):
    # To remove and replace with SQL call
    base64_image = encode_image(image_path)
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": base64_image,
                        },
                    },
                    {"type": "text", "text": "Return text in this image"},
                ],
            }
        ],
    )

    return message.content[0].text


# Example usage
image_path = "backend\Bank_Statement.jpg"
# response = call_openai_api(image_path)
# print(response)

response = call_claude_api(image_path)
print(response)
