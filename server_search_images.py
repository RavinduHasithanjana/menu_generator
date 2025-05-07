from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from duckduckgo_search import DDGS

app = FastAPI()

# curl -X GET 'http://localhost:3007/search/images?keywords=artificial+intelligence'


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ddgs = DDGS()

@app.get("/search/images")
async def search_images(keywords: str):
    results = ddgs.images(keywords)
    return {"results": results}