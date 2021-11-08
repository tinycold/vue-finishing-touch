const { completeDotVueExtension } = require('../main')
const { resolve } = require('path')

completeDotVueExtension(resolve(process.cwd(), 'test/mock/BaseTemplate.vue'))
