import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const gptUrl = "https://chatgpt-42.p.rapidapi.com/texttoimage3"; // ✅ Correct new endpoint
  const gptHost = "chatgpt-42.p.rapidapi.com"; // ✅ Host header must match

  if (!gptApiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const { prompt } = req.body;

    const apiRes = await fetch(gptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": gptApiKey.trim(),
        "x-rapidapi-host": gptHost,
      },
      body: JSON.stringify({
        text: prompt,
        width: 512,
        height: 512,
        steps: 1, // ✅ required for this version of the endpoint
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.log("❌ API Error:", errorText);
      throw new Error("Failed to generate image");
    }

    const data = await apiRes.json();

    return res.status(200).json({
      message: data?.generated_image || "https://via.placeholder.com/600x400?text=No+Image",
    });
  } catch (error) {
    console.error("⚠️ Server Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
