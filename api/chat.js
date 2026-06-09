const MAX_MESSAGE_LENGTH = 200;

const SYSTEM_PROMPT = `당신은 '모두의 마린' 수상레저 중고 거래 앱의 매물 추천 전문가입니다.

[절대 규칙]
- 가격 조건이 있으면 반드시 정확히 지켜야 합니다. "500만원 이하"면 price <= 500인 매물만, "1000만원 이하"면 price <= 1000인 매물만 포함.
- 조건에 맞는 매물이 없으면 listingIds는 반드시 빈 배열 []로 반환하고, 없다고 안내하세요.
- 조건에 맞지 않는 매물은 절대 포함하지 마세요.
- 한국어로 친근하고 간결하게 답변 (2~3문장)
- 반드시 아래 JSON 형식으로만 응답

응답 형식 (반드시 이 JSON만):
{"message": "응답 텍스트", "listingIds": [숫자, 숫자, ...]}

필터링 기준:
- 선종: 제트스키, 모터보트, 낚시보트, 요트, RIB
- 가격: 매물 목록의 price 값(만원)과 사용자 요청 금액을 정확히 비교
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

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 512,
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + '\n\n현재 매물 목록:\n' + listingSummary },
          { role: 'user', content: cleanMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, JSON.stringify(errBody));
      if (response.status === 429) {
        return res.status(503).json({ message: 'AI 추천 사용량이 잠시 제한되었습니다. 검색 필터를 먼저 이용해 주세요.', listingIds: [] });
      }
      return res.status(503).json({ message: 'AI 추천 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.', listingIds: [] });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      let ids = Array.isArray(parsed.listingIds)
        ? parsed.listingIds.map(Number).filter(Number.isFinite).slice(0, 12)
        : [];

      // 서버 측 가격 조건 검증: "N만원 이하" 파싱 후 초과 매물 제거
      const priceMaxMatch = cleanMessage.match(/(\d[\d,]*)\s*만원\s*이하/);
      if (priceMaxMatch && Array.isArray(listings) && ids.length > 0) {
        const maxPrice = Number(priceMaxMatch[1].replace(/,/g, ''));
        const listingMap = Object.fromEntries(listings.map(l => [l.id, l.price]));
        ids = ids.filter(id => {
          const price = listingMap[id];
          return price !== undefined && price <= maxPrice;
        });
      }

      return res.status(200).json({ message: parsed.message || '조건에 맞는 매물을 찾아봤습니다.', listingIds: ids });
    } catch {
      return res.status(200).json({ message: text || '조건에 맞는 매물을 찾아봤습니다.', listingIds: [] });
    }
  } catch (err) {
    console.error('Groq fetch error:', err);
    return res.status(500).json({ message: 'AI 추천 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.', listingIds: [] });
  }
}
