# This module is used to validate the authenticity of the transaction documents using AI
"""
Features:
- Accept high resolution images of the transaction documents
- Inspection of the documents for any signs of tampering or forgery
- Uses image processing techniques to make tampering or forgery evident
- Determines if the sum of the transaction documents is accurate

To-do:
- Prompt engineering for better POT fraud detection //
- To compare claude json with database values
- Make it deterministic by using a scoring system
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

gpt_client = OpenAI(api_key=openai_key)


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

    # Read the md file
    with open("backend/POT_gpt_prompt.md", "r", encoding="utf-8") as file:
        prompt = file.read()

    response = gpt_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": prompt,
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            },
        ],
        max_tokens=300,
    )

    return response.choices[0].message.content 


# Claude to compare the sum of the transaction documents
claude_key = os.getenv("CLAUDE_API_KEY")
if not claude_key:
    raise ValueError(
        "API Key not found. Make sure you have set CLAUDE_API_KEY in your .env file."
    )
claude_client = anthropic.Anthropic(api_key=claude_key)


def call_claude_api(image_path):
    # To remove and replace with SQL call
    base64_image = encode_image(image_path)

    # Read the md file
    with open("backend/Claude_OCR_prompt.md", "r", encoding="utf-8") as file:
        prompt = file.read()

    message = claude_client.messages.create(
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
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )

    return message.content[0].text


# Example usage
image_path = "backend/tng_detailed.jpg"
gpt_response = call_openai_api(image_path)
print(gpt_response)

claude_response = call_claude_api(image_path)
print(claude_response)
