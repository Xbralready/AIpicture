import type { AnalysisResult, GenerationResult } from '../types';

// 后端 API 地址，生产环境使用环境变量配置
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

/**
 * 单独分析产品图，获取极其精确的产品描述
 */
async function analyzeProduct(productImageBase64: string): Promise<string> {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一位专业的服装产品分析师。你的任务是用英文极其精确地描述这件服装产品。

【重要】你的描述将直接用于图片生成，所以必须：
1. 颜色必须精确（不是 brown，而是具体的 taupe/mushroom/grayish-brown/cognac 等）
2. 材质必须精确（不是 fabric，而是 smooth matte cotton canvas/technical fabric/wool blend 等）
3. 款式必须精确（field jacket/chore coat/bomber/blazer 等）
4. 所有细节都要描述（领子材质颜色、闭合方式、口袋位置和样式、袖口细节、衣长等）

只输出英文产品描述，不要任何其他内容。格式如下：
[garment type] in [exact color], made of [exact material], featuring [collar details], [closure type], [pocket details], [length], [other distinctive features]`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请用英文精确描述这件服装产品的所有细节。',
            },
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
 * 同时分析爆款素材和产品图，输出融合建议
 */
export async function analyzeAndSuggest(
  referenceImageBase64: string,
  productImageBase64: string
): Promise<AnalysisResult> {
  // 先单独分析产品，获取精确描述
  const productDescription = await analyzeProduct(productImageBase64);
  console.log('产品精确描述:', productDescription);

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一位顶级视觉导演和营销专家。用户会同时上传两张图片：
1. 第一张是「爆款参考素材」- 一张成功的营销图片
2. 第二张是「产品图」- 用户想要推广的产品（可以是服装、配饰、电子产品、家居用品等任何商品）

【核心理解】：
你要做的不是简单的文字替换，而是「语义级别的风格迁移」：
- 爆款图的 JSON 分析是「语义蓝图」
- 80-90% 的视觉DNA要完全保留
- 只有「产品相关字段」需要智能替换
- 替换时要考虑「级联影响」

【100% 保留的视觉DNA】（绝对不能改变）：
- 灯光逻辑（方向、强度、阴影行为）
- 构图（取景、机位、景深、视觉流向）
- 后期风格（暗角、雾化、颗粒、色调）
- 情绪叙事（神秘感、力量感、氛围）
- 背景环境（颜色、渐变、氛围元素如烟雾）
- 配饰（墨镜、手套、首饰等全部保留）

【需要智能替换的产品变量】：
- 主体性别/类型（如果产品目标受众不同）
- 产品本身（服装/配饰/物品）
- 风格关键词（需要适配产品属性）

【级联影响思考】（这是关键！）：
当产品从A变成B时，不是简单替换文字，而要思考：
- 材质变化：毛绒→皮革 = 高光从散射变成边缘反射
- 体积变化：蓬松外套→修身夹克 = 轮廓线条变化
- 性别变化：女性→男性 = 肩宽、姿态力量感调整
- 产品类型变化：服装→电子产品 = 展示方式、与人物关系变化

请用 JSON 格式输出，结构如下：

{
  "reference": {
    "scene_type": "场景类型",
    "visual_style": "视觉风格（要非常具体，如：暗调戏剧性时尚大片、硬光高对比商业摄影）",
    "mood": ["情绪关键词数组"],
    "color_palette": {
      "dominant_colors": ["主色调数组"],
      "contrast": "对比度",
      "saturation": "饱和度"
    },
    "subject": {
      "type": "主体类型",
      "gender": "性别",
      "pose_detailed": {
        "hands": "【最关键】手的具体位置和动作，如：双手举起扶墨镜/双手叉腰/双手垂下等",
        "arms": "手臂位置，如：抬起/弯曲/垂下",
        "body_lean": "身体倾斜，如：前倾/后仰/直立",
        "legs": "腿部姿态，如：一脚在前/双脚并立",
        "head": "头部角度，如：微低/仰视/侧偏",
        "overall_dynamics": "整体动态感描述，如：戏剧性/静态/充满力量"
      },
      "expression": "表情描述",
      "accessories": ["配饰数组，必须详细列出所有配饰：墨镜款式、手套类型、首饰等"]
    },
    "clothing": {
      "outerwear": "外套描述",
      "top": "上衣描述",
      "bottom": "下装描述",
      "footwear": "鞋子描述",
      "details": ["服装细节数组"]
    },
    "lighting": {
      "type": "光线类型（如：单点硬光、柔光、伦勃朗光）",
      "direction": "光线方向（如：正上方45度、侧光）",
      "intensity": "光线强度",
      "shadow": "阴影特点（深重/柔和/戏剧性）",
      "special_effects": "特殊光效（如：烟雾中的光束、背光轮廓光）"
    },
    "background": {
      "type": "背景类型",
      "color": "背景颜色",
      "atmosphere": "氛围元素（如：浓烟、薄雾、光晕、粒子）",
      "texture": "背景纹理"
    },
    "composition": {
      "framing": "取景方式（全身/半身/特写）",
      "camera_angle": "相机角度（平视/俯视/仰视/具体角度）",
      "depth_of_field": "景深",
      "subject_position": "主体在画面中的位置"
    },
    "style_keywords": ["风格关键词数组"]
  },
  "product": {
    "category": "产品大类",
    "type": "产品具体类型（如：夹克、大衣、衬衫）",
    "exact_color": "【精确颜色描述】如：浅棕色/焦糖色/驼色/深棕色/黑色等，必须准确",
    "color_english": "颜色的英文（如：tan, camel, cognac, brown, black）",
    "material": "【精确材质】如：光滑皮革、磨砂皮、羊毛、棉、尼龙等",
    "material_english": "材质的英文（如：smooth leather, suede, wool, cotton）",
    "closure_type": "闭合方式（如：纽扣、拉链、无）",
    "collar_style": "领子样式和颜色",
    "pocket_style": "口袋样式（如：贴袋、插袋、无口袋）",
    "length": "衣长（如：短款、中长、长款）",
    "fit": "版型（如：修身、宽松、常规）",
    "key_details": ["其他关键细节，如：明线、金属扣、logo等"],
    "target_gender": "目标性别"
  },
  "fusion": {
    "visual_dna_preserved": {
      "lighting": "完整的灯光描述（从爆款100%复制）",
      "composition": "完整的构图描述（从爆款100%复制）",
      "atmosphere": "完整的氛围描述，包括烟雾、光晕等（从爆款100%复制）",
      "post_processing": "后期风格：暗角、颗粒、色调等（从爆款100%复制）",
      "accessories": "所有配饰描述（从爆款100%复制）",
      "mood": "情绪叙事（从爆款100%复制）"
    },
    "product_replacement": {
      "original_product": "爆款中的原产品描述",
      "new_product": "用户产品的精确描述（使用我提供的）",
      "cascading_effects": ["级联影响列表，如：材质高光变化、体积轮廓变化等"]
    },
    "subject_adaptation": {
      "original_gender": "爆款中的性别",
      "target_gender": "目标性别（根据产品）",
      "body_adaptations": ["体型适配，如：肩宽调整、姿态力量感等"]
    },
    "style_keywords_adaptation": {
      "preserved_keywords": ["保留的风格关键词"],
      "adapted_keywords": ["适配后的关键词，如：luxury menswear editorial"]
    },
    "notes": ["注意事项"],
    "generation_prompt": "【按照上述逻辑生成的完整英文提示词】"
  }
}

【generation_prompt 的生成逻辑】：

你要像一个专业摄影导演一样思考，把语义蓝图转化为高密度的视觉语言。

第一步：锁定视觉DNA（从爆款100%复制）
- 完整复制灯光描述
- 完整复制构图描述
- 完整复制氛围/后期描述
- 完整复制情绪叙事
- 完整复制配饰

第二步：智能替换产品（使用我提供的精确产品描述）
- 直接使用我提供的产品英文描述，不要修改
- 思考这个产品如何在画面中呈现

第三步：处理级联影响
- 如果材质变了，调整高光和反射的描述
- 如果性别变了，调整体型和姿态力量感的描述
- 如果产品类型完全不同，调整产品与人物/场景的关系

【prompt 结构模板 - 必须严格按此顺序】：
"[摄影风格]。[性别 + 姿势 - 这是最重要的！必须明确写 male/female model，必须详细描述手的位置和身体动态，如 'male model with both hands raised to adjust oversized sunglasses, body leaning forward dynamically']。[产品精确描述]。[配饰 - 100%保留]。[灯光 - 100%保留]。[背景和氛围 - 100%保留]。[构图 - 100%保留]。[色调 - 100%保留]。[情绪]"

【姿势描述是最容易出错的地方！】：
- 如果参考图是双手扶墨镜，必须写 "both hands raised to adjust sunglasses"
- 如果参考图是叉腰，必须写 "hands on hips"
- 不要用模糊的词如 "neutral stance" 或 "relaxed pose"
- 必须具体描述手在哪里、身体什么角度

【产品描述必须精确】：
- 我会提供产品的精确英文描述，你必须原封不动地使用
- 不要用你自己的理解去改写产品描述
- 产品描述包括：类型、精确颜色、精确材质、闭合方式、口袋样式、领子细节、衣长等

重要：
- 使用中文输出分析和建议内容
- generation_prompt 必须是英文，必须极其详细（至少200词），确保生成结果与爆款几乎一模一样
- generation_prompt 中使用 "faux fur" 代替 "fur"，"faux leather" 或 "vegan leather" 代替 "leather"
- 确保 JSON 格式正确

只返回 JSON，不要包含其他文字。`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `请分析这两张图片。第一张是爆款参考素材，第二张是我要推广的产品。

【重要】我已经对产品进行了精确分析，产品描述如下（请在 generation_prompt 中直接使用这个描述，不要修改）：
"${productDescription}"

请给出详细的融合建议，generation_prompt 中的服装描述必须使用上面的精确描述。`,
            },
            {
              type: 'image_url',
              image_url: { url: referenceImageBase64 },
            },
            {
              type: 'image_url',
              image_url: { url: productImageBase64 },
            },
          ],
        },
      ],
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || '分析失败');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';

  // 解析 JSON
  let jsonStr = '';
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  } else {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
  }

  if (!jsonStr) {
    console.error('原始返回内容:', content);
    throw new Error(`无法解析分析结果`);
  }

  try {
    const result = JSON.parse(jsonStr);
    // 添加产品精确描述到结果中
    result.productDescription = productDescription;
    return result;
  } catch (e) {
    console.error('JSON 解析失败:', jsonStr);
    throw new Error(`JSON 解析失败`);
  }
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
