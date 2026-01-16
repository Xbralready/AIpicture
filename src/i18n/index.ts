export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    // Header
    title: 'AI Marketing Studio',
    tagline: '智能营销素材生成工具',

    // Tabs
    tabFusion: '爆款融合',
    tabImageToImage: '图生图',

    // Steps
    step1: '上传素材',
    step2: '融合建议',
    step3: '生成结果',

    // Upload
    referenceLabel: '爆款参考素材',
    referenceDesc: '上传一张成功的营销图片作为参考',
    productLabel: '产品图',
    productDesc: '上传你要推广的产品图片',
    uploadHint: '拖拽图片到这里或点击上传',
    uploadFormat: '支持 JPG、PNG、WebP 格式',
    changeImage: '点击更换图片',

    // Actions
    analyzeBtn: '分析并获取融合建议',
    generateBtn: '生成图片',
    regenerateBtn: '重新生成',
    downloadBtn: '下载图片',
    resetBtn: '重新开始',
    backToReview: '返回查看建议',
    confirmGenerate: '确认并生成图片',

    // Loading
    analyzingTitle: '正在分析素材...',
    analyzingSub: 'AI 正在同时分析爆款素材和产品图，生成融合建议',
    generatingTitle: '正在生成营销素材...',
    generatingSub: 'AI 正在根据融合建议生成图片，请耐心等待',
    i2iGeneratingTitle: '正在生成图片...',
    i2iGeneratingSub: 'AI 正在分析产品并根据您的描述生成图片',

    // Results
    resultTitle: '生成结果',
    promptUsed: '生成提示词',
    promptUsedAlt: '使用的提示词',
    reference: '爆款参考',
    product: '产品图',

    // Image to Image
    i2iPromptLabel: '描述你想要的效果',
    i2iPromptDesc: '描述场景、风格、氛围等，支持中英文输入，AI 会结合产品生成图片',
    i2iPromptPlaceholder: '例如：专业产品摄影，夹克挂在木质衣架上，极简白色背景，左侧柔和自然光，淡淡阴影，高端时尚杂志风格，简洁优雅的构图',

    // Fusion Review
    productDescTitle: '产品精确描述',
    productDescHint: '以下描述将直接用于图片生成，您可以点击编辑进行微调',
    editBtn: '编辑',
    saveBtn: '保存',
    cancelBtn: '取消',
    visualDnaTitle: '100% 保留的视觉DNA',
    visualDnaHint: '以下元素将从爆款素材完整复制，确保生成图与爆款高度一致',
    dnaLighting: '灯光',
    dnaComposition: '构图',
    dnaAtmosphere: '氛围',
    dnaPostProcessing: '后期风格',
    dnaAccessories: '配饰',
    dnaMood: '情绪叙事',
    replacementTitle: '产品替换',
    originalProduct: '原产品',
    newProduct: '新产品',
    cascadingEffects: '级联影响',
    promptPreviewTitle: '生成提示词预览',
    promptPreviewHint: '以下提示词将用于生成图片，您可以直接编辑进行微调',

    // Fusion Review
    refAnalysis: '爆款素材分析',
    productAnalysis: '产品分析',
    sceneType: '场景类型',
    visualStyle: '视觉风格',
    mood: '情绪',
    subject: '主体',
    lighting: '光线',
    type: '类型',
    color: '颜色',
    material: '材质',
    targetGender: '目标性别',
    productDescSection: '产品精确描述（用于生成）',
    fixDesc: '修正描述',
    done: '完成',
    productDescNote: '如果以下描述与你的产品不符，请点击修正',
    visualDnaSection: '视觉DNA（100%保留）',
    visualDnaNote: '以下元素将从爆款完全复制，确保风格一致',
    postProcessing: '后期',
    accessories: '配饰',
    moodLabel: '情绪',
    productReplace: '产品替换',
    originalProductLabel: '原产品',
    yourProduct: '你的产品',
    cascadingEffectsLabel: '级联影响',
    subjectAdapt: '主体适配',
    styleKeywords: '风格关键词',
    preserved: '保留',
    adapted: '适配',
    genPrompt: '生成提示词',
    editPrompt: '编辑提示词',
    doneEdit: '完成编辑',
    notes: '注意事项',
    generating: '生成中...',
    generateMaterial: '生成营销素材',
    generateNote: '保留80-90%视觉DNA，智能替换产品',

    // Footer
    poweredBy: 'Powered by OpenAI GPT-5.2',
  },
  en: {
    // Header
    title: 'AI Marketing Studio',
    tagline: 'Intelligent Marketing Material Generator',

    // Tabs
    tabFusion: 'Style Fusion',
    tabImageToImage: 'Image to Image',

    // Steps
    step1: 'Upload',
    step2: 'Review',
    step3: 'Result',

    // Upload
    referenceLabel: 'Reference Image',
    referenceDesc: 'Upload a successful marketing image as reference',
    productLabel: 'Product Image',
    productDesc: 'Upload the product you want to promote',
    uploadHint: 'Drag & drop or click to upload',
    uploadFormat: 'Supports JPG, PNG, WebP',
    changeImage: 'Click to change',

    // Actions
    analyzeBtn: 'Analyze & Get Suggestions',
    generateBtn: 'Generate Image',
    regenerateBtn: 'Regenerate',
    downloadBtn: 'Download',
    resetBtn: 'Start Over',
    backToReview: 'Back to Review',
    confirmGenerate: 'Confirm & Generate',

    // Loading
    analyzingTitle: 'Analyzing images...',
    analyzingSub: 'AI is analyzing both images and generating fusion suggestions',
    generatingTitle: 'Generating marketing material...',
    generatingSub: 'AI is generating the image based on suggestions, please wait',
    i2iGeneratingTitle: 'Generating image...',
    i2iGeneratingSub: 'AI is analyzing your product and generating based on your prompt',

    // Results
    resultTitle: 'Generated Result',
    promptUsed: 'Generation Prompt',
    promptUsedAlt: 'Prompt Used',
    reference: 'Reference',
    product: 'Product',

    // Image to Image
    i2iPromptLabel: 'Describe the desired effect',
    i2iPromptDesc: 'Describe the scene, style, mood in English. AI will generate based on your product.',
    i2iPromptPlaceholder: 'e.g.: Professional product photography, the jacket displayed on a wooden hanger against a minimalist white background, soft natural lighting from the left, subtle shadows, high-end fashion magazine style, clean and elegant composition',

    // Fusion Review
    productDescTitle: 'Product Description',
    productDescHint: 'This description will be used for generation. Click edit to adjust.',
    editBtn: 'Edit',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    visualDnaTitle: 'Visual DNA (100% Preserved)',
    visualDnaHint: 'These elements will be copied from the reference to ensure consistency',
    dnaLighting: 'Lighting',
    dnaComposition: 'Composition',
    dnaAtmosphere: 'Atmosphere',
    dnaPostProcessing: 'Post-processing',
    dnaAccessories: 'Accessories',
    dnaMood: 'Mood',
    replacementTitle: 'Product Replacement',
    originalProduct: 'Original',
    newProduct: 'New Product',
    cascadingEffects: 'Cascading Effects',
    promptPreviewTitle: 'Generation Prompt Preview',
    promptPreviewHint: 'This prompt will be used for generation. You can edit it directly.',

    // Fusion Review
    refAnalysis: 'Reference Analysis',
    productAnalysis: 'Product Analysis',
    sceneType: 'Scene Type',
    visualStyle: 'Visual Style',
    mood: 'Mood',
    subject: 'Subject',
    lighting: 'Lighting',
    type: 'Type',
    color: 'Color',
    material: 'Material',
    targetGender: 'Target Gender',
    productDescSection: 'Product Description (for generation)',
    fixDesc: 'Fix Description',
    done: 'Done',
    productDescNote: 'Click to fix if the description doesn\'t match your product',
    visualDnaSection: 'Visual DNA (100% Preserved)',
    visualDnaNote: 'These elements will be copied from the reference to ensure style consistency',
    postProcessing: 'Post-processing',
    accessories: 'Accessories',
    moodLabel: 'Mood',
    productReplace: 'Product Replacement',
    originalProductLabel: 'Original',
    yourProduct: 'Your Product',
    cascadingEffectsLabel: 'Cascading Effects',
    subjectAdapt: 'Subject Adaptation',
    styleKeywords: 'Style Keywords',
    preserved: 'Preserved',
    adapted: 'Adapted',
    genPrompt: 'Generation Prompt',
    editPrompt: 'Edit Prompt',
    doneEdit: 'Done Editing',
    notes: 'Notes',
    generating: 'Generating...',
    generateMaterial: 'Generate Marketing Material',
    generateNote: 'Preserve 80-90% visual DNA, intelligently replace product',

    // Footer
    poweredBy: 'Powered by OpenAI GPT-5.2',
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;
