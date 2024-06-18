## Getting Started


# Get Docker Image and Serve 

get the docker image
`docker pull norbertaberor/creative_open_voice:tts_api`

run the it
`docker run -d --name my_fastapi_container -p 8000:8000 open-voice-app`

the image would be running here
`http://localhost:8000/generate`


# Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


Open [http://localhost:3000/text-to-speech](http://localhost:3000/text-to-speech) with your browser to interact with the text to speech app.



