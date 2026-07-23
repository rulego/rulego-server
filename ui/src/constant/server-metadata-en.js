const translations = Object.freeze({
  'Shell 命令执行工具。执行 shell 命令并返回结果。当前平台: linux, Shell类型: sh。使用 Unix/Shell 风格命令: ls, cat, grep, find, cp, mv, rm, mkdir。 超时时间: 60秒。输出超过 65536 字节会被截断。':
    'Shell command execution tool. Runs a shell command and returns its result. Current platform: Linux; shell: sh. Use Unix shell commands such as ls, cat, grep, find, cp, mv, rm, and mkdir. Timeout: 60 seconds. Output is truncated after 65,536 bytes.',
  命令执行的默认工作目录: 'Default working directory for command execution',
  工作目录: 'Working Directory',
  '命令执行超时时间（秒）': 'Command execution timeout (seconds)',
  超时时间: 'Timeout',
  '输出最大字节数，超过则截断（默认64KB）':
    'Maximum output size in bytes; larger output is truncated (default: 64 KB)',
  最大输出: 'Maximum Output',
  'allow - 白名单模式': 'allow - Allowlist mode',
  'deny - 黑名单模式': 'deny - Denylist mode',
  '安全模式：allow(只允许列表中的命令) 或 deny(允许所有，拒绝列表中的命令)':
    'Security mode: allow runs only listed commands; deny runs all commands except those listed',
  安全模式: 'Security Mode',
  '允许执行的命令列表（allow 模式生效）': 'Commands permitted in allow mode',
  允许列表: 'Allowlist',
  拒绝执行的命令列表: 'Commands that must not be executed',
  拒绝列表: 'Denylist',
  拒绝的参数模式: 'Denied argument patterns',
  拒绝参数: 'Denied Arguments',
  '指定使用的 Shell 路径（例如 bash.exe 的绝对路径）。如果为空，则自动检测。':
    'Shell executable path, such as the absolute path to bash.exe. Leave blank to detect it automatically.',
  Shell路径: 'Shell Path',
  文件操作的默认工作目录: 'Default working directory for file operations',
  保留的最大历史版本数: 'Maximum number of retained history versions',
  最大历史数: 'Maximum History',
  单次读取最大行数: 'Maximum number of lines per read',
  最大读取行数: 'Maximum Read Lines',
  搜索内容时返回的最大匹配文件数:
    'Maximum number of matching files returned by a content search',
  最大搜索结果数: 'Maximum Search Results',
  '单次写入最大字节数，0表示不限制':
    'Maximum bytes per write; 0 means unlimited',
  最大文件大小: 'Maximum File Size',
  '调用 MCP 服务器提供的工具。连接到: ':
    'Calls tools provided by the MCP server. Connected to:',
  'MCP 服务器地址，可以是命令行或 HTTP URL':
    'MCP server address; may be a command or an HTTP URL',
  MCP服务器: 'MCP Server',
  'MCP 连接超时时间（秒）': 'MCP connection timeout (seconds)',
  'MCP 客户端名称': 'MCP client name',
  客户端名称: 'Client Name',
  'MCP 客户端版本': 'MCP client version',
  客户端版本: 'Client Version',
  '浏览器自动化工具 - 使用 Chrome/Chromium 进行网页导航、元素交互、内容提取和标签页管理。注意：此工具会启动真实浏览器，仅用于网页操作。图片识别/分析请直接使用大模型的多模态能力，不要调用此工具。支持操作: go_to_url, click_element, input_text, scroll_down/up, wait, extract_content, open_tab, switch_tab, close_tab':
    'Browser automation tool for navigation, element interaction, content extraction, and tab management in Chrome or Chromium. It launches a real browser and is intended only for web operations. Use the model’s multimodal capabilities for image recognition or analysis. Supported operations: go_to_url, click_element, input_text, scroll_down/up, wait, extract_content, open_tab, switch_tab, close_tab.',
  '是否使用无头浏览器模式（不显示界面）':
    'Run the browser in headless mode without displaying a window',
  无头模式: 'Headless Mode',
  是否禁用浏览器安全策略: 'Disable browser security policies',
  禁用安全: 'Disable Security',
  '额外的 Chromium 布尔命令行参数，如 disable-gpu, no-sandbox':
    'Additional Chromium Boolean command-line flags, such as disable-gpu and no-sandbox',
  额外参数: 'Additional Flags',
  'Chromium 命令行参数（支持带值），如 lang, disable-blink-features 等':
    'Chromium command-line arguments, including valued arguments such as lang and disable-blink-features',
  Chromium参数: 'Chromium Arguments',
  'Chrome/Chromium 可执行文件路径（为空则自动查找）':
    'Chrome or Chromium executable path; leave blank to detect it automatically',
  Chrome路径: 'Chrome Path',
  'HTTP 代理地址，如 http://127.0.0.1:7890':
    'HTTP proxy address, such as http://127.0.0.1:7890',
  代理地址: 'Proxy Address',
  'Chrome 用户数据目录，用于保留登录状态和浏览数据（支持相对路径）':
    'Chrome user-data directory used to retain login state and browsing data; relative paths are supported',
  用户数据目录: 'User Data Directory',
  '默认搜索引擎 (google, baidu, bing, duckduckgo) 或自定义 URL 模板':
    'Default search engine (google, baidu, bing, or duckduckgo), or a custom URL template',
  搜索引擎: 'Search Engine',
  '操作超时时间（秒），用于页面加载、元素等待等操作，默认 30 秒':
    'Operation timeout in seconds for page loads, element waits, and similar operations (default: 30)',
  '技能调用工具 - 调用预定义的技能文件，支持从目录加载和执行技能':
    'Skill invocation tool that loads and executes predefined skill files from directories',
  全局技能目录: 'Global Skill Directories',
  '全局技能目录列表，所有用户共享的技能，多个目录用逗号分隔':
    'Comma-separated global skill directories shared by all users',
  本地技能目录: 'Local Skill Directories',
  '本地技能目录列表，当前智能体专属的技能，优先级高于全局技能':
    'Local skill directories for this agent; these take precedence over global skills',
  禁用的技能: 'Disabled Skills',
  '该智能体禁用的技能名称列表，仅对当前智能体生效':
    'Skills disabled for this agent only',
  使用中文: 'Use Chinese',
  是否使用中文提示: 'Use Chinese-language prompts',
  '会话寻址键，留空用 RemoteAddr。支持 ${} 表达式':
    'Session addressing key; leave blank to use RemoteAddr. Supports ${} expressions.',
  '会话空闲超时(秒)，<=0 用默认 1800':
    'Session idle timeout in seconds; values <= 0 use the default of 1800',
  'ws://host:port 拨号发送；或 ref:// 指向 endpoint/ws 寻址推送':
    'Dial and send to ws://host:port, or use ref:// to address an endpoint/ws push',
  '仅 ref:// 时生效。IP/deviceId/* (broadcast); supports ${metadata.xxx}':
    'Applies only to ref://. Use IP/deviceId/* for broadcast; supports ${metadata.xxx}.',
});

const displayKeys = new Set(['desc', 'label', 'message', 'title']);

export function translateServerMetadata(value) {
  if (Array.isArray(value)) {
    value.forEach(translateServerMetadata);
    return value;
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  Object.entries(value).forEach(([key, item]) => {
    if (displayKeys.has(key) && typeof item === 'string') {
      value[key] = translations[item] || item;
    } else {
      translateServerMetadata(item);
    }
  });
  return value;
}
