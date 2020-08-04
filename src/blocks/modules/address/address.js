/* global axios */
//address
function initDropdown(citiesArray) {
  var addressWrapperEl = document.createDocumentFragment()
  var dropdownBlock = document.querySelector('.address__block-dropdown')
  var dropdownList = document.querySelector('.address__block-dropdown-list')
  var addressPlaceEl = document.querySelector('.address__block-place')
  var phonePlaceEl = document.querySelector('.address-phone')
  var organizerPlaceEl = document.querySelector('.address__inform-org')
  
  function setCurrentCity(city, address) {
    addressPlaceEl.textContent = city + ', ' + address
  }
  
  function toggleDropdownHandler() {
    dropdownList.classList.toggle('address__block-dropdown-list-active')
  }

  function inputHandler() {
    dropdownBlock.value = this.textContent
  }
  
  function getCurrentCity() {
    var address = citiesInfo[this.textContent].address
    var city = this.textContent
    setCurrentCity(city, address || 'уточняется')
  }

  function stopAllEvents(e) {
    e.stopPropagation()
  }

  function closeDropdown() {
    dropdownList.classList.remove('address__block-dropdown-list-active')
  }

  document.addEventListener('click', e => {
    if (e.target != dropdownBlock) {
      closeDropdown()
    }
  })

  dropdownBlock.addEventListener('click', toggleDropdownHandler)
  dropdownBlock.addEventListener('click', function() {dropdownBlock.value = ''})

  var citiesInfo = {}

  citiesArray
    .sort((a, b) => {
      return a.title > b.title ? 1 : -1
    })
    .forEach(item => {
      var cityEl = document.createElement('li')

      for (var i=0; i<item.dates.length; i++) {
        var currentCityValue = citiesInfo[item.title]
        var existingDaysOfWeek = currentCityValue && currentCityValue.daysOfWeek
        var currentDaysOfWeek = existingDaysOfWeek
          ? currentCityValue.daysOfWeek.concat([item.dates[i].day_of_week])
          : [item.dates[i].day_of_week]
        var existingRegistration = currentCityValue && currentCityValue.registration
        var currentRegistration = existingRegistration
          ? currentCityValue.registration.concat([item.dates[i].registration])
          : [item.dates[i].registration]
        var existingStart = currentCityValue && currentCityValue.start
        var currentStart = existingStart
          ? currentCityValue.start.concat([item.dates[i].start])
          : [item.dates[i].start]
        var existingEnd = currentCityValue && currentCityValue.end
        var currentEnd = existingEnd
          ? currentCityValue.end.concat([item.dates[i].end])
          : [item.dates[i].end]
        var existingDate = currentCityValue && currentCityValue.date
        var currentDate = existingDate
          ? currentCityValue.date.concat([item.dates[i].date])
          : [item.dates[i].date]

        if (item.title === 'Рязань') {
          const some = citiesInfo[item.title]
          const newValues = {
            daysOfWeek: currentDaysOfWeek,
            registration: currentRegistration,
            start: currentStart,
            end: currentEnd,
            date: currentDate
          }
        }
          
        citiesInfo[item.title] = currentCityValue
          ? Object.assign(currentCityValue, {
            daysOfWeek: currentDaysOfWeek,
            registration: currentRegistration,
            start: currentStart,
            end: currentEnd,
            date: currentDate
          })
          : {
            daysOfWeek: currentDaysOfWeek,
            registration: currentRegistration,
            start: currentStart,
            end: currentEnd,
            date: currentDate
          }
        citiesInfo[item.title]['address'] = item.address
        citiesInfo[item.title]['organizer'] = item.organizer
      }
      cityEl.textContent = item.title
      cityEl.className = 'address__block-dropdown-item' 
      addressWrapperEl.appendChild(cityEl)
    })
  dropdownList.textContent = ''
  dropdownList.appendChild(addressWrapperEl)

  var moscowRegExp = new RegExp('Москва', 'i')
  var moscowAddressItem = citiesArray.find(item =>
    item.title.match(moscowRegExp)
  )

  if (moscowAddressItem) {
    setCurrentCity(moscowAddressItem.title, moscowAddressItem.address)
    dropdownBlock.value = 'Москва'
    setDates.call({textContent: 'Москва'})
  }

  var dropdownItems = document.querySelectorAll('.address__block-dropdown-item')

  for (var i = 0; i < dropdownItems.length; i++) {
    var currentItem = dropdownItems[i]

    currentItem.addEventListener('click', inputHandler)
    currentItem.addEventListener('click', getOrganizer)
    currentItem.addEventListener('click', toggleDropdownHandler)
    currentItem.addEventListener('click', getCurrentCity)
    currentItem.addEventListener('click', setDates)
    currentItem.addEventListener('click', stopAllEvents)
  }

  function getOrganizer() {
    var organizerFullStr = citiesInfo[this.textContent].organizer
    var phoneRegex = /(\+?\d\s?(\-|\()?\d*(\-|\))?(\s)?\d*(\s|\-|)?\d*(\s|\-|)?\d*)/g
    var commaRegex = /,/
    var phone = organizerFullStr.match(phoneRegex)[0] || ''
    var organizer = organizerFullStr.replace(phoneRegex, '')

    organizer = organizer.replace(commaRegex, '')
    setOrganizer(phone, organizer || '')
  }

  function setOrganizer(phone, organizer) {
    phonePlaceEl.textContent = phone
    organizerPlaceEl.textContent = organizer

    var phoneLink = document.querySelector('.address-phone')
    phoneLink.href = 'tel:' + phone
    console.log(phoneLink)
    console.log(phoneLink.href)
  }

  function setDates() {
    var dateCells = document.querySelectorAll('.address-date')
    var weekDayCells = document.querySelectorAll('.address__table-weekday')
    var registrationCells = document.querySelectorAll('.address-registration')
    var startCells = document.querySelectorAll('.address-start')
    var endCells = document.querySelectorAll('.address-end')
    var tableEl = document.querySelector('.address__table')

    tableEl.classList.add('active')
    console.log(citiesInfo[this.textContent])
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 3; j++) {
        dateCells[j].textContent = citiesInfo[this.textContent].date[j] || '' 
        weekDayCells[j].textContent = citiesInfo[this.textContent].daysOfWeek[j] || ''
        registrationCells[j].textContent = citiesInfo[this.textContent].registration[j] || ''
        startCells[j].textContent = citiesInfo[this.textContent].start[j] || ''
        endCells[j].textContent = citiesInfo[this.textContent].end[j] || ''
      }
    }
  }


  function isMatching(full, chunk) {
    let cityRegExp = new RegExp(chunk, 'i')

    return cityRegExp.test(full)  
  }

  dropdownBlock.addEventListener('keyup', function() {
    if (dropdownBlock.value) {
      var citiesSearchResultObj = citiesArray.filter(item => isMatching(item.title, dropdownBlock.value))
      var citiesSearchResult = citiesSearchResultObj.map(item => item.title)
      dropdownList.innerHTML = ''
      citiesSearchResult.forEach(function(item) {
        var cityEl = document.createElement('li')
        cityEl.textContent = item
        cityEl.className = 'address__block-dropdown-item' 
        addressWrapperEl.appendChild(cityEl)
      })     
      dropdownList.textContent = ''
      dropdownList.appendChild(addressWrapperEl)
    }
  })
}

axios.get('https://likecentre.test//address?product=concentrat2&source=landing')
  .then(function (response) {
    var addresses = response.data.data
    if (Array.isArray(addresses) && addresses.length) {
      initDropdown(addresses)
    }
  })
  .catch(function (error) {
    console.log(error)
  })
