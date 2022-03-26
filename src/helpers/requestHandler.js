const validator = require('validator')

exports.inputValidator = (data, rules) => {
  const dump = {}
  const keysCollection = Object.keys(data)
  const rulesCollection = Object.keys(rules)

  // check if has required rules
  for (const key in rules) {
    if (!keysCollection.includes(key) && rules[key].includes('required')) {
      dump[key] = null
    }
  }

  // check if has valid rules
  for (const key in data) {
    if (!rulesCollection.includes(key)) {
      delete data[key]
    }
  }

  // check if data is undefined
  for (const key in data) {
    if (data[key] === undefined) {
      data[key] = ''
    }
  }

  // clear space
  for (const key in data) {
    data[key] = data[key].trim()
  }

  // check if data valid as rules
  for (const k in data) {
    if (keysCollection.includes(k)) {
      if (rules[k].includes('string')) {
        if (data[k].trim()) {
          dump[k] = data[k].trim().toLowerCase()
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('password')) {
        if (data[k]) {
          dump[k] = data[k]
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('number')) {
        if (isNaN(Number(data[k]))) {
          dump[k] = null
        } else if (data[k] === '') {
          dump[k] = null
        } else {
          dump[k] = data[k]
        }
      }
      if (rules[k].includes('gender')) {
        const genderValue = ['male', 'female']
        const genderData = data[k].trim().toLowerCase()
        if (genderValue.includes(genderData)) {
          dump[k] = genderData
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('boolean')) {
        data[k] = String(data[k]).trim().toLowerCase()
        if (data[k] === 'true' || data[k] === '1') {
          dump[k] = '1'
        } else if (data[k] === 'false' || data[k] === '0') {
          dump[k] = '0'
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('date')) {
        const regexPattern = /^\d{4}-\d{2}-\d{2}$/
        if (regexPattern.test(data[k])) {
          dump[k] = data[k]
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('phone')) {
        const regexPattern = /\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/g
        if (data[k].length >= 10) {
          if (regexPattern.test(data[k])) {
            dump[k] = data[k]
          } else {
            dump[k] = null
          }
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('email')) {
        // eslint-disable-next-line no-useless-escape
        const regexPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (regexPattern.test(data[k])) {
          dump[k] = data[k]
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('sorter')) {
        const sortValue = ['asc', 'desc']
        const sortData = data[k].trim().toLowerCase()
        if (sortValue.includes(sortData)) {
          dump[k] = sortData
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('datetime')) {
        if (validator.isISO8601(data[k])) {
          dump[k] = data[k]
        } else {
          dump[k] = null
        }
      }
      if (rules[k].includes('time')) {
        const regexPattern = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/
        if (regexPattern.test(data[k])) {
          dump[k] = data[k]
        } else {
          dump[k] = null
        }
      }
    }
  }

  // for (const key in dump) {
  //   if (dump[key] === null) {
  //     return false;
  //   }
  // }

  return dump
}
