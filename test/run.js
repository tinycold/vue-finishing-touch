const { completeDotVueExtension } = require('../complete')
const { resolve } = require('path')

completeDotVueExtension(resolve(process.cwd(), 'test/mock/BaseTemplate.vue'))
