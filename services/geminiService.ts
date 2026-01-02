
import { GoogleGenAI, Type } from "@google/genai";
import { Paper } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzePaper = async (text: string, imageData?: string): Promise<Partial<Paper>> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    请分析以下研究论文的详细信息。请务必使用简体中文回答所有字段。
    1. 如果没有明确的标题，请提供一个专业的中文标题。
    2. 提取或建议作者姓名。
    3. 将其归入以下类别之一：人工智能/机器学习, 生物学, 物理学, 医学, 社会科学, 工程学, 数学, 或 人文学科。
    4. 生成 3-5 个相关的中文标签。
    5. 用两句话简明扼要地总结其核心贡献。
    
    数据内容: ${text}
  `;

  const contents: any[] = [{ text: prompt }];
  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          authors: { type: Type.STRING },
          category: { type: Type.STRING },
          tags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          aiSummary: { type: Type.STRING }
        },
        required: ["title", "category", "tags", "aiSummary"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
