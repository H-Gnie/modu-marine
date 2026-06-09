import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { listings as dummyListings } from '../data.js'

// DB 매물을 더미 데이터 형식으로 변환
function normalize(row) {
  return {
    id: row.id,
    title: [row.brand, row.model, row.year ? row.year + '년' : ''].filter(Boolean).join(' ') || row.type,
    type: row.type,
    brand: row.brand || '',
    model: row.model || '',
    year: row.year || '',
    price: row.price,
    region: row.region || '',
    marina: row.marina || '',
    engine: row.engine || '',
    engineHours: row.engine_hours || 0,
    length: row.length_m ? row.length_m + 'm' : '',
    hp: row.horsepower || 0,
    description: row.description || '',
    image: row.images?.[0] || `https://images.unsplash.com/photo-1540946485063-a43da411c207?w=400`,
    images: row.images || [],
    certified: row.is_certified || false,
    diagnosed: row.is_diagnosed || false,
    delivery: row.has_delivery || false,
    trailer: row.has_trailer || false,
    video: row.has_video || false,
    direct: row.is_direct || false,
    badges: [
      row.is_certified && '모두인증',
      row.is_diagnosed && '모두진단',
      row.has_delivery && '홈배송',
      row.has_trailer && '트레일러',
      row.has_video && '영상',
      row.is_direct && '직거래',
    ].filter(Boolean),
    sellMode: row.sell_mode || 'self',
    sellerId: row.seller_id,
    status: row.status,
    createdAt: row.created_at,
    // 더미 데이터 호환 필드
    location: row.region || '',
    hours: row.engine_hours || 0,
    category: row.type,
    seller: row.sell_mode === 'pro' ? '전문 매물' : '개인 직거래',
    sellerType: row.sell_mode === 'pro' ? '딜러' : '개인',
    score: 85,
    market: `AI시세 ${Math.round(row.price * 1.05).toLocaleString()}만원 · 적정`,
    inspection: {
      선체: row.hull_grade || 'B+',
      엔진: row.engine_grade || 'B+',
      전장: row.electrical_grade || 'B+',
      추진계: row.drive_grade || 'B+',
      부식: '확인 필요',
      시운전: '예약 가능',
    },
    aiPriceMin: row.ai_price_min || Math.round(row.price * 0.9),
    aiPriceMax: row.ai_price_max || Math.round(row.price * 1.1),
    hullGrade: row.hull_grade || 'B+',
    engineGrade: row.engine_grade || 'B+',
    electricalGrade: row.electrical_grade || 'B+',
    driveGrade: row.drive_grade || 'B+',
    hasAccident: row.has_accident || false,
    hasFlood: row.has_flood || false,
    hasGrounding: row.has_grounding || false,
    created: row.created_at?.slice(0, 10) || '',
  }
}

export function useListings() {
  const [dbListings, setDbListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setDbListings(data.map(normalize))
      }
      setLoading(false)
    }
    fetchData()
  }, [tick])

  const refresh = () => setTick(t => t + 1)

  // DB 매물 + 더미 데이터 합산 (DB 매물 우선)
  const allListings = [...dbListings, ...dummyListings]

  return { listings: allListings, dbListings, loading, refresh }
}
