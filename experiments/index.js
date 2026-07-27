import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

// Initialize with a progress callback
const initProgressCallback = (progress) => {
    console.log("Model loading progress:", progress);
};

// Using CreateMLCEngine
const engine = await CreateMLCEngine("Llama-3.1-8B-Instruct-q4f16_1-MLC", { initProgressCallback });

// Direct instantiation
// const engineInstance = new MLCEngine({ initProgressCallback });
// await engineInstance.reload("Llama-3.1-8B-Instruct-q4f16_1-MLC");
const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "Hello!" },
]

// chunks is an AsyncGenerator object
const chunks = await engine.chat.completions.create({
    messages,
    temperature: 1,
    stream: true, // <-- Enable streaming
    stream_options: { include_usage: true },
});

let reply = "";
for await (const chunk of chunks) {
    reply += chunk.choices[0]?.delta.content || "";
    console.log(reply);
    if (chunk.usage) {
        console.log(chunk.usage); // only last chunk has usage
    }
}

const fullReply = await engine.getMessage();
console.log(fullReply);