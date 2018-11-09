ymaps.ready(function () {

  // инициализируем экземпляры карт
  var mapSetup = {
    center: city_coordinates,
    zoom: 10,
    controls: []
  },
  couponMap = new ymaps.Map('couponMap', mapSetup),
  placeMap  = new ymaps.Map('placeMap', mapSetup);
  // задаем параметры контролов карты
  var zoomControl = new ymaps.control.ZoomControl({
    options: {
      position: {
        bottom: 55,
        left: 'auto',
        right: 20,
        top: 'auto'
      }
    }
  });
  couponMap.controls.add(zoomControl);
  placeMap.controls.add(zoomControl);


  // Задаем настройки менеджеров объектов
  var objectManagerSetup = {
    clusterize: true,
    gridSize: 50,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false,
    clusterDisableClickZoom: false,
    clusterIcons: [{
      href: '../img/map__cluster.svg',
      size: [44, 44],
      offset: [-22, -22]
    }],
    clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
      '<span style="color: #969696;">{{ properties.geoObjects.length }}</span>'
    ),
    clusterBalloonLeftColumnWidth: 155,
    balloonContentLayoutHeight: 400,
    balloonContentLayoutWidth: 400
  },
  couponObjectManager = new ymaps.ObjectManager(objectManagerSetup);
  placeObjectManager  = new ymaps.ObjectManager(objectManagerSetup);


  // задаем стили точкам и кластерам
  var pointSetup = {
        'iconLayout': 'default#image',
        'iconImageHref': '../img/map__placemark.svg',
        'iconImageSize': [44, 44],
        'iconImageOffset': [-22, -22]
      },
      pointHoverSetup = {
        'iconLayout': 'default#image',
        'iconImageHref': '../img/map__placemark_hovered.svg',
        'iconImageSize': [80, 80],
        'iconImageOffset': [-40, -40]
      },
      clusterSetup = {
        clusterIcons: [{
          href: '../img/map__cluster.svg',
          size: [44, 44],
          offset: [-22, -22]
        }],
        clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
          '<span style="color: #969696;">{{ properties.geoObjects.length }}</span>'
        )
      },
      clusterHoverSetup = {
        clusterIcons: [{
          href: '../img/map__cluster_hovered.svg',
          size: [80, 80],
          offset: [-40, -40]
        }],
        clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
          '<span style="color: #ff1e1e; font-weight: bold;">{{ properties.geoObjects.length }}</span>'
        )
      };

  couponObjectManager.objects.options.set(pointSetup);
  placeObjectManager.objects.options.set(pointSetup);

  // навешиваем события на точки и кластеры
  function onObjectEvent(e) {
    var objectId = e.get('objectId');

    if (e.get('type') == 'mouseenter') {
      couponObjectManager.objects.setObjectOptions(objectId, {
        'iconLayout': 'default#image',
        'iconImageHref': '../img/map__placemark_hovered.svg',
        'iconImageSize': [80, 80],
        'iconImageOffset': [-40, -40]
      });
    } else {
      couponObjectManager.objects.setObjectOptions(objectId, {
        'iconLayout': 'default#image',
        'iconImageHref': '../img/map__placemark.svg',
        'iconImageSize': [44, 44],
        'iconImageOffset': [-22, -22]
        });
    }
  }
    function onClusterEvent(e) {
        var objectId = e.get('objectId');

        if (e.get('type') == 'mouseenter') {
            couponObjectManager.clusters.setClusterOptions(objectId, clusterHoverSetup);
        } else {
            couponObjectManager.clusters.setClusterOptions(objectId, clusterSetup);
        }
    }
  couponObjectManager.objects.events.add(['mouseenter', 'mouseleave', 'click'], onObjectEvent);
  couponObjectManager.clusters.events.add(['mouseenter', 'mouseleave', 'click'], onClusterEvent);


  // навешиваем события на точки и кластеры
  function onObjectEvent2(e) {
    var objectId = e.get('objectId');

    if (e.get('type') == 'mouseenter') {
      placeObjectManager.objects.setObjectOptions(objectId, {
        'iconLayout': 'default#image',
        'iconImageHref': '../img/map__placemark_hovered.svg',
        'iconImageSize': [80, 80],
        'iconImageOffset': [-40, -40]
      });
    } else {
      placeObjectManager.objects.setObjectOptions(objectId, {
        'iconLayout': 'default#image',
        'iconImageHref': '../img/map__placemark.svg',
        'iconImageSize': [44, 44],
        'iconImageOffset': [-22, -22]
        });
    }
  }
  function onClusterEvent2(e) {
    var objectId = e.get('objectId');

    if (e.get('type') == 'mouseenter') {
      placeObjectManager.clusters.setClusterOptions(objectId, clusterHoverSetup);
    } else {
      placeObjectManager.clusters.setClusterOptions(objectId, clusterSetup);
    }
  }
  placeObjectManager.objects.events.add(['mouseenter', 'mouseleave', 'click'], onObjectEvent2);
  placeObjectManager.clusters.events.add(['mouseenter', 'mouseleave', 'click'], onClusterEvent2);


    // создаем текстовое меню
    function createMenuCoupon(item) {
        const menuCoupon = $('#couponMenu');
        item.features.forEach(item => {
            haveCoords = (item.geometry.coordinates) && (item.geometry.coordinates.length == 2) && (item.geometry.coordinates[0]>0) && (item.geometry.coordinates[1]>0);
            let menuItem = $(`<li><a class="menu__item" href="#" data-id="${item.id}" data-havecoords="${haveCoords}">${item.properties.clusterCaption}</a></li>`);
        menuItem.appendTo(menuCoupon);

        menuItem.click(function(e) {
            if (e.target.parentNode.dataset.havecoords === "true") {
                let objectId = e.target.parentNode.dataset.id;
                couponObjectManager.objects.balloon.open(objectId);
                let elem = $('#couponMap');
                if ((elem.offset().top < window.pageYOffset) || ((elem.offset().top + elem.innerHeight()) > (window.pageYOffset + document.documentElement.clientHeight) )) {
                  $('html, body').animate({  // Прокрутка до карты - карта внизу окна
                    scrollTop: elem.offset().top + elem.innerHeight() - document.documentElement.clientHeight
                  }, 500);
                }
            }
            e.preventDefault();
        });
    });
    }


    function createMenuPlace(item) {
        const menuPlace = $('#placeMenu');
        item.features.forEach(item => {
            haveCoords = (item.geometry.coordinates) && (item.geometry.coordinates.length == 2) && (item.geometry.coordinates[0]>0) && (item.geometry.coordinates[1]>0);
            let menuItem = $(`<li><a class="menu__item" href="#" data-id="${item.id}" data-havecoords="${haveCoords}">${item.properties.clusterCaption}</a></li>`);
            menuItem.appendTo(menuPlace);

            menuItem.click(function(e) {
                if (e.target.parentNode.dataset.havecoords === "true") {
                    let objectId = e.target.parentNode.dataset.id;
                    placeObjectManager.objects.balloon.open(objectId);
                    let elem = $('#placeMap');
                    if ((elem.offset().top < window.pageYOffset) || ((elem.offset().top + elem.innerHeight()) > (window.pageYOffset + document.documentElement.clientHeight) )) {
                      $('html, body').animate({  // Прокрутка до карты - карта внизу окна
                        scrollTop: elem.offset().top + elem.innerHeight() - document.documentElement.clientHeight
                      }, 500);
                    }
                }
                e.preventDefault();
            });
        });
    }


    // Подготовка данных для передачу в карту
    function coverCouponData(data) {
        data.features.forEach(item => {
            let saleContent,
                priceContent,
                timeContent,
                phoneContent,
                title,
                addressContent = '';
            let dataFeatures = item.properties.data;

            if ( dataFeatures.sale && dataFeatures.sale !== undefined ) {
                saleContent = `<span class='main-content__sale'>до <span>${dataFeatures.sale} %</span></span>`;
            } else {
                saleContent = '';
            }

            if ( dataFeatures.price && dataFeatures.price !== undefined ) {
                priceContent = `<span class='main-content__price'>от <span>${dataFeatures.price} руб.</span></span>`;
            } else {
                priceContent = '';
            }

            if (dataFeatures.title.length > 56) {
                title = dataFeatures.title.slice(0,56) + "...";
            } else {
                title = dataFeatures.title;
            }

            if ( dataFeatures.time && dataFeatures.time !== undefined ) {
                timeContent = `
                  <div class='main-content__address-meta'>
                    <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                    <span class='main-content__address-meta-desc'>${dataFeatures.time}</span>
                  </div>`;
            } else {
                timeContent = '';
            }

            if ( dataFeatures.phone && dataFeatures.phone !== undefined ) {
                phoneContent = `
                  <div class='main-content__address-meta'>
                    <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                    <span class='main-content__address-meta-desc'>${dataFeatures.phone}</span>
                  </div>`;
            } else {
                phoneContent = '';
            }

            if ( dataFeatures.address && dataFeatures.address !== undefined ) {
                addressContent = `
                  <div class='main-content__address-meta'>
                    <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                    <span class='main-content__address-meta-desc'>${dataFeatures.address}</span>
                  </div>`;
            } else {
                addressContent = '';
            }

            item.properties.balloonContentBody = `
              <div class='main-content__address-block'>
                <div class='main-content__address-img-wrap'>
                  <img class='main-content__address-img' src='${dataFeatures.imgUrl}' alt='img' width='212' height='88' />
                </div>
                ${saleContent}
                ${priceContent}
                <h2 class='main-content__address-title'>${title}</h2>
                <a class='btn main-content__address-btn' target='_blank' href='${dataFeatures.object_url}'>${coupon_button_balloon_title}</a>
                <a href='${dataFeatures.place_url}' class='main-content__address-title'>${dataFeatures.category}</a>
                ${timeContent}
                ${phoneContent}
                ${addressContent}
              </div>`;

            item.properties.clusterCaption = `<span class='main-content__address-item'>${item.properties.clusterCaption}</span>`;
        });

        return data;
    }


    function coverPlaceData(data) {
        data.features.forEach(item => {
            let timeContent,
                phoneContent,
                title,
                addressContent = '';
            let dataFeatures = item.properties.data;

            if (dataFeatures.title.length > 56) {
                title = dataFeatures.title.slice(0,56) + "...";
            } else {
                title = dataFeatures.title;
            }

            if ( dataFeatures.time ) {
                timeContent = `
                  <div class='main-content__address-meta'>
                    <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                    <span class='main-content__address-meta-desc'>${dataFeatures.time}</span>
                  </div>`;
            } else {
                timeContent = '';
            }

            if ( dataFeatures.phone ) {
                phoneContent = `
                  <div class='main-content__address-meta'>
                    <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                    <span class='main-content__address-meta-desc'>${dataFeatures.phone}</span>
                  </div>`;
            } else {
                phoneContent = '';
            }

            if ( dataFeatures.address ) {
                addressContent = `
                  <div class='main-content__address-meta'>
                    <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                    <span class='main-content__address-meta-desc'>${dataFeatures.address}</span>
                  </div>`;
            } else {
                addressContent = '';
            }

            item.properties.balloonContentBody = `
              <div class='main-content__address-block'>
                <div class='main-content__address-img-wrap'>
                  <img class='main-content__address-img' src='${dataFeatures.imgUrl}' alt='img' width='212' height='88' />
                </div>
                <h2 class='main-content__address-title'>${title}</h2>
                <a class='btn main-content__address-btn' href='${dataFeatures.object_url}'>Подробнее о месте</a>
                ${timeContent}
                ${phoneContent}
                ${addressContent}
              </div>`;

            item.clust = "test";
            item.properties.clusterCaption = `<span class='main-content__address-item'>${item.properties.clusterCaption}</span>`;
        });

        return data;
    }

    // Создание и заполнение селекта купона
    function selectBlockCoupon(data) {
        let selectBlock = $('#couponSelectBlock');
        let options = '';
        let selectBlockCouponContent = '';
        let dataFeatures = data.features[0].properties.data;
        let timeContent,
            phoneContent,
            addressContent = '';

        data.features.forEach(item => {
            options += `<option value="${item.id}">${item.properties.clusterCaption}</option>`
        });
        // time
        if (dataFeatures.time) {
            timeContent = `
              <div class='main-content__address-meta'>
                <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                <span class='main-content__address-meta-desc'>${dataFeatures.time}</span>
              </div>`;
        } else {
            timeContent = '';
        }

        // phone
        if (dataFeatures.phone) {
            phoneContent = `
              <div class='main-content__address-meta'>
                <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                <span class='main-content__address-meta-desc'>${dataFeatures.phone}</span>
              </div>`;
        } else {
            phoneContent = '';
        }

        // address
        if (dataFeatures.address) {
            addressContent = `
              <div class='main-content__address-meta'>
                <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                <span class='main-content__address-meta-desc'>${dataFeatures.address}</span>
              </div>`;
        } else {
            addressContent = '';
        }

        var display = "";
        if (typeof show_select_block === 'undefined') {
            display = "style = 'display: none'";
        }

        selectBlockCouponContent = `<span class='main-content__address-item' ${display}>Адреса</span>
            <div class='js-coupon-select-content' ${display}>
                <div class='main-content__input-group' ${display}>
                  <label class='main-content__label' for='point'></label>
                  <select class='main-content__select custom-select js-coupon-select_sel' id='point' name='point'>
                    ${options}
                  </select>
                </div>

                <h2 class='main-content__address-title'>${dataFeatures.title}</h2>
                <div class="main-content__sale-info">
                  <span class='main-content__price'>от <span>${dataFeatures.price}</span> руб.</span>
                  <span class='main-content__sale'>до ${dataFeatures.sale}%</span>
                </div>

                <a class='btn main-content__address-btn' href='${dataFeatures.object_url}'>Подробнее о купоне</a>
                <a href='#' class='main-content__address-title'>${dataFeatures.category}</a>
                <div class='js-time'>${timeContent}</div>
                <div class='js-phone'>${phoneContent}</div>
                <div class='js-address'>${addressContent}</div>
            </div>`;

        $(selectBlockCouponContent).appendTo(selectBlock);


        // Заполняем блок по изменению селекта
        $(".js-coupon-select_sel").change(function() {
            const objectId = Number($(".js-coupon-select_sel").val())

            data.features.forEach(item => {
                if ( item.id === objectId ) {

                    // Заполняем блок селекта
                    $("#selectBlock .main-content__sale span").html(item.properties.data.sale);
                    $("#selectBlock .main-content__price span").html(item.properties.data.price);
                    $("#selectBlock h2.main-content__address-title").html(item.properties.data.title);
                    $("#selectBlock a.main-content__address-btn").attr('href',item.properties.data.object_url);
                    $("#selectBlock a.main-content__address-title").html(item.properties.data.category);

                    if (item.properties.data.time) {
                        timeContent = `
                          <div class='main-content__address-meta'>
                            <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                            <span class='main-content__address-meta-desc'>${item.properties.data.time}</span>
                          </div>`;
                    } else {
                        timeContent = '';
                    }

                    $("#selectBlock .js-time").html(timeContent);

                    if (item.properties.data.phone) {
                        phoneContent = `
                          <div class='main-content__address-meta'>
                            <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                            <span class='main-content__address-meta-desc'>${item.properties.data.phone}</span>
                          </div>`;
                    } else {
                        phoneContent = '';
                    }

                    $("#selectBlock .js-phone").html(phoneContent);

                    if (item.properties.data.address) {
                        addressContent = `
                          <div class='main-content__address-meta'>
                            <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                            <span class='main-content__address-meta-desc'>${item.properties.data.address}</span>
                          </div>`;
                    } else {
                        addressContent = '';
                    }

                    $("#selectBlock .js-address").html(addressContent);

                    // центруем карту
                    couponMap.setCenter(item.geometry.coordinates, 12, {
                        checkZoomRange: true
                    });
                }

            });
        });
    }


    // Создание и заполнение селекта места
    function selectBlockPlace(data) {

        let selectBlock = $('#placeSelectBlock');
        let options = '';
        let selectBlockPlaceContent = '';
        let dataFeatures = data.features[0].properties.data;
        let timeContent,
            phoneContent,
            addressContent = '';

        data.features.forEach(item => {
            options += `<option value="${item.id}">${item.properties.clusterCaption}</option>`
        });

        // time
        if ( dataFeatures.time ) {
            timeContent = `
                <div class='main-content__address-meta'>
                  <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                  <span class='main-content__address-meta-desc js-time'>${dataFeatures.time}</span>
                </div>`;
        } else {
            timeContent = '';
        }

        // phone
        if ( dataFeatures.phone ) {
            phoneContent = `
                <div class='main-content__address-meta'>
                  <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                  <span class='main-content__address-meta-desc js-phone'>${dataFeatures.phone}</span>
                </div>`;
        } else {
            phoneContent = '';
        }

        // address
        if ( dataFeatures.address ) {
            addressContent = `
                <div class='main-content__address-meta'>
                  <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                  <span class='main-content__address-meta-desc js-address'>${dataFeatures.address}</span>
                </div>`;
        } else {
            addressContent = '';
        }

        var display = "";
        if (typeof show_select_block === 'undefined') {
            display = "style = 'display: none'";
        }

        selectBlockPlaceContent = `<span class='main-content__address-item' ${display}>Адреса</span>
            <div class='js-place-select-content' ${display}>
                <div class='main-content__input-group' ${display}>>
                  <label class='main-content__label' for='point'></label>
                  <select class='main-content__select custom-select js-place-select' id='point' name='point'>
                    ${options}
                  </select>
                </div>

                <h2 class='main-content__address-title'>${dataFeatures.title}</h2>

                <a class='btn main-content__address-btn' href='${dataFeatures.object_url}'>Подробнее о месте</a>
                ${timeContent}
                ${phoneContent}
                ${addressContent}
            </div>`;

        $(selectBlockPlaceContent).appendTo(selectBlock);

        // Заполняем блок по изменению селекта
        $('.js-place-select').change(function() {

            const objectId = Number($('.js-place-select').val())

            data.features.forEach(item => {

                if ( item.id === objectId ) {
                    $("#placeSelectBlock h2.main-content__address-title").html(item.properties.data.title);
                    $("#placeSelectBlock .js-time").html(item.properties.data.time);
                    $("#placeSelectBlock .js-phone").html(item.properties.data.phone);
                    $("#placeSelectBlock .js-address").html(item.properties.data.address);

                    // центруем карту
                    placeMap.setCenter(item.geometry.coordinates, 12, {
                        checkZoomRange: true
                    });
                }

            });
        });
    }

  if (typeof coupons_points_url !== 'undefined') {
      // вывод точек для couponMap на карту из json
      $.ajax({
          url: coupons_points_url
          //url: "https://api.myjson.com/bins/vvfw8"
          // url: "js/coupon.json"
      }).done(function(data) {
        var couponGroups = coverCouponData(data);
        couponObjectManager.add(couponGroups);
        createMenuCoupon(couponGroups);
        selectBlockCoupon(data);
        // if (typeof show_select_block !== 'undefined') {
        //     selectBlockCoupon(data);
        // }
      });
      couponMap.geoObjects.add(couponObjectManager);
  }


  if (typeof place_points_url !== 'undefined') {
      // вывод точек для placeMap на карту из json
      $.ajax({
          url: place_points_url
          //url: "https://api.myjson.com/bins/bkk60"
          // url: "js/place.json"
      }).done(function(data) {
          var placeGroups = coverPlaceData(data);
          placeObjectManager.add(placeGroups);
          createMenuPlace(placeGroups);
          selectBlockPlace(data);
          // if (typeof show_select_block !== 'undefined') {
          //     selectBlockPlace(data);
          // }
      });
      placeMap.geoObjects.add(placeObjectManager);
  }

    $('#first-level-category').change(function() {
      var category_id = $(this).val();
        placeMap.geoObjects.removeAll();
        placeObjectManager.removeAll();
      if (category_id % 1 == 0) {
          var place_points_url = '/places/get-points-by-category/'+category_id;
      } else {
          var place_points_url = '/places/get-all-points';
      }
      $.ajax({
          url: place_points_url
      }).done(function(data) {
          var placeGroups = coverPlaceData(data);
          placeObjectManager.add(placeGroups);
          createMenuPlace(placeGroups);
          //selectBlockPlace(data);
      });
      placeMap.geoObjects.add(placeObjectManager);
    });

    function clickPointEx(e, maptype) {
        if ((maptype != 1) && (maptype != 2)) { return;}

        var elem = e.get('target');
        var objectId = e.get('objectId');

        switch (maptype) {
            case 1:
                $('.js-coupon-select-content').show();
                $('.js-coupon-select_sel').val(objectId).change();
                break;
            case 2:
                $('.js-place-select-content').show();
                $('.js-place-select').val(objectId).change();
                break;
            default: ;
        }
    }
    function clickPointEx1 (e) { clickPointEx(e, 1); }
    function clickPointEx2 (e) { clickPointEx(e, 2); }
    function clickClusterEx(e) {
        return;
//console.log('cluster click', e);
        if (e.get('type') == 'click') {
            if (couponMap.getZoom() >= Math.max.apply(null,couponMap.zoomRange.getCurrent())) {
                var objectId = e.get('objectId');
                console.log(objectId);

                var elem = e.get('target');
//console.log(typeof elem.getGeoObjects);
//console.log(couponMap.objects.getGeoObjects(objectId));

                if (elem.getGeoObjects()) {
                    var points = elem.getGeoObjects();
                    points.forEach(element => {console.log(element);})
                }
//console.log('content', elem.content);
                //console.log('cluster objects',elem.properties.get('geoObjects'));
            }
        }
    }

    // запрет на открытие балунов
    $(window).bind('resize', function() {
        if ($(window).width() <= 576) {
            placeObjectManager.options.set('geoObjectOpenBalloonOnClick', false);
            couponObjectManager.options.set('geoObjectOpenBalloonOnClick', false);
            placeObjectManager.options.set('clusterOpenBalloonOnClick', false);
            couponObjectManager.options.set('clusterOpenBalloonOnClick', false);

            couponObjectManager.objects.events.add('click', clickPointEx1);
            placeObjectManager.objects.events.add('click', clickPointEx2);
            couponObjectManager.clusters.events.add('click', clickClusterEx);
            placeObjectManager.clusters.events.add('click', clickClusterEx);
        } else {
            placeObjectManager.options.set('geoObjectOpenBalloonOnClick', true);
            couponObjectManager.options.set('geoObjectOpenBalloonOnClick', true);
            placeObjectManager.options.set('clusterOpenBalloonOnClick', true);
            couponObjectManager.options.set('clusterOpenBalloonOnClick', true);

            couponObjectManager.objects.events.remove('click', clickPointEx1);
            placeObjectManager.objects.events.remove('click', clickPointEx2);
            couponObjectManager.clusters.events.remove('click', clickClusterEx);
            placeObjectManager.clusters.events.remove('click', clickClusterEx);
        }
    });
    $(window).trigger('resize');
});
