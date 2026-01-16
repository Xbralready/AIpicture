import type { AnalysisResult, GenerationResult } from '../types';

// 后端 API 地址，生产环境使用环境变量配置
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

/**
 * [STEP 1] 产品分析 (GPT-4o, image → text)
 * 输出：英文「不可变产品描述」
 */
async function analyzeProduct(productImageBase64: string): Promise<string> {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'system',
          content: `You are a professional commercial product analyst.

Your task is to analyze the uploaded product image and produce an extremely precise and factual English description of the product for image generation.

IMPORTANT REQUIREMENTS:
- First, identify the product category based solely on what is visible in the image.
- Describe the product in a neutral, objective manner.
- Color must be extremely precise and specific (avoid generic terms like "brown" or "dark").
- Material must be precisely identified (e.g. smooth matte technical fabric, full-grain leather, molded plastic).
- Product style and category must be exact.
- All visible structural details must be described (closure, pockets, shape, proportions, surface finish, etc.).
- Do NOT infer or invent unseen details.
- Do NOT add styling, background, lighting, or atmosphere descriptions.

OUTPUT RULES:
- Output only the final English product description.
- Do not include explanations, bullet points, or labels.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: productImageBase64 },
            },
          ],
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || '产品分析失败');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * [STEP 2] 爆款参考图风格分析
 *
 * 核心原则：只提取"视觉表达方式"，绝不提取产品信息
 * 爆款融合 = 用爆款图的"拍法"，重新拍你的产品
 */
async function analyzeReferenceStyle(referenceImageBase64: string): Promise<string> {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'system',
          content: `You are a commercial photography style analyst.

Your task is to analyze the reference image and extract ONLY visual expression attributes
that can be safely transferred to another product image.

IMPORTANT RULES:
- Do NOT describe or infer the product itself.
- Do NOT describe product shape, structure, materials, or details.
- Focus ONLY on visual presentation style.

Extract and describe ONLY the following aspects:
- Lighting style (light direction, softness, contrast, shadow characteristics)
- Composition (camera angle, framing, balance, spacing, subject position)
- Background style (color, material, texture, simplicity, atmosphere elements like smoke or fog)
- Overall mood and atmosphere (e.g. premium, minimal, outdoor, urban, dramatic, elegant)
- Color grading and post-processing style (warm/cool tones, contrast level, vignette, grain)

OUTPUT RULES:
- Output in concise English phrases or short sentences.
- Do NOT mention the product category or product features.
- Do NOT include explanations or headings.
- Keep the description focused and actionable for image generation.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: referenceImageBase64 },
            },
          ],
        },
      ],
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || '参考图分析失败');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * 爆款融合分析 - 三步架构
 *
 * 核心定义：爆款融合 = 用爆款图的"拍法"，重新拍你的产品
 * - 爆款参考图：只允许融合 光影、构图、情绪、背景风格
 * - 产品图：产品本身的一切事实属性，绝对不可被改变
 */
export async function analyzeAndSuggest(
  referenceImageBase64: string,
  productImageBase64: string
): Promise<AnalysisResult> {
  // [STEP 1] 分析「我的产品」- 不可变事实
  const productDescription = await analyzeProduct(productImageBase64);
  console.log('[STEP 1] 产品精确描述:', productDescription);

  // [STEP 2] 分析「爆款参考图」- 只提取视觉表达方式
  const referenceStyle = await analyzeReferenceStyle(referenceImageBase64);
  console.log('[STEP 2] 参考图风格:', referenceStyle);

  // [STEP 3] 构建融合生成 Prompt
  const generationPrompt = `[STYLE REFERENCE — VISUAL EXPRESSION ONLY]
Apply the following visual presentation style extracted from the reference image:
${referenceStyle}

---

[PRODUCT CONSTRAINTS — IMMUTABLE]
Product details (must be accurately represented):
${productDescription}

---

[STRICT FUSION RULES]
- The product's category, structure, silhouette, material, color, and all details must exactly match the product description.
- The reference image must influence ONLY lighting, composition, background, and overall mood.
- Do NOT apply any product features, shapes, proportions, or materials from the reference image.
- If any conflict occurs, the product description must be followed and the reference style ignored.`;

  console.log('[STEP 3] 生成 Prompt:', generationPrompt);

  // 返回简化的分析结果
  return {
    reference: {
      scene_type: 'Style Reference',
      visual_style: referenceStyle,
      mood: [],
      color_palette: { dominant_colors: [], contrast: '', saturation: '' },
      subject: { type: '', gender: '', pose: '', expression: '', accessories: [] },
      clothing: { details: [] },
      lighting: { type: '', direction: '', intensity: '', shadow: '' },
      background: { type: '', color: '', atmosphere: '' },
      composition: { framing: '', camera_angle: '', depth_of_field: '' },
      style_keywords: [],
    },
    product: {
      category: '',
      type: '',
      exact_color: '',
      color_english: '',
      material: '',
      material_english: '',
      closure_type: '',
      collar_style: '',
      pocket_style: '',
      length: '',
      fit: '',
      key_details: [],
      target_gender: '',
    },
    fusion: {
      visual_dna_preserved: {
        lighting: '',
        composition: '',
        atmosphere: '',
        post_processing: '',
        accessories: '',
        mood: '',
      },
      product_replacement: {
        original_product: '(参考图产品 - 不参与融合)',
        new_product: productDescription,
        cascading_effects: [],
      },
      subject_adaptation: {
        original_gender: '',
        target_gender: '',
        body_adaptations: [],
      },
      style_keywords_adaptation: {
        preserved_keywords: [],
        adapted_keywords: [],
      },
      notes: [
        '爆款融合模式下，参考图只提供"摄影与视觉表达信息"',
        '任何来自参考图的产品结构、材质、比例信息都被视为非法',
      ],
      generation_prompt: generationPrompt,
    },
    productDescription,
    referenceStyle,
  };
}

/**
 * [STEP 2] 图生图：根据产品图和用户 Prompt 生成新图片
 *
 * 架构说明：
 * - 用户 prompt 是「风格语言」，控制"如何拍"
 * - 产品描述是「约束语言」，锁定"拍什么"
 * - 产品图作为 image input，确保产品准确性
 */
export async function generateFromProductWithPrompt(
  productImageBase64: string,
  userPrompt: string
): Promise<GenerationResult> {
  // STEP 1：分析产品图，获取英文「不可变产品描述」
  const productDescription = await analyzeProduct(productImageBase64);
  console.log('产品精确描述:', productDescription);

  // STEP 2：构建结构化生成 Prompt
  const fullPrompt = `[STYLE & MARKETING CONTEXT]
${userPrompt}

---

[PRODUCT CONSTRAINTS — IMMUTABLE]
Product details (must be accurately represented):
${productDescription}

---

[STRICT GENERATION RULES]
- The product's structure, silhouette, color, material, and all details must exactly match the description above.
- These product attributes are locked and must not be altered under any circumstances.
- Styling, background, lighting, and mood may follow the style context, but must not conflict with product accuracy.
- Do not simplify, exaggerate, or reinterpret the product.`;

  // STEP 3：生成图片
  return generateImageFromPrompt(fullPrompt);
}

/**
 * 图生图模式的图片生成
 * 注意：gpt-image-1 的 /images/generations 不支持 image 参数
 * 依赖详细的产品描述来确保生成准确性
 */
async function generateImageFromPrompt(
  prompt: string
): Promise<GenerationResult> {
  const imageResponse = await fetch(`${API_BASE}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: prompt,
      n: 1,
      size: '1024x1536',
      quality: 'high',
    }),
  });

  if (!imageResponse.ok) {
    const error = await imageResponse.json();
    const errorMsg = error.error?.message || '图片生成失败';
    throw new Error(`${errorMsg}\n\n【提示词】:\n${prompt}`);
  }

  const imageData = await imageResponse.json();
  const b64 = imageData.data[0]?.b64_json;
  const imageUrl = b64 ? `data:image/png;base64,${b64}` : (imageData.data[0]?.url || '');

  return {
    imageUrl,
    revisedPrompt: prompt,
  };
}

/**
 * 根据融合建议生成图片
 */
export async function generateImage(prompt: string): Promise<GenerationResult> {
  // 检查提示词是否有效
  if (!prompt || prompt.length < 50) {
    throw new Error('提示词无效，请重新分析');
  }

  // 使用 gpt-image-1 生成
  const imageResponse = await fetch(`${API_BASE}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: prompt,
      n: 1,
      size: '1024x1536',
      quality: 'high',
    }),
  });

  if (!imageResponse.ok) {
    const error = await imageResponse.json();
    const errorMsg = error.error?.message || '图片生成失败';
    throw new Error(`${errorMsg}\n\n【提示词】:\n${prompt}`);
  }

  const imageData = await imageResponse.json();

  // gpt-image-1 返回 base64 格式
  const b64 = imageData.data[0]?.b64_json;
  const imageUrl = b64 ? `data:image/png;base64,${b64}` : (imageData.data[0]?.url || '');

  return {
    imageUrl,
    revisedPrompt: prompt, // gpt-image-1 不返回 revised_prompt
  };
}
