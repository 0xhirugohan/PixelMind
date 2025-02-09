import { HumanMessage } from "@langchain/core/messages";
import OpenAI from "openai";

export async function describeImage(
    openai: OpenAI,
    imageUrls: string[],
): Promise<string> {
    try {
        const images: any[] =
            imageUrls.map((url) => {
                return {
                    type: "image_url",
                    image_url: {
                        url: url,
                    },
                };
            }) || [];
        const prompt =
            "You are an artist. You see an artwork based on its style, its value, the message it conveys to audience. You see artwork and you decide to explain it in a way so someone can use your explanation to draw exactly like the image shown to you. How are these images style has in similar? What kind of object and vibes they are giving of? Explain it no more than 800 characters! Focus describing on the art style of the digital artwork. Desribe the way its being draw. Describe the brush type being used. Describe the way how the painting styled. Describe the color being used.";
        const content: any[] = [
            {
                type: "text",
                text: prompt,
            },
            ...images,
        ];
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
        });

        const result: string[] = [];
        for (const choice of response.choices) {
            result.push(choice?.message?.content || "");
        }
        return result.join(". ");
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        return "error: unknown error";
    }
}

export async function generateImage(
    openai: OpenAI,
    artStyleDescription: string,
    drawingPrompt: string,
): Promise<string> {
    try {
        const explanationPrompt = artStyleDescription;
        const prompt = `You are an artist. You draw an artwork based on its style, its value, the message it conveys to audience. You learn and understand from an art explanation to draw exactly like the explanation described. You learn from the image style similarity given to you. You learn the similar object being drawn to you with minor changes you can do. You draw exactly like the vibes explained to you. Your artwork only contains illustration. Your artwork contains no text. Now draw a <drawing>${drawingPrompt}</drawing> based on explanation below. <style>${explanationPrompt}</style>. Inside <drawing> is the requested drawing pose, object, and vibes. But you have to obey the style inside <style></style> instruction. Your artwork follow to the style strictly including the vibes, colors, and brush style explained to you. You have to follow exactly the style instruction is given to you. No style alteration.`;
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        });
        return response?.data[0]?.url || "";
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        return "error: unknown error";
    }
}
