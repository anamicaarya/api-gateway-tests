import { resourcesTeardown } from '../support/api/teardown.js'
const data = require('../fixtures/services/service.json')

describe('teardown resources', () => {
  resourcesTeardown(data)
})