from duckduckgo_search import DDGS

ddgs = DDGS()
keywords = "artificial intelligence"
results = ddgs.images(keywords)

for r in results:
    print(r)