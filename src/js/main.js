(function ($) {
  // Document ready
  $(function () {
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
      $(".main-header .hamburger").addClass("is-active");

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
      $(".main-header .hamburger").removeClass("is-active");

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
    let headerStickyOffset = $(".main-header").innerHeight();
    if ($(".main-header").length) {
      if (window.pageYOffset > headerStickyOffset) {
        $(".main-header").addClass("sticky");
        $("body").css("padding-top", `${headerStickyOffset}px`);
      } else {
        $(".main-header").removeClass("sticky");
        $("body").css("padding-top", "");
      }
    }
    $(document).on("scroll", function () {
      if ($(".main-header").length) {
        if (window.pageYOffset > headerStickyOffset) {
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
  });
})(jQuery);

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
