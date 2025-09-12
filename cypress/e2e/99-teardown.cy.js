import { resourcesTeardown } from '../support/api/teardown.js'
const data = require('../fixtures/common/teardown.json')

describe('teardown resources', () => {
  resourcesTeardown(data)
})