// 爆款素材分析结果
export interface ReferenceAnalysis {
  scene_type: string;
  visual_style: string;
  mood: string[];
  color_palette: {
    dominant_colors: string[];
    contrast: string;
    saturation: string;
  };
  subject: {
    type: string;
    gender: string;
    pose: string;
    pose_detailed?: {
      hands: string;
      arms: string;
      body_lean: string;
      legs: string;
      head: string;
      overall_dynamics: string;
    };
    expression: string;
    accessories: string[];
  };
  clothing: {
    outerwear?: string;
    top?: string;
    bottom?: string;
    footwear?: string;
    details: string[];
  };
  lighting: {
    type: string;
    direction: string;
    intensity: string;
    shadow: string;
  };
  background: {
    type: string;
    color: string;
    atmosphere: string;
  };
  composition: {
    framing: string;
    camera_angle: string;
    depth_of_field: string;
  };
  style_keywords: string[];
}

// 产品图分析结果
export interface ProductAnalysis {
  category: string;
  type: string;
  exact_color: string;
  color_english: string;
  material: string;
  material_english: string;
  closure_type: string;
  collar_style: string;
  pocket_style: string;
  length: string;
  fit: string;
  key_details: string[];
  target_gender: string;
  // 兼容旧字段
  colors?: string[];
  materials?: string[];
  key_features?: string[];
  style_keywords?: string[];
}

// 融合建议 - 核心逻辑：语义级别的风格迁移
export interface FusionSuggestion {
  // 100% 保留的视觉DNA
  visual_dna_preserved: {
    lighting: string;      // 灯光描述
    composition: string;   // 构图描述
    atmosphere: string;    // 氛围描述（含烟雾等）
    post_processing: string; // 后期风格
    accessories: string;   // 配饰描述
    mood: string;          // 情绪叙事
  };

  // 产品替换（含级联影响）
  product_replacement: {
    original_product: string;  // 原产品
    new_product: string;       // 新产品描述
    cascading_effects: string[]; // 级联影响
  };

  // 主体适配
  subject_adaptation: {
    original_gender: string;
    target_gender: string;
    body_adaptations: string[];
  };

  // 风格关键词适配
  style_keywords_adaptation: {
    preserved_keywords: string[];
    adapted_keywords: string[];
  };

  // 注意事项
  notes: string[];

  // 最终生成提示词
  generation_prompt: string;

  // 兼容旧字段
  replicate_elements?: { category: string; elements: string[] }[];
  replace_elements?: { element: string; original: string; replacement: string; reason: string }[];
  adjustable_options?: {
    model_gender: string;
    model_pose: string;
    model_expression: string;
    background_style: string;
    lighting_style: string;
    color_tone: string;
    atmosphere: string;
  };
  product_placement?: {
    position: string;
    how_to_wear: string;
    visibility: string;
  };
}

// 完整分析结果
export interface AnalysisResult {
  reference: ReferenceAnalysis;
  product: ProductAnalysis;
  fusion: FusionSuggestion;
  // 产品的精确英文描述（用于生成）
  productDescription?: string;
}

// 生成结果
export interface GenerationResult {
  imageUrl: string;
  revisedPrompt: string;
}

// 工作流步骤
export type WorkflowStep =
  | 'upload'      // 上传两张图
  | 'analyzing'   // 分析中
  | 'review'      // 查看融合建议
  | 'generating'  // 生成中
  | 'complete';   // 完成

// Tab 类型
export type TabType = 'fusion' | 'imageToImage';

// 图生图工作流步骤
export type ImageToImageStep =
  | 'upload'      // 上传产品图
  | 'generating'  // 生成中
  | 'complete';   // 完成
