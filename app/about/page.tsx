export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 min-h-[80vh] flex flex-col justify-center">
      <h1 className="font-serif text-3xl text-center mb-12 tracking-wider text-charcoal-light">
        ///// 关于 /////
      </h1>

      <div className="space-y-8 text-charcoal-light leading-relaxed">
        <p className="text-center text-lg font-serif text-charcoal">
          &ldquo;用理性写代码，用感性看世界。&rdquo;
        </p>

        <p>
          Hi，我是 SunnySide，一名计算机科学专业的学生，热爱编程、旅行与摄影。
          这个网站是我个人的数字花园——记录日常的点滴、走过的城市、以及成长中的履历。
        </p>

        <p>
          我享受用代码构建事物的过程，也着迷于探索不同城市的风景与人文。
          从杭州的西湖到云南的洱海，从长春的雪原到香港的霓虹，每一站都让我对世界有新的理解。
        </p>

        <div className="border border-cream-dark p-6 mt-8">
          <h2 className="font-serif text-lg mb-4">联系方式</h2>
          <div className="space-y-2 text-sm">
            <p>邮箱: suweicheng@hznu.edu.cn</p>
            <p>位置: 杭州, 浙江</p>
          </div>
        </div>
      </div>
    </div>
  )
}
