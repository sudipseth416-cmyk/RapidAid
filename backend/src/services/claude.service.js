import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

let client;

function getClient() {
  if (!env.anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  if (!client) {
    client = new Anthropic({ apiKey: env.anthropicApiKey });
  }
  return client;
}

export function buildFirstAidPrompt({ emergencyType, vitals, patientContext }) {
  return `You are RapidAid's emergency first-aid assistant for India. Provide clear, step-by-step first-aid instructions.

Emergency type: ${emergencyType ?? "Unknown"}
Patient context: ${patientContext ?? "Not provided"}
Vitals: ${JSON.stringify(vitals ?? {})}

Respond with numbered steps. Be concise and actionable. Include when to perform CPR if relevant. Mention calling 112/108 if situation worsens. Use simple language; Hindi terms in parentheses where helpful.`;
}

export async function streamFirstAidInstructions({ emergencyType, vitals, patientContext, onChunk, onDone, onError }) {
  const anthropic = getClient();
  const prompt = buildFirstAidPrompt({ emergencyType, vitals, patientContext });

  try {
    const stream = await anthropic.messages.stream({
      model: env.claudeModel,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        onChunk(event.delta.text);
      }
    }
    onDone();
  } catch (err) {
    onError(err);
  }
}

export async function getFirstAidInstructionsNonStreaming(params) {
  const anthropic = getClient();
  const prompt = buildFirstAidPrompt(params);
  const message = await anthropic.messages.create({
    model: env.claudeModel,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  const block = message.content.find((b) => b.type === "text");
  return block?.text ?? "";
}
