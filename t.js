const glob = require('glob')

glob('/Users/xubo/opensource/vue-finishing-touch/admin/**/*.vue', (err, files) => {
  if (err) {
    console.log(err)
  }
  console.log(`scanning ${files}`)
})