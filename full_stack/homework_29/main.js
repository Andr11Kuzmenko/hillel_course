function ageClassification(num) {
  return num < 0 ? null :
    num <= 24 ? 'Дитинство' :
      num <= 44 ? 'Молодість' :
        num <= 65 ? 'Зрілість' :
          num <= 75 ? 'Старість' :
            num <= 90 ? 'Довголіття' :
              num <= 122 ? 'Рекорд' : null
}

function weekFn(cond) {
  let str = ''

  switch (cond) {
    case 1:
      str = 'Понеділок'
      break
    case 2:
      str = 'Вівторок'
      break
    case 3:
      str = 'Середа'
      break
    case 4:
      str = 'Четвер'
      break
    case 5:
      str = 'П\'ятниця'
      break
    case 6:
      str = 'Субота'
      break
    case 7:
      str = 'Неділя'
      break
    default:
      str = null
  }

  return str
}

module.exports = { ageClassification, weekFn }
