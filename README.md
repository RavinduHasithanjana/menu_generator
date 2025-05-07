# Getting Started

## Bash

```bash
cp .env.example .env
```

Edit `.env` file and enter your API keys and JS server public URL:

## Makefile

```makefile
OPENAI_API_KEY=
GOOGLE_API_KEY=
CEREBRAS_API_KEY=
GROQ_API_KEY=
PROPLEXITY_API_KEY=
JS_SERVER_URL=http://...
```

## Run the services

## Bash

```bash
npm i
# create python environment and install packages 
pip install -r req.txt
```

```bash
node server.js
pm2 start server.js
uvicorn server_search_images:app --reload --host 0.0.0.0 --port 3007
nohup uvicorn server_search_images:app --reload --host 0.0.0.0 --port 3007 &
cd view/ && npm i && pm2 start npm -- start
```

# API Endpoints

## Main Server (http://localhost:3005/)

* **Generate**: `POST /gen`
    * Request Body: `{ dishName, styleName, language, model, userPrompt, styleList, categoryList }`
* **Get Info**: `GET /get_info`
    * Response: `{ styleList, categoryList, modelList }`
* **Image Recognition**: `GET /image_recognition_url/:url`
    * Response: `{ url, modelAnswer }`
* **Upload Image**: `POST /api/upload-image`

## Search API (http://localhost:3007/)

* **Search Images**: `GET /search/images`
    * Query Param: `keywords`

# Commands

## Start services

## Bash

```bash
pm2 start server.js
pm2 start npm -- start
nohup uvicorn server_search_images:app --reload --host 0.0.0.0 --port 3007 &
```

## Stop services

## Bash

```bash
sudo fuser -k 3007/tcp
pm2 delete server.js
pm2 delete npm -- start
```

# Ngrok Service

## Start Ngrok 

(openai may has require domain name and https:// for loading image files, use pm2 logs -f server.js for track errors)

## Bash

```bash
screen -d -m ngrok http 3005
```

## Stop Ngrok

## Bash

```bash
screen -S ngrok -X quit
pkill -f ngrok
```

# Troubleshooting

## Bash

```bash
pm2 logs -f server.js
```

# Customization

## Add a new model

1.  `utils/settings.js`: Add the model to the lists in the correct order and add the API key in the same order.
2.  `gen.js`: Add a case for the new model name.

## Edit prompts

* Go to `data/prompts` and add or edit files. The prompts are used in `gen.js` in the `selectSystemPrompt` method.

## Edit default lists of styles and categories

* Go to `data/itemStructure.js` or pass the lists through the API. (Consider refactoring to a database for more flexibility)

```js
const inputFormat={"DishName": "Ginger Ale", "language": "English"}

const inputFormatStyle={
  "DishName": "Pizza della casa",
  "RestaurantStyle": "Michelin starred",
  "language": "English"
}

const categoryList=(`Antipasto
Pasta
Verdure
Side
```