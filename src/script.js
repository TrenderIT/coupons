svg4everybody(); // иницализация полифила для IE

$(document).ready(function() {
  // вызов обрезания текста
  $('.card__link, .card__place').truncateText();
  // вызов обрезания текста
  $('.coupon-item__title').truncateText();

    setTimeout(function() {
        $('body').find('.card').removeClass('invisible');
        $('body').find('.coupon-preloader').removeClass('active');
        setTimeout(function () {
            $('body').find('.coupon-preloader').remove();
        },500);
    },500);

  // обрезание заголовков при ресайзе страницы
  $(window).bind('resize', function() {
      $('.card__link, .card__place, .coupon-item__title, .coupon-item__place').truncateText();
  });

  // Подстановка разметки в номера телефонов
  $(".coupon__contacts-phone").splitText();
  $(".coupon__address-meta-phone").splitText();

  // подключение автопоиск
  $('#pageHeaderSearch').autoSearch(3);
  //$('.modal-location__input').autoSearch(2);
  //$('.filter-near__search').autoSearch(2);

  $(".page-header__search-icon").click(function() {
    // показ строки поиска
    var doc_w = $(window).width();

    if (doc_w <= 768) {
      $("form.page-header__search").addClass("page-header__search--show").parent().parent().css("padding", 0);
      $(".page-header__input").attr({
        "placeholder": "Поиск",
        "autofocus": ""
      });
      $(".page-header__cancel").addClass("page-header__cancel--show");
      $(".page-header__submit").addClass("page-header__submit--show");
      $(".overlay").addClass("overlay--show").removeClass("site-overlay");

      $(".page-header__menu").toggle();
      $(".page-header__logo-wrap").toggle();
      $(".page-header__login").toggle();
    }
  });

  // показ строки поиска в мобильном меню
  $(document).mouseup(function(e) {
    const pageHeaderSearch = $(".page-header__search");
    const pageHeaderCancel = $(".page-header__cancel");
    var doc_w = $(window).width();

    if (doc_w <= 768) {

      if ((!pageHeaderSearch.is(e.target) && pageHeaderSearch.has(e.target).length === 0) || (pageHeaderCancel.is(e.target))) {
        $(".overlay").removeClass("overlay--show");
        $("form.page-header__search").removeClass("page-header__search--show").parent().parent().css("padding", "8px");
        $(".page-header__input").attr({
          "placeholder": "",
          "autofocus": ""
        })
        $(".page-header__cancel").removeClass("page-header__cancel--show");
        $(".page-header__submit").removeClass("page-header__submit--show");
        $(".overlay").removeClass("overlay--show").addClass("site-overlay").hide();

        $(".page-header__menu").show();
        $(".page-header__logo-wrap").show();
        $(".page-header__login").show();
      }
    }
  });

  // скрытие строки поиска в мобильном меню
  $(".page-header__cancel--show").click(function() {
    var doc_w = $(window).width();

    if (doc_w <= 768) {
      $(".overlay").removeClass("site-overlay");
      $("form.page-header__search").removeClass("page-header__search--show").parent().parent().css("padding", "8px");
      $(".page-header__input").attr({
        "placeholder": "",
        "autofocus": ""
      });
      $(".page-header__cancel").removeClass("page-header__cancel--show");
      $(".page-header__submit").removeClass("page-header__submit--show");
      $(".overlay").removeClass("overlay--show").addClass("site-overlay").hide();

      $(".page-header__menu").show();
      $(".page-header__logo-wrap").show();
      $(".page-header__login").show();
    }
  });

  // #onMapTab
  $('#onMapTab').on('shown.bs.tab', function() {
     $('.list-of-places__header').show();
     $('.filter__sort').hide();
  });
  // #byPlitkaTab
  $('#byPlitkaTab').on('shown.bs.tab', function() {
     $('.filter__sort').show();
  });
  // #byListTab
  $('#byListTab').on('shown.bs.tab', function() {
     $('.list-of-places__header').hide();
     $('.filter__sort').show();
  });

    $('.coupon__place-btn').click(function() {
        const addressTab = $('#addressTab');
        const id = addressTab.attr('href');
        const top = $(id).offset().top;
        addressTab.tab('show');

        $('body,html').animate({
            scrollTop: top
        }, 50);
    });

    // reviewtab
    $('.coupon-modal__btn').click(function() {
        const reviewtab = $('#reviewTab');
        const id = reviewtab.attr('href');
        const top = $(id).offset().top;
        reviewtab.tab('show');

        $('body,html').animate({
            scrollTop: top
        }, 50);
    });

    // filter-near скрытие блока
    $("body").scroll(function() {
        const filterNearDropdown = $(".filter-near__dropdown");

        if ( filterNearDropdown.hasClass("show") ) {
            filterNearDropdown.dropdown("toggle");
        }
    });

    // filter-near ввод значение
    $(".filter-near__submit").click(function() {
        const filterNearSearchValue = $(".filter-near__search").val();
        const filterNearLink = $(".filter-near__link").find("span");

        if ( filterNearSearchValue !== "" ) {
            filterNearLink.html(filterNearSearchValue);
        }
    });

    // Скрытый элементы списка collections
    $(".collections__toggle").html("Все подборки");

    $(".collections__toggle").click(function(e) {
        e.preventDefault();

        if ( !$(this).hasClass("collections__toggle--active") ) {
            $(this).html("Свернуть").addClass("collections__toggle--active");
            $(".collections__list--hide").slideToggle();
        } else {
            $(this).html("Все подборки").removeClass("collections__toggle--active");
            $(".collections__list--hide").slideToggle();
        }
    });

    // Скрытый блок текста coupon
    const couponToggle = $(".coupon__toggle");
    couponToggle.html("Читать далее");

    couponToggle.click(function(e) {
        e.preventDefault();

        if ( !$(this).hasClass("coupon__toggle--active") ) {
            $(this).html("Свернуть").addClass("coupon__toggle--active");
            $(".coupon__text--hide").slideToggle();
        } else {
            $(this).html("Читать далее").removeClass("coupon__toggle--active");
            $(".coupon__text--hide").slideToggle();
        }
    });


    /* рейтинг на запись */
    /* https://github.com/antennaio/jquery-bar-rating */
    $('.rating-bar').barrating({
        theme: 'fontawesome-stars',
        deselectable: false,
        showSelectedRating: true,
        allowEmpty: null
    });
    $('.rating-bar--readonly')
        .barrating('readonly', true)
        .barrating('set', 4); //только чтение


    /* слайдер купонов */
    $('.coupon-gallery__inner').slick({
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        variableWidth: true
    });


  // бесконечный скролл
  var ias = jQuery.ias({
    container:  '.js-scroll',
    item:       '.js-card',
    pagination: '.pagination',
    next:       '.pagination .pagination__item-next a'
  });

  ias.extension(new IASPagingExtension());
  ias.extension(new IASNoneLeftExtension());
  ias.extension(new IASHistoryExtension({
    prev: '.pagination a.prev'
  }));

  $('#byPlitka').on('click', '.load_posts_btn', function(){
      $('#couponList').append('<div class="js-card coupon-preloader active"><div class="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>');
      $.ias().next();
  });

  $('#byPlitka').on('click', '.pagination__link', function(){
      top = $('#byPlitka').offset().top;
      $('body,html').animate({
         scrollTop: top
      }, 500);
  });

  ias.on('ready', function() {
    $('.pagination').show();
  });

  ias.on('rendered', function() {
    $('.card__link, .card__place, .coupon-item__title, .coupon-item__place').truncateText();
    $('.pagination').show();

      setTimeout(function() {
          $('body').find('.card').removeClass('invisible');
          $('body').find('.coupon-preloader').removeClass('active');
          setTimeout(function () {
              $('body').find('.coupon-preloader').remove();
          },500);
      },100);

    $.pjax.reload({
          container: '#grid-pagination',
          fragment:  '#grid-pagination',
          /*type       : 'GET',
          url        : window.location.href,
          push       : true,
          replace    : false,
          timeout    : 1000,
          */
      });

  });

  ias.on('noneLeft', function() {
    $('.load_posts_btn').hide();
  });

  $(document).on('pjax:complete', function() {
      $('.card__link, .card__place, .coupon-item__title, .coupon-item__place').truncateText();
      jQuery.ias().reinitialize();
  });

    $(document).on('pjax:end', function() {
        setTimeout(function() {
            $('body').find('.card').removeClass('invisible');
            $('body').find('.coupon-preloader').removeClass('active');
            setTimeout(function () {
                $('body').find('.coupon-preloader').remove();
            },500);
        },100);
    });

/*
    jQuery.ias().on('pageChange', function(pageNum, scrollOffset, url) {
        console.log("page " + pageNum + '/ ' + scrollOffset + ' / url: '+ url);
    });
*/

});
