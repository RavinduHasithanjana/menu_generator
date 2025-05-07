import os
import requests

PROPLEXITY_API_KEY=os.environ.get('PROPLEXITY_API_KEY')
print(PROPLEXITY_API_KEY)

url = "https://api.perplexity.ai/chat/completions"

payload = {
    "model": "sonar",
    "messages": [
        {
            "role": "system",
            "content": "Be precise and concise."
        },
        {
            "role": "user",
            "content": "How many stars are there in our galaxy?"
        }
    ],
    "max_tokens": 123,
    "temperature": 0.2,
    "top_p": 0.9,
    "search_domain_filter": ["<any>"],
    "return_images": False,
    "return_related_questions": False,
    #"search_recency_filter": "<string>",
    "top_k": 0,
    "stream": False,
    "presence_penalty": 0,
    "frequency_penalty": 1,
    #"response_format": {},
    "web_search_options": {"search_context_size": "high"}
}
headers = {
    "Authorization": f"Bearer {PROPLEXITY_API_KEY}",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)

print(response.text)