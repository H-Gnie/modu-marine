const MAX_MESSAGE_LENGTH = 200;

const SYSTEM_PROMPT = `당신은 '모두의 마린' 수상레저 중고 거래 앱의 매물 추천 전문가입니다.
사용자가 원하는 보트, 제트스키, 요트, 낚시보트, RIB 등을 찾을 수 있도록 친절하게 도와주세요.

응답 규칙:
- 한국어로 친근하고 간결하게 답변 (2~3문장)
- 조건에 맞는 매물 ID를 추출해서 listingIds 배열에 포함
- 조건이 불명확하면 추가 질문
- 반드시 아래 JSON 형식으로만 응답

응답 형식 (반드시 이 JSON만):
{"message": "응답 텍스트", "listingIds": [숫자, 숫자, ...]}

매물 필터링 기준:
- 선종: 제트스키, 모터보트, 낚시보트, 요트, RIB
- 가격: 숫자(만원) 기준
- 지역: 경기, 부산, 제주, 인천, 강원, 전남 등
- 특징: 모두인증, 모두진단, 홈배송, 영상, 트레일러, 직거래
- 운항시간: 숫자(h) 기준`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, listings } = req.body || {};
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  if (!cleanMessage) return res.status(400).json({ message: '질문을 입력해 주세요.', listingIds: [] });
  if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ message: `질문은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.`, listingIds: [] });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'AI 추천 설정을 준비 중입니다. 검색 필터를 먼저 이용해 주세요.', listingIds: [] });
  }

  const listingSummary = (Array.isArray(listings) ? listings : []).slice(0, 50).map(l => {
    const badges = Array.isArray(l.badges) ? l.badges.join(',') : '';
    return `ID:${l.id} [${l.category}] ${l.title} / ${l.price}만원 / ${l.location} / ${l.hours}h / 배지:${badges}`;
  }).join('\n');

  const fullPrompt = SYSTEM_PROMPT + '\n\n현재 매물 목록:\n' + listingSummary + '\n\n사용자 질문: ' + cleanMessage;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.3 },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, JSON.stringify(errBody));
      const detail = errBody?.error?.message || errBody?.error?.status || response.status;
      return res.status(503).json({ message: `Gemini 오류(${detail}) — 잠시 후 다시 시도해 주세요.`, listingIds: [] });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      const ids = Array.isArray(parsed.listingIds)
        ? parsed.listingIds.map(Number).filter(Number.isFinite).slice(0, 12)
        : [];
      return res.status(200).json({ message: parsed.message || '조건에 맞는 매물을 찾아봤습니다.', listingIds: ids });
    } catch {
      return res.status(200).json({ message: text || '조건에 맞는 매물을 찾아봤습니다.', listingIds: [] });
    }
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return res.status(500).json({ message: 'AI 추천 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.', listingIds: [] });
  }
}
