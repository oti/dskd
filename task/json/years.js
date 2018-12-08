const fs = require('fs')

// 年ごとのjsonを作る
const years = (posts) => {
  const years_post_map = []
  const years_post_list = {}
  const json = {years: {}}

  // 年とpage_idの対応オブジェクトを抽出
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  for(let key of Object.keys(posts)) {
    const yyyy = posts[key].page_datetime.split('-')[0]

    years_post_map.push({[yyyy]: posts[key].page_id})
    // あとで使うので空の配列をキーごとに持たせる
    years_post_list[yyyy] = []
  }

  // 年ごとに該当するpage_idを配列に入れる
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  years_post_map.forEach(set => {
    const yyyy = Object.keys(set)[0]
    years_post_list[yyyy].push(set[yyyy])
  })

  // 年別に記事が配列になったjsonを作る
  for(let key of Object.keys(years_post_list)) {
    const drip = years_post_list[key].map(id => {
      return {
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      }
    })

    // 日付で降順ソート
    drip.sort((a, b) => {
      const date_a = Number(a.page_datetime.replace(/[-T:]/g, ''))
      const date_b = Number(b.page_datetime.replace(/[-T:]/g, ''))
      if (date_a > date_b) return -1
      if (date_a < date_b) return 1
      return 0
    })

    // 対応する年キーに入れる
    // json = {'years': {'2010': [{post}, {post}...], '2011': [{post}, {post}...], '2012': [{post}, {post}...]}}
    json.years[key] = drip

    // yearごとにmdファイルをwriteFile
    const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'year'\npage_title: '${key}'\n---`
    fs.writeFileSync('./src/md/archives/'+key+'.md', yaml_block)
  }

  return json
}

module.exports = years
