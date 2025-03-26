class CommentValidator {
  static validate(data) {
    const errors = []

    if (!this.isValidEmail(data.email)) {
      errors.push('Некорректный email')
    }

    if (!this.isValidNickname(data.nickname)) {
      errors.push('Некорректный никнейм')
    }

    if (!this.isValidText(data.text)) {
      errors.push('Некорректный текст')
    }

    if (!this.isValidHtmlTags(data.text)) {
      errors.push('Недопустимые HTML теги. Разрешены только <a>, <code>, <i> и <strong> теги')
    }

    if (data.homePage && !this.isValidUrl(data.homePage)) {
      errors.push('Некорректный URL')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  static isValidNickname(nickname) {
    return nickname.length >= 2 && nickname.length <= 50
  }

  static isValidText(text) {
    return text.length >= 1 && text.length <= 1000
  }

  static isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static isValidHtmlTags(text) {
    // Регулярное выражение для проверки разрешенных тегов
    const allowedTagsRegex = /<\/?(?:a(?:\s+(?:href|title)="[^"]*")*|code|i|strong)>/g
    const matches = text.match(/<[^>]+>/g) || []

    // Проверяем, что все теги в тексте соответствуют разрешенным
    for (const match of matches) {
      if (!allowedTagsRegex.test(match)) {
        return false
      }
      allowedTagsRegex.lastIndex = 0
    }

    // Проверяем парность тегов
    const stack = []
    const tagRegex = /<\/?([a-z]+)[^>]*>/g
    let match

    while ((match = tagRegex.exec(text)) !== null) {
      const isClosing = match[0].startsWith('</')
      const tagName = match[1].toLowerCase()

      if (!isClosing) {
        stack.push(tagName)
      } else {
        if (stack.length === 0 || stack.pop() !== tagName) {
          return false
        }
      }
    }

    return stack.length === 0
  }
}

export default CommentValidator
