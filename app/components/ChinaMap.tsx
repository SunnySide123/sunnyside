'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface Props {
  cities: { name: string; province: string; is_lit: boolean }[]
  fullProvinces: string[]
  onCityClick?: (cityName: string) => void
}

export default function ChinaMap({ cities, fullProvinces, onCityClick }: Props) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadMap = async () => {
      if (!chartRef.current) return

      const geoJson = await fetch('/china.json').then((r) => r.json())
      echarts.registerMap('china', geoJson)

      const chart = echarts.init(chartRef.current)

      // Build set of provinces with at least one lit city
      const litProvinces = new Set(cities.filter((c) => c.is_lit).map((c) => c.province))

      // Map our province names to GeoJSON feature names
      const provinceGeoMap: Record<string, string[]> = {
        '直辖市': ['北京市', '天津市', '上海市', '重庆市'],
        '内蒙古': ['内蒙古自治区'],
        '广西': ['广西壮族自治区'],
        '西藏': ['西藏自治区'],
        '宁夏': ['宁夏回族自治区'],
        '新疆': ['新疆维吾尔自治区'],
        '港澳台': [],
      }

      const toGeoName = (name: string): string[] => provinceGeoMap[name] || [name]

      // Geo regions: highlight lit provinces, extra highlight for fully-lit
      const regions: any[] = []
      for (const [prov, geoNames] of Object.entries(provinceGeoMap)) {
        if (litProvinces.has(prov)) {
          const isFull = fullProvinces.includes(prov)
          for (const geoName of geoNames) {
            regions.push({
              name: geoName,
              itemStyle: {
                areaColor: isFull ? '#D4C4A8' : '#E0D8C8',
                borderColor: isFull ? '#8B7355' : '#C4A882',
                borderWidth: isFull ? 1.5 : 0.8,
              },
              label: { show: isFull, color: '#8B7355', fontSize: 10 },
            })
          }
        }
      }

      // Handle provinces without mapping issues (like 浙江省, 云南省, etc.)
      for (const prov of litProvinces) {
        if (provinceGeoMap[prov]) continue // Already handled
        const isFull = fullProvinces.includes(prov)
        regions.push({
          name: prov,
          itemStyle: {
            areaColor: isFull ? '#D4C4A8' : '#E0D8C8',
            borderColor: isFull ? '#8B7355' : '#C4A882',
            borderWidth: isFull ? 1.5 : 0.8,
          },
          label: { show: isFull, color: '#8B7355', fontSize: 10 },
        })
      }

      // Add city name labels as scatter points (small dots with city name)
      const cityCoords: Record<string, [number, number]> = {
        '北京': [116.4, 39.9], '天津': [117.2, 39.1], '上海': [121.47, 31.23],
        '重庆': [106.55, 29.57], '杭州': [120.15, 30.28], '宁波': [121.55, 29.87],
        '温州': [120.7, 28.0], '嘉兴': [120.76, 30.75], '湖州': [120.09, 30.89],
        '绍兴': [120.58, 30.05], '金华': [119.65, 29.08], '衢州': [118.87, 28.94],
        '舟山': [122.2, 30.0], '台州': [121.42, 28.66], '丽水': [119.92, 28.47],
        '昆明': [102.83, 24.88], '大理': [100.23, 25.61], '丽江': [100.23, 26.86],
        '西双版纳': [100.8, 22.01], '昭通': [103.7, 27.34], '长春': [125.32, 43.9],
        '吉林': [126.55, 43.84], '通化': [125.94, 41.73], '延边': [129.5, 42.9],
        '南京': [118.78, 32.06], '无锡': [120.3, 31.57], '苏州': [120.58, 31.3],
        '扬州': [119.4, 32.4], '福州': [119.3, 26.07], '泉州': [118.6, 24.93],
        '宁德': [119.55, 26.67], '石家庄': [114.5, 38.04], '秦皇岛': [119.6, 39.94],
        '承德': [117.93, 40.97], '南昌': [115.86, 28.68], '九江': [116.0, 29.7],
        '上饶': [117.97, 28.45], '济南': [117.0, 36.67], '青岛': [120.38, 36.07],
        '烟台': [121.45, 37.47], '兰州': [103.83, 36.06], '天水': [105.72, 34.58],
        '酒泉': [98.5, 39.74], '广州': [113.26, 23.13], '深圳': [114.07, 22.62],
        '贵阳': [106.63, 26.65], '黔东南': [107.98, 26.58], '沈阳': [123.43, 41.8],
        '大连': [121.6, 38.92], '呼和浩特': [111.75, 40.84], '乌兰察布': [113.13, 41.0],
        '合肥': [117.23, 31.86], '武汉': [114.3, 30.6], '太原': [112.55, 37.87],
        '成都': [104.07, 30.67], '西安': [108.94, 34.26], '香港': [114.17, 22.28],
      }

      // Only show scatter points for lit cities
      const scatterData = cities
        .filter((c) => c.is_lit && cityCoords[c.name])
        .map((c) => ({
          name: c.name,
          value: [...cityCoords[c.name], c.province],
        }))

      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.seriesType === 'scatter' || params.seriesType === 'effectScatter') {
              return params.name + '<br/>' + (params.value ? params.value[2] : '')
            }
            return params.name
          },
        },
        geo: {
          map: 'china',
          roam: true,
          zoom: 1.2,
          center: [104.5, 36],
          label: { show: false },
          itemStyle: {
            areaColor: '#EDE8E0',
            borderColor: '#D0C8B8',
            borderWidth: 0.5,
          },
          emphasis: {
            label: { show: true, color: '#2C2C2C', fontSize: 12 },
            itemStyle: { areaColor: '#D8D0C0' },
          },
          regions,
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: scatterData,
            symbolSize: 5,
            itemStyle: { color: '#8B7355' },
            label: { show: false },
          },
        ],
      })

      chart.on('click', (params: any) => {
        if (params.seriesType === 'scatter' || params.seriesType === 'effectScatter') {
          onCityClick?.(params.name)
        }
      })

      const handleResize = () => chart.resize()
      window.addEventListener('resize', handleResize)
      return () => { window.removeEventListener('resize', handleResize); chart.dispose() }
    }

    loadMap()
  }, [cities, fullProvinces, onCityClick])

  return <div ref={chartRef} className="w-full h-[500px]" />
}
