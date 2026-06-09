// syntax.js — JSON syntax tokenizer & highlighter

(function () {
  'use strict'

  function highlightJSON(code) {
    const text = code.textContent
    let result = ''
    let i = 0

    while (i < text.length) {
      const ch = text[i]

      // Whitespace
      if (/\s/.test(ch)) {
        result += ch
        i++
        continue
      }

      // Strings (keys or values)
      if (ch === '"') {
        let str = '"'
        i++
        while (i < text.length && text[i] !== '"') {
          if (text[i] === '\\') {
            str += text[i] + text[i + 1]
            i += 2
          } else {
            str += text[i]
            i++
          }
        }
        str += '"'
        i++

        // Look ahead for colon — if found, it's a key
        let j = i
        while (j < text.length && /\s/.test(text[j])) j++

        if (text[j] === ':') {
          result += `<span class="tok-key">${escapeHtml(str)}</span><span class="tok-colon">:</span>`
        } else {
          result += `<span class="tok-str">${escapeHtml(str)}</span>`
        }
        continue
      }

      // Numbers
      if (/[0-9\-]/.test(ch)) {
        let num = ''
        while (i < text.length && /[0-9eE.\-+]/.test(text[i])) {
          num += text[i]
          i++
        }
        result += `<span class="tok-num">${num}</span>`
        continue
      }

      // Booleans
      if (text.slice(i, i + 4) === 'true') {
        result += '<span class="tok-bool">true</span>'
        i += 4
        continue
      }
      if (text.slice(i, i + 5) === 'false') {
        result += '<span class="tok-bool">false</span>'
        i += 5
        continue
      }

      // Null
      if (text.slice(i, i + 4) === 'null') {
        result += '<span class="tok-null">null</span>'
        i += 4
        continue
      }

      // Braces and brackets
      if (ch === '{' || ch === '}') {
        result += `<span class="tok-brace">${ch}</span>`
        i++
        continue
      }
      if (ch === '[' || ch === ']') {
        result += `<span class="tok-bracket">${ch}</span>`
        i++
        continue
      }

      // Everything else (commas, colons, etc.)
      result += ch
      i++
    }

    return result
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  // Apply to all JSON code blocks
  document.querySelectorAll('code.json').forEach(code => {
    code.innerHTML = highlightJSON(code)
  })
})()
