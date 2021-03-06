ymaps.ready(function () {

    defaultMapZoomOnSelectorChange = 12;
    currentMapZoomOnSelectorChange = defaultMapZoomOnSelectorChange;
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

//            item.clust = "test";
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

        if (data.features.length <= 1) show_select_block = undefined;

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

                <div class="js-single-block">
                    <a href='${dataFeatures.object_url}'><h2 class='main-content__address-title'>${dataFeatures.title}</h2></a>
                    <div class="main-content__sale-info">
                      <span class='main-content__price'>от <span>${dataFeatures.price}</span> руб.</span>
                      <span class='main-content__sale'>до ${dataFeatures.sale}%</span>
                    </div>

                    <a class='btn main-content__address-btn' href='${dataFeatures.object_url}'>Подробнее о купоне</a>
                    <a href='#' class='main-content__address-title'>${dataFeatures.category}</a>
                    <div class='js-time'>${timeContent}</div>
                    <div class='js-phone'>${phoneContent}</div>
                    <div class='js-address'>${addressContent}</div>
                </div>
                <div class="js-multi-block">

                </div>
            </div>`;

        $(selectBlockCouponContent).appendTo(selectBlock);


        // Заполняем блок по изменению селекта
        $(".js-coupon-select_sel").change(function() {
            const objectId = Number($(".js-coupon-select_sel").val())

            data.features.forEach(item => {
                if ( item.id === objectId ) {

                    // Заполняем блок селекта
                    $("#couponSelectBlock .main-content__sale span").html(item.properties.data.sale);
                    $("#couponSelectBlock .main-content__price span").html(item.properties.data.price);
                    $("#couponSelectBlock h2.main-content__address-title").html(item.properties.data.title);
                    $("#couponSelectBlock a.main-content__address-btn").attr('href',item.properties.data.object_url);
                    $("#couponSelectBlock a.main-content__address-title").html(item.properties.data.category);

                    if (item.properties.data.time) {
                        timeContent = `
                          <div class='main-content__address-meta'>
                            <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                            <span class='main-content__address-meta-desc'>${item.properties.data.time}</span>
                          </div>`;
                    } else {
                        timeContent = '';
                    }

                    $("#couponSelectBlock .js-time").html(timeContent);

                    if (item.properties.data.phone) {
                        phoneContent = `
                          <div class='main-content__address-meta'>
                            <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                            <span class='main-content__address-meta-desc'>${item.properties.data.phone}</span>
                          </div>`;
                    } else {
                        phoneContent = '';
                    }

                    $("#couponSelectBlock .js-phone").html(phoneContent);

                    if (item.properties.data.address) {
                        addressContent = `
                          <div class='main-content__address-meta'>
                            <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                            <span class='main-content__address-meta-desc'>${item.properties.data.address}</span>
                          </div>`;
                    } else {
                        addressContent = '';
                    }

                    $("#couponSelectBlock .js-address").html(addressContent);

                    // центруем карту
                    couponMap.setCenter(item.geometry.coordinates, currentMapZoomOnSelectorChange, {
                        checkZoomRange: true
                    });
                    currentMapZoomOnSelectorChange = defaultMapZoomOnSelectorChange;
                }

            });
            $('.js-single-block').css('display', 'block');
            $('.js-multi-block').css('display', 'none');
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

        if (data.features.length <= 1) show_select_block = undefined;

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

                <div class="js-single-block">

                    <a href='${dataFeatures.object_url}'><h2 class='main-content__address-title'>${dataFeatures.title}</h2></a>

                    <a class='btn main-content__address-btn' href='${dataFeatures.object_url}'>Подробнее о месте</a>
                    ${timeContent}
                    ${phoneContent}
                    ${addressContent}
                </div>
                <div class="js-multi-block">
                </div>
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
                    placeMap.setCenter(item.geometry.coordinates, currentMapZoomOnSelectorChange, {
                        checkZoomRange: true
                    });
                    currentMapZoomOnSelectorChange = defaultMapZoomOnSelectorChange;
                }
            });
            $('.js-single-block').css('display', 'block');
            $('.js-multi-block').css('display', 'none');
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
          console.log(placeGroups);
          placeObjectManager.add(placeGroups);
          createMenuPlace(placeGroups);
          selectBlockPlace(data);
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
    function clickClusterEx(e, maptype) {
        if (e.get('type') == 'click') {
            var objectId = e.get('objectId');
            switch (maptype) {
                case 1:
                    vmap = couponMap;
                    selectContent = '.js-coupon-select-content';
                    selectType = '.js-coupon-select_sel';
                    mContent = '#couponSelectBlock .js-multi-block';

                    content = '';

                    console.log();

                    objs = vmap.geoObjects.get(0).clusters.getById(objectId).features;

                    objs.forEach(function(item, i, arr) {
                        ldata = item.properties.data;
                        // time
                        if (ldata.time) {
                            timeContent = `
                              <div class='main-content__address-meta'>
                                <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                                <span class='main-content__address-meta-desc'>${ldata.time}</span>
                              </div>`
                        } else {
                            timeContent = '';
                        }

                        // phone
                        if (ldata.phone) {
                            phoneContent = `
                                <div class='main-content__address-meta'>
                                    <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                                    <span class='main-content__address-meta-desc'>${ldata.phone}</span>
                                </div>`;
                        } else {
                            phoneContent = '';
                        }

                        // address
                        if (ldata.address) {
                            addressContent = `
                            <div class='main-content__address-meta'>
                                <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                                <span class='main-content__address-meta-desc'>${ldata.address}</span>
                            </div>`;
                        } else {
                            addressContent = '';
                        }

                        if (content.length > 10) {
                            hr = '<hr style="margin: 40px 0;">';
                        } else {
                            hr = '';
                        }

                        content += `
                            ${hr}
                            <a href='${ldata.object_url}'><h2 class='main-content__address-title'>${ldata.title}</h2></a>
                            <div class="main-content__sale-info">
                                <span class='main-content__price'>от <span>${ldata.price}</span> руб.</span>
                                <span class='main-content__sale'>до ${ldata.sale}%</span>
                            </div>

                            <a class='btn main-content__address-btn' href='${ldata.object_url}'>Подробнее о купоне</a>
                            <a href='#' class='main-content__address-title'>${ldata.category}</a>
                            <div class='js-time'>${timeContent}</div>
                            <div class='js-phone'>${phoneContent}</div>
                            <div class='js-address'>${addressContent}</div>
                        `;
                    });
                    break;
                case 2:
                    vmap = placeMap;
                    selectContent = '.js-place-select-content';
                    selectType = '.js-place-select';

                    mContent = '#placeSelectBlock .js-multi-block';

                    content = '';

                    objs = vmap.geoObjects.get(0).clusters.getById(objectId).features;

                    objs.forEach(function(item, i, arr) {
                        console.log(i);
                        ldata = item.properties.data;

                        // time
                        if ( ldata.time ) {
                            timeContent = `
                                <div class='main-content__address-meta'>
                                  <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-clock-icon'></use></svg>
                                  <span class='main-content__address-meta-desc js-time'>${ldata.time}</span>
                                </div>`;
                        } else {
                            timeContent = '';
                        }

                        // phone
                        if ( ldata.phone ) {
                            phoneContent = `
                                <div class='main-content__address-meta'>
                                  <svg class='main-content__address-meta-icon' width='14' height='14'><use xlink:href='/img/sprite-svg.svg#coupon__address-phone-icon'></use></svg>
                                  <span class='main-content__address-meta-desc js-phone'>${ldata.phone}</span>
                                </div>`;
                        } else {
                            phoneContent = '';
                        }

                        // address
                        if ( ldata.address ) {
                            addressContent = `
                                <div class='main-content__address-meta'>
                                  <svg class='main-content__address-meta-icon' width='13' height='18'><use xlink:href='/img/sprite-svg.svg#coupon__address-map-icon'></use></svg>
                                  <span class='main-content__address-meta-desc js-address'>${ldata.address}</span>
                                </div>`;
                        } else {
                            addressContent = '';
                        }

                        if (content.length > 10) {
                            hr = '<hr style="margin: 40px 0;">';
                        } else {
                            hr = '';
                        }

                        content += `
                            ${hr}
                            <a href='${ldata.object_url}'><h2 class='main-content__address-title'>${ldata.title}</h2></a>
                            <a class='btn main-content__address-btn' href='${ldata.object_url}'>Подробнее о месте</a>
                            ${timeContent}
                            ${phoneContent}
                            ${addressContent}
                        `;
                    });
                    break;
                default:
                    exit;
            }
            if (vmap.getZoom() >= Math.max.apply(null,vmap.zoomRange.getCurrent())) {
                pointId = vmap.geoObjects.get(0).clusters.getById(objectId).features[0].id;
                $(selectContent).show();
                currentMapZoomOnSelectorChange = vmap.getZoom();
                $(selectType).val(pointId).change();
                console.log(vmap.geoObjects.get(0).clusters.getById(objectId).features);
                $(mContent).html(content);
                $('.js-single-block').css('display', 'none');
                $('.js-multi-block').css('display', 'block');
            }
        }
    }
    function clickClusterEx1(e) { clickClusterEx(e, 1); }
    function clickClusterEx2(e) { clickClusterEx(e, 2); }

    // запрет на открытие балунов
    $(window).bind('resize', function() {
        if ($(window).width() <= 576) {
            placeObjectManager.options.set('geoObjectOpenBalloonOnClick', false);
            couponObjectManager.options.set('geoObjectOpenBalloonOnClick', false);
            placeObjectManager.options.set('clusterOpenBalloonOnClick', false);
            couponObjectManager.options.set('clusterOpenBalloonOnClick', false);

            couponObjectManager.objects.events.add('click', clickPointEx1);
            placeObjectManager.objects.events.add('click', clickPointEx2);
            couponObjectManager.clusters.events.add('click', clickClusterEx1);
            placeObjectManager.clusters.events.add('click', clickClusterEx2);
        } else {
            placeObjectManager.options.set('geoObjectOpenBalloonOnClick', true);
            couponObjectManager.options.set('geoObjectOpenBalloonOnClick', true);
            placeObjectManager.options.set('clusterOpenBalloonOnClick', true);
            couponObjectManager.options.set('clusterOpenBalloonOnClick', true);

            couponObjectManager.objects.events.remove('click', clickPointEx1);
            placeObjectManager.objects.events.remove('click', clickPointEx2);
            couponObjectManager.clusters.events.remove('click', clickClusterEx1);
            placeObjectManager.clusters.events.remove('click', clickClusterEx2);
        }
    });
    $(window).trigger('resize');

    $(document).on('keydown', function(e){
        if (e.key == 'Escape') {
            couponMap.balloon.close();
            placeMap.balloon.close();
        }
    });
});
