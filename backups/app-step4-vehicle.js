(function(){

  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const header = $("#siteHeader");

  function updateHeader(){
    if(!header) return;

    if(window.scrollY > 20){
      header.classList.add("scrolled");
    }else{
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {passive:true});
  updateHeader();

  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  if(menuBtn && mobileMenu){
    menuBtn.addEventListener("click", function(){
      mobileMenu.classList.toggle("active");

      const expanded =
        mobileMenu.classList.contains("active");

      menuBtn.setAttribute(
        "aria-expanded",
        String(expanded)
      );
    });

    $$("#mobileMenu a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    });
  }

  const toast = $("#toast");
  const toastText = $("#toastText");
  let toastTimer;

  function showToast(message){
    if(!toast) return;

    if(toastText){
      toastText.textContent = message;
    }

    toast.classList.add("active");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("active");
    }, 2800);
  }

  const searchBtn = $("#searchBtn");
  const searchOverlay = $("#searchOverlay");
  const searchClose = $("#searchClose");
  const globalSearchInput = $("#globalSearchInput");
  const globalSearchButton = $("#globalSearchButton");
  const searchResult = $("#searchResult");

  function openSearch(){
    if(!searchOverlay) return;

    searchOverlay.classList.add("active");

    setTimeout(() => {
      if(globalSearchInput){
        globalSearchInput.focus();
      }
    }, 150);
  }

  function closeSearch(){
    if(!searchOverlay) return;

    searchOverlay.classList.remove("active");
  }

  if(searchBtn){
    searchBtn.addEventListener("click", openSearch);
  }

  if(searchClose){
    searchClose.addEventListener("click", closeSearch);
  }

  if(searchOverlay){
    searchOverlay.addEventListener("click", function(event){
      if(event.target === searchOverlay){
        closeSearch();
      }
    });
  }

  function performSearch(value){
    const query = String(value || "").trim();

    if(!query){
      if(searchResult){
        searchResult.textContent =
          "Type an insurance product or category to search.";
      }
      return;
    }

    const normalized = query.toLowerCase();

    const categories = [
      "vehicle insurance",
      "health insurance",
      "life insurance",
      "travel insurance",
      "home insurance",
      "personal insurance",
      "agriculture insurance",
      "business insurance"
    ];

    const match = categories.find(item =>
      item.includes(normalized) ||
      normalized.includes(item.replace(" insurance",""))
    );

    if(searchResult){
      searchResult.textContent = match
        ? `Insurance Hub found: ${match.replace(/\b\w/g,c => c.toUpperCase())}`
        : `Search received for “${query}”. Product matching will be connected in the next module.`;
    }
  }

  if(globalSearchButton){
    globalSearchButton.addEventListener("click", () => {
      performSearch(globalSearchInput?.value);
    });
  }

  if(globalSearchInput){
    globalSearchInput.addEventListener("keydown", event => {
      if(event.key === "Enter"){
        performSearch(globalSearchInput.value);
      }

      if(event.key === "Escape"){
        closeSearch();
      }
    });
  }

  $$("[data-search]").forEach(button => {
    button.addEventListener("click", () => {
      const value = button.dataset.search || "";

      if(globalSearchInput){
        globalSearchInput.value = value;
      }

      performSearch(value);
    });
  });

  const heroSearch = $("#heroSearch");
  const heroSearchButton = $("#heroSearchButton");

  function heroSearchAction(){
    const value = heroSearch?.value?.trim();

    if(!value){
      showToast("Please enter an insurance category.");
      return;
    }

    openSearch();

    if(globalSearchInput){
      globalSearchInput.value = value;
    }

    performSearch(value);
  }

  if(heroSearchButton){
    heroSearchButton.addEventListener(
      "click",
      heroSearchAction
    );
  }

  if(heroSearch){
    heroSearch.addEventListener("keydown", event => {
      if(event.key === "Enter"){
        heroSearchAction();
      }
    });
  }

  $$("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      if(heroSearch){
        heroSearch.value = category;
      }

      showToast(`${category} selected.`);

      const store =
        document.querySelector("#store");

      if(store){
        store.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });
      }
    });
  });

  const finderBtn = $("#finderBtn");

  if(finderBtn){
    finderBtn.addEventListener("click", () => {
      openSearch();

      if(globalSearchInput){
        globalSearchInput.placeholder =
          "Tell us what you want to protect...";
      }

      showToast("Smart Finder opened.");
    });
  }

  $$(".category-links button").forEach(button => {
    button.addEventListener("click", () => {
      showToast(
        `${button.textContent.trim()} selected.`
      );
    });
  });

  $$(".product-bottom button").forEach(button => {
    button.addEventListener("click", () => {
      showToast(
        "Product journey will open in the Insurance Store module."
      );
    });
  });

  $$('a[href="#"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      if(link.classList.contains("brand")){
        window.scrollTo({
          top:0,
          behavior:"smooth"
        });
        return;
      }

      showToast(
        "This feature will be connected in the next module."
      );
    });
  });

  document.addEventListener("keydown", event => {
    if(event.key === "Escape"){
      closeSearch();
      mobileMenu?.classList.remove("active");
    }
  });

  /* =========================================================
     INSURANCE STORE — PRODUCT INTERACTION
     ========================================================= */

  $$("[data-product]").forEach(button => {
    button.addEventListener("click", () => {

      const product = button.dataset.product || "";
      const card = button.closest("[data-insurance]");
      const category =
        card?.dataset.insurance || "Insurance";

      showToast(
        `${product} selected — ${category}`
      );

      if(heroSearch){
        heroSearch.value = product;
      }

      const store =
        document.querySelector("#store");

      if(store){
        store.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  $$("[data-insurance]").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("store-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("store-active");
    });
  });

  /* =========================================================
     VEHICLE INSURANCE — SELECTION FLOW
     ========================================================= */

  const vehicleOptions =
    $$("[data-vehicle-type]");

  const commercialTypes =
    $("#commercialTypes");

  const commercialClose =
    $("#commercialClose");

  const selectedVehicleText =
    $("#selectedVehicleText");

  const vehicleContinue =
    $("#vehicleContinue");

  let selectedVehicle = "";

  function selectVehicle(value){

    selectedVehicle = value;

    vehicleOptions.forEach(option => {
      option.classList.toggle(
        "selected",
        option.dataset.vehicleType === value
      );
    });

    if(selectedVehicleText){
      selectedVehicleText.textContent = value;
    }

    if(vehicleContinue){
      vehicleContinue.disabled = !value;
    }

    if(value === "Commercial Vehicle"){
      commercialTypes?.classList.add("active");
    }else{
      commercialTypes?.classList.remove("active");

      $$("[data-commercial-type]").forEach(button => {
        button.classList.remove("selected");
      });
    }
  }

  vehicleOptions.forEach(option => {

    option.addEventListener("click", () => {

      const value =
        option.dataset.vehicleType || "";

      selectVehicle(value);

      showToast(
        `${value} selected.`
      );

    });

  });


  $$("[data-commercial-type]").forEach(button => {

    button.addEventListener("click", () => {

      const type =
        button.dataset.commercialType || "";

      $$("[data-commercial-type]").forEach(item => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");

      selectedVehicle =
        `Commercial Vehicle — ${type}`;

      if(selectedVehicleText){
        selectedVehicleText.textContent =
          selectedVehicle;
      }

      if(vehicleContinue){
        vehicleContinue.disabled = false;
      }

      showToast(
        `${type} selected.`
      );

    });

  });


  if(commercialClose){

    commercialClose.addEventListener(
      "click",
      () => {

        commercialTypes?.classList.remove("active");

        $$("[data-commercial-type]").forEach(button => {
          button.classList.remove("selected");
        });

        selectVehicle("");

        showToast(
          "Commercial vehicle selection closed."
        );

      }
    );

  }


  if(vehicleContinue){

    vehicleContinue.addEventListener(
      "click",
      () => {

        if(!selectedVehicle){
          showToast(
            "Please select a vehicle type first."
          );
          return;
        }

        showToast(
          `${selectedVehicle} — Vehicle details will open in the next step.`
        );

      }
    );

  }

})();
