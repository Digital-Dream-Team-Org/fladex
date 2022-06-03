(function ($) {
  // Document ready
  $(function () {
    // Ajax form submit / Аякс форма настраивается тут
    $(".ajax-contact-form").on("submit", function (e) {
      e.preventDefault();
      const url = $(this).attr("action");
      const method = $(this).attr("method");
      const dataType = $(this).data("type") || null;
      const serializedArray = $(this).serializeArray();
      const self = $(this);

      let requestObj = {};
      serializedArray.forEach((item) => {
        requestObj[item.name] = item.value;
      });

      // google recaptcha
      grecaptcha.ready(function() {
        grecaptcha.execute('6LeLCZYdAAAAAJQ7Nu7U70KEDklSNmcXJICEIyXQ', {action: 'submit'}).then(function(token) {
          // Add your logic to submit to your backend server here.
          $.ajax({
            url,
            type: method,
            dataType: dataType,
            data: {
              ...requestObj,
              inputToken: token,
              // action: "ajaxForm",
              // serialized,
            },
            success: function (data) {
              // Clear inputs
              self.find("input, textarea").val("");
    
              // Open thanks popup
              openSuccessPopup();
            },
            error: function (data) {
              // Basic error handling
              alert("Ошибка, повторите позднее");
              console.error(data);
            },
          });
          fbq('track', 'Lead');
        });
      });
    });

    // $(".ajax-contact-form").on("submit", function (e) {
    //   e.preventDefault();
    //   const url = $(this).attr("action");
    //   const method = $(this).attr("method");
    //   const dataType = $(this).data("type") || null;
    //   const serializedArray = $(this).serializeArray();
    //   const self = $(this);

    //   let requestObj = {};
    //   serializedArray.forEach((item) => {
    //     requestObj[item.name] = item.value;
    //   });

    //   $.ajax({
    //     url,
    //     type: method,
    //     dataType: dataType,
    //     data: {
    //       ...requestObj,
    //       // action: "ajaxForm",
    //       // serialized,
    //     },
    //     success: function (data) {
    //       // Clear inputs
    //       self.find("input, textarea").val("");

    //       // Open thanks popup
    //       openSuccessPopup();
    //     },
    //     error: function (data) {
    //       // Basic error handling
    //       alert("Ошибка, повторите позднее");
    //       console.error(data);
    //     },
    //   });
    // });

    // popups
    // contact popup
    $(".open-contact-popup").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("overflow-hidden");
      $("#contactPopup").addClass("active");
    });

    // success popup
    function openSuccessPopup() {
      $(".overlay-cdk").removeClass("active");

      $("body").addClass("overflow-hidden");
      $("#successPopup").addClass("active");
    }

    // Close overlay on outside click
    $(".overlay-cdk").on("click", function (e) {
      if (e.target !== e.currentTarget) return;

      $(this).removeClass("active");
      $("body").removeClass("overflow-hidden");
    });

    // Close overlay on button click
    $(".overlay-cdk__close-btn").on("click", function (e) {
      $(".overlay-cdk").removeClass("active");
      $("body").removeClass("overflow-hidden");
    });

    // timeline
    // set extra height for content
    if ($(".dd-timeline").length) {
      $(".dd-timeline").each(function () {
        let maxH = 0;
        $(this)
          .find(".dd-timeline__item")
          .each(function () {
            let h = $(this).find(".dd-timeline__item-content-wrap").height();
            if (h > maxH) {
              maxH = h;
            }
          });
        let fullH = maxH + 80; // 50 is ::after line height + extra space
        $(this).css({
          "padding-top": `${fullH}px`,
          "padding-bottom": `${fullH}px`,
        });
      });
    }
    // play animation
    $(window).on("scroll", function () {
      if ($(".dd-timeline").length) {
        $(".dd-timeline").each(function () {
          if (isInViewport($(this)[0]) && !$(this).hasClass("animated")) {
            $(this).addClass("animated");
            let items = $(this).find(".dd-timeline__item");
            items.each(function (index) {
              setTimeout(() => {
                $(this).addClass("active");

                $(this).find(".dd-timeline__item-content-line").css({
                  opacity: 0,
                  height: 0,
                  transition: "400ms ease-in-out",
                });
                setTimeout(() => {
                  $(this).find(".dd-timeline__item-content-line").css({
                    opacity: 1,
                    height: "50px",
                    transition: "400ms ease-in-out",
                  });
                }, 100);

                // even
                if (index % 2 === 0) {
                  $(this).find(".dd-timeline__item-content").css({
                    opacity: 0,
                    transform: "translateY(50px)",
                    transition: "400ms ease-in-out",
                  });

                  setTimeout(() => {
                    $(this).find(".dd-timeline__item-content").css({
                      opacity: 1,
                      transform: "translateY(0)",
                    });
                  }, 250);
                }
                // odd
                else {
                  $(this).find(".dd-timeline__item-content").css({
                    opacity: 0,
                    transform: "translateY(-50px)",
                    transition: "400ms ease-in-out",
                  });

                  setTimeout(() => {
                    $(this).find(".dd-timeline__item-content").css({
                      opacity: 1,
                      transform: "translateY(0)",
                    });
                  }, 250);
                }
              }, 500 * index);
            });
          }
        });
      }
    });

    const isInViewport = function (ele) {
      const rect = ele.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    if ($(".dd-timeline").length) {
      let timelinePos = { top: 0, left: 0, x: 0, y: 0 };

      const timelineEle = document.getElementsByClassName("dd-timeline")[0];
      timelineEle.style.cursor = "grab";

      const mouseDownHandler = function (e) {
        timelineEle.style.cursor = "grabbing";
        timelineEle.style.userSelect = "none";

        let clientX = 0;
        let clientY = 0;

        if (isTouchDevice()) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = clientY;
        }

        timelinePos = {
          // The current scroll
          left: timelineEle.scrollLeft,
          top: timelineEle.scrollTop,
          // Get the current mouse position
          x: clientX,
          y: clientY,
        };

        if (isTouchDevice()) {
          document.addEventListener("touchmove", mouseMoveHandler);
          document.addEventListener("touchend", mouseUpHandler);
        } else {
          document.addEventListener("mousemove", mouseMoveHandler);
          document.addEventListener("mouseup", mouseUpHandler);
        }
      };

      const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        let dx = 0;
        let dy = 0;

        if (isTouchDevice()) {
          dx = e.touches[0].clientX - timelinePos.x;
          dy = e.touches[0].clientY - timelinePos.y;
        } else {
          dx = e.clientX - timelinePos.x;
          dy = e.clientY - timelinePos.y;
        }

        // Scroll the element
        timelineEle.scrollTop = timelinePos.top - dy;
        timelineEle.scrollLeft = timelinePos.left - dx;
      };
      const mouseUpHandler = function () {
        if (isTouchDevice()) {
          document.removeEventListener("touchmove", mouseMoveHandler);
          document.removeEventListener("touchend", mouseUpHandler);
        } else {
          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
        }

        timelineEle.style.cursor = "grab";
        timelineEle.style.removeProperty("user-select");
      };

      // Attach the handler
      if (isTouchDevice()) {
        timelineEle.addEventListener("touchstart", mouseDownHandler);
      } else {
        timelineEle.addEventListener("mousedown", mouseDownHandler);
      }

      $(window).on("resize", function () {
        timelineEle.removeEventListener("touchstart", mouseDownHandler);
        timelineEle.removeEventListener("mousedown", mouseDownHandler);

        if (isTouchDevice()) {
          timelineEle.addEventListener("touchstart", mouseDownHandler);
        } else {
          timelineEle.addEventListener("mousedown", mouseDownHandler);
        }
      });
    }

    // Out of bound timeline container
    let containerToRight =
      $(window).outerWidth(true) -
      ($(".container").offset().left + $(".container").outerWidth() - 0);
    $(".out-of-bound-tl").css("margin-right", `-${containerToRight}px`);
    $(".out-of-bound-tl").css("margin-left", `-${containerToRight}px`);
    $(".out-of-bound-tl .dd-timeline").css(
      "padding-left",
      `${containerToRight}px`,
    );
    $(window).on("resize", function () {
      containerToRight =
        $(window).outerWidth(true) -
        ($(".container").offset().left + $(".container").outerWidth() - 0);

      $(".out-of-bound-tl").css("margin-right", `-${containerToRight}px`);
      $(".out-of-bound-tl").css("margin-left", `-${containerToRight}px`);
      $(".out-of-bound-tl .dd-timeline").css(
        "padding-left",
        `${containerToRight}px`,
      );
    });

    // Toggle mobile sliderbar
    $(".toggle-mobile-slidebar").on("click", function () {
      $("#slidebarContainer").addClass("active");
      $("body").addClass("overflow-hidden");
      // $(".main-header .hamburger").addClass("is-active");

      $("#slidebarContainer").css({
        transition: 0,
        transform: "translateX(-300px)",
      });
      setTimeout(() => {
        $("#slidebarContainer").css({
          transition: "400ms",
          transform: "translateX(0)",
        });
      }, 0);
    });
    $(".close-mobile-slidebar").on("click", function (e) {
      closeSlidebar();
    });
    $(".main-header__mobile-slidebar-wrap").on("click", function (e) {
      if (e.target !== e.currentTarget) return;

      closeSlidebar();
    });
    function closeSlidebar() {
      // $(".main-header .hamburger").removeClass("is-active");

      $("#slidebarContainer").css({
        transition: "400ms",
        transform: "translateX(-300px)",
      });

      setTimeout(() => {
        $("#slidebarContainer").removeClass("active");
        $("body").removeClass("overflow-hidden");
      }, 400);
    }

    // sticky header
    let stickyExtraOffset = 60;
    let headerStickyOffset = $(".main-header").innerHeight();
    if ($(".main-header").length) {
      if (window.pageYOffset > headerStickyOffset - stickyExtraOffset) {
        $(".main-header").addClass("sticky");
        $("body").css("padding-top", `${headerStickyOffset}px`);
      } else {
        $(".main-header").removeClass("sticky");
        $("body").css("padding-top", "");
      }
    }
    $(document).on("scroll", function () {
      if ($(".main-header").length) {
        if (window.pageYOffset > headerStickyOffset - stickyExtraOffset) {
          $(".main-header").addClass("sticky");
          $("body").css("padding-top", `${headerStickyOffset}px`);
        } else {
          $(".main-header").removeClass("sticky");
          $("body").css("padding-top", "");
        }
      }
    });

    // scroll to top
    $(".main-footer__scroll-btn").on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 400, "swing");
    });

    // switch footer style
    if ($(".main-content--alt").length) {
      $(".main-footer").addClass("main-footer--alt");
    }

    // enable swiper
    if ($(".content-swiper").length) {
      $(".content-swiper").each(function () {
        const slidesPerViewLg = $(this).data("slides-per-view-lg");

        const arrowPrev = $(this)
          .closest(".content-swiper-wrap")
          .find(".swiper-custom-btn-prev")[0];

        const arrowNext = $(this)
          .closest(".content-swiper-wrap")
          .find(".swiper-custom-btn-next")[0];

        new Swiper($(this)[0], {
          navigation: {
            nextEl: arrowNext,
            prevEl: arrowPrev,
          },
          slidesPerView: "auto",
          spaceBetween: 16,
          freeMode: false,
          updateOnWindowResize: true,
          breakpoints: {
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: slidesPerViewLg,
            },
          },
        });
      });
    }

    // Mouse follow animated avatar
    var s_mft_timesPerSecond = 100; // how many times to fire the event per second
    var s_mft_wait = false;
    if ($(".mouse-follow-target-sprite").length) {
      $(document).on("mousemove", function (e) {
        if (!s_mft_wait) {
          let $el = $(".mouse-follow-target-sprite");

          if (!isInViewport($el[0])) {
            return;
          }

          let width = $el.width();
          let height = $el.height();
          let width_half = width / 2;
          let height_half = height / 2;

          let rect = $el[0].getBoundingClientRect();
          let x = e.clientX - rect.left - width_half; //x position within the element.
          let y = e.clientY - rect.top - height_half; //y position within the element.

          // 0=0, 000=1, 2=2, 3=3, 4=4, 6=5, 7=6, 9=7, 10=8, 12=9

          if (x >= -width_half && x <= width_half && y <= -height_half) {
            // up

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 9}px 0px`);
          } else if (x >= width_half && y <= -height_half) {
            // up-right

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 2}px 0px`);
          } else if (x >= width_half && y >= -height_half && y <= height_half) {
            // right

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 3}px 0px`);
          } else if (x >= width_half && y >= height_half) {
            // bottom-right

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 4}px 0px`);
          } else if (x >= -width_half && x <= width_half && y >= height_half) {
            // bottom

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 5}px 0px`);
          } else if (x <= -width_half && y >= height_half) {
            // bottom-left

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 6}px 0px`);
          } else if (
            x <= -width_half &&
            y >= -height_half &&
            y <= height_half
          ) {
            // left

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 7}px 0px`);
          } else if (x <= -width_half && y <= -height_half) {
            // up-left

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 8}px 0px`);
          } else {
            // hover

            $(".mouse-follow-target-sprite__inner img").css('object-position', `-${width * 1}px 0px`);
          }

          s_mft_wait = true;
          // after a fraction of a second, allow events again
          setTimeout(function () {
            s_mft_wait = false;
          }, 1000 / s_mft_timesPerSecond);
        }
      });
    }

    // Random logo animation
    let logoAnimationLock = false;
    let logoAnimations = [
      "logo-animation-13",
      "logo-animation-12",
      "logo-animation-11",
      "logo-animation-10",
      "logo-animation-9",
      "logo-animation-8",
      "logo-animation-7",
      "logo-animation-6",
      "logo-animation-5",
      "logo-animation-4",
      "logo-animation-3",
      "logo-animation-2",
      "logo-animation-1",
    ];
    if ($(".logo-animation-random").length) {
      $(".logo-animation-random").each(function () {
        const randomAnimation =
          logoAnimations[Math.floor(Math.random() * logoAnimations.length)];
        $(this).addClass(randomAnimation);
      });
    }

    let larStep = 0;
    let larInterval = null;
    $(".logo-animation-random").on("mouseleave", function () {
      if (logoAnimationLock) {
        return;
      }

      logoAnimationLock = true;
      larInterval = setInterval(() => {
        larStep += 100;

        if (larStep >= 800) {
          clearInterval(larInterval);
          larInterval = null;

          logoAnimations.forEach((item) => {
            $(this).removeClass(item);
          });

          setTimeout(() => {
            const randomAnimation =
              logoAnimations[Math.floor(Math.random() * logoAnimations.length)];
            $(this).addClass(randomAnimation);
          }, 50);

          logoAnimationLock = false;
        }
      }, 25);
    });
    $(".logo-animation-random").on("mouseenter", function () {
      if (logoAnimationLock) {
        clearInterval(larInterval);
        larInterval = null;
        logoAnimationLock = false;
      }
    });
  });

  // Service accordion
  $('.collapse-toggle-wrap--open a').on('click', function() {
    $('.collapse-toggle-wrap--open').addClass('d-none');
    $('.collapse-toggle-wrap--close').removeClass('d-none')
  })
  $('.collapse-toggle-wrap--close a').on('click', function() {
    $('.collapse-toggle-wrap--close').addClass('d-none');
    $('.collapse-toggle-wrap--open').removeClass('d-none')
  })
})(jQuery);

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
