export default function VitaePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-center mb-12 tracking-wider text-charcoal-light">
        ///// 履历 /////
      </h1>

      <div className="space-y-10">
        {/* 教育背景 */}
        <section>
          <h2 className="font-serif text-xl mb-4 tracking-wide">教育背景</h2>
          <div className="border border-cream-dark p-6 space-y-4">
            <div>
              <p className="text-sm font-medium">2022.09 - 至今 &nbsp; 杭州师范大学 &nbsp; 计算机科学与技术(金融)</p>
              <p className="text-xs text-charcoal-light mt-1">GPA 3.64/5 (86.4/100)</p>
            </div>
          </div>
        </section>

        {/* 项目经历 */}
        <section>
          <h2 className="font-serif text-xl mb-4 tracking-wide">项目经历</h2>
          <div className="border border-cream-dark p-6 space-y-6">
            <div>
              <p className="text-sm font-medium">2024.04-10 &nbsp; 浙江省大学生证券投资竞赛 &nbsp; 省一等奖</p>
              <ul className="mt-2 space-y-1 text-sm text-charcoal-light">
                <li>&middot; 多因子选股 + 动态择时, LightGBM + RSRS</li>
                <li>&middot; 年化收益8%，最大回撤3%</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">2025.02-05 &nbsp; 中国大学生计算机设计大赛 &nbsp; 省二等奖</p>
              <ul className="mt-2 space-y-1 text-sm text-charcoal-light">
                <li>&middot; TuGraph + GNN + 协同过滤</li>
                <li>&middot; 推荐准确率提升22%</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 实习经历 */}
        <section>
          <h2 className="font-serif text-xl mb-4 tracking-wide">实习经历</h2>
          <div className="border border-cream-dark p-6">
            <p className="text-sm font-medium">2025.08-11 &nbsp; 浙江森马电子商务有限公司</p>
            <ul className="mt-2 space-y-1 text-sm text-charcoal-light">
              <li>&middot; RPA开发 &amp; 上新实习生</li>
              <li>&middot; 负责balabala品牌全流程上新，管理多平台店铺链接</li>
              <li>&middot; 开发RPA脚本实现自动化，提升部门工作效率</li>
            </ul>
          </div>
        </section>

        {/* 校园经历 */}
        <section>
          <h2 className="font-serif text-xl mb-4 tracking-wide">校园经历</h2>
          <div className="border border-cream-dark p-6 space-y-2">
            <p className="text-sm">2023.09 - 至今 &nbsp; 杭州师范大学 班长</p>
            <p className="text-sm">2022.09 - 2024.06 &nbsp; 杭州师范大学 校社团中心财务部部长</p>
          </div>
        </section>

        {/* 证书 & 技能 */}
        <section>
          <h2 className="font-serif text-xl mb-4 tracking-wide">证书 &amp; 技能</h2>
          <div className="border border-cream-dark p-6 space-y-2">
            <p className="text-sm">英语六级(484) | Python计算机二级 | 普通话二乙</p>
            <p className="text-sm text-charcoal-light">主修: Python, 数据库, C++, 金融数据分析, 数据挖掘</p>
          </div>
        </section>

        {/* Download */}
        <div className="text-center pt-4">
          <a href="/resume.pdf" className="btn-minimal text-xs inline-block">
            &#128196; 下载我的简历 (PDF)
          </a>
        </div>
      </div>
    </div>
  )
}
