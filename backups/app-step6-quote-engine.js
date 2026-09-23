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

  /* =========================================================
     VEHICLE DETAILS FORM — VALIDATION FLOW
     ========================================================= */

  const vehicleDetailsForm =
    $("#vehicleDetailsForm");

  const vehicleDetailsSection =
    $("#vehicle-details");

  const vehicleDetailsSubmit =
    $("#vehicleDetailsSubmit");

  const vehicleDetailsFields =
    vehicleDetailsForm
      ? $$("input, select", vehicleDetailsForm)
      : [];

  function openVehicleDetailsForm(){

    if(!vehicleDetailsSection){
      showToast(
        "Vehicle details section is unavailable."
      );
      return;
    }

    vehicleDetailsSection.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

    setTimeout(() => {

      const firstField =
        $("#registrationNo");

      if(firstField){
        firstField.focus();
      }

    }, 650);

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
          `${selectedVehicle} selected. Enter vehicle details.`
        );

        openVehicleDetailsForm();

      }
    );

  }


  function clearFieldError(field){

    if(!field){
      return;
    }

    field.classList.remove(
      "field-error"
    );

    field.removeAttribute(
      "aria-invalid"
    );

  }


  function markFieldError(field){

    if(!field){
      return;
    }

    field.classList.add(
      "field-error"
    );

    field.setAttribute(
      "aria-invalid",
      "true"
    );

  }


  vehicleDetailsFields.forEach(field => {

    field.addEventListener(
      "input",
      () => clearFieldError(field)
    );

    field.addEventListener(
      "change",
      () => clearFieldError(field)
    );

  });


  if(vehicleDetailsForm){

    vehicleDetailsForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        let firstInvalid = null;

        vehicleDetailsFields.forEach(field => {

          clearFieldError(field);

          if(
            field.required &&
            !field.value.trim()
          ){

            markFieldError(field);

            if(!firstInvalid){
              firstInvalid = field;
            }

          }

        });


        if(firstInvalid){

          showToast(
            "Please complete all required vehicle details."
          );

          firstInvalid.focus();

          return;

        }


        const formData =
          new FormData(vehicleDetailsForm);

        const vehicleData = {

          vehicleType:
            selectedVehicle || "Not selected",

          registrationNo:
            formData.get("registrationNo") || "",

          engineNo:
            formData.get("engineNo") || "",

          chassisNo:
            formData.get("chassisNo") || "",

          make:
            formData.get("make") || "",

          model:
            formData.get("model") || "",

          variant:
            formData.get("variant") || "",

          manufacturingYear:
            formData.get("manufacturingYear") || "",

          registrationDate:
            formData.get("registrationDate") || "",

          fuelType:
            formData.get("fuelType") || "",

          gvw:
            formData.get("gvw") || "",

          seatingCapacity:
            formData.get("seatingCapacity") || "",

          vehicleUsage:
            formData.get("vehicleUsage") || "",

          previousInsurer:
            formData.get("previousInsurer") || "",

          previousPolicy:
            formData.get("previousPolicy") || "",

          policyExpiry:
            formData.get("policyExpiry") || "",

          claimHistory:
            formData.get("claimHistory") || "",

          ncb:
            formData.get("ncb") || ""

        };


        window.insuranceHubVehicleData =
          vehicleData;


        showToast(
          "Vehicle details saved. Plan matching is ready for the next step."
        );

        if(vehicleDetailsSubmit){

          vehicleDetailsSubmit.classList.add(
            "form-success"
          );

          vehicleDetailsSubmit.innerHTML =
            'Details Saved <span>✓</span>';

        }

        console.log(
          "Insurance Hub Vehicle Data:",
          vehicleData
        );

      }
    );

  }

})();

/* =========================================================
   VEHICLE PLAN MATCHING — SELECTION & QUOTE FLOW
   ========================================================= */

const vehiclePlanGrid =
  $("#vehiclePlanGrid");

const selectedPlanPanel =
  $("#selectedPlanPanel");

const selectedPlanName =
  $("#selectedPlanName");

const selectedPlanMeta =
  $("#selectedPlanMeta");

const planContinue =
  $("#planContinue");

const matchedVehicle =
  $("#matchedVehicle");

const matchedPlanCount =
  $("#matchedPlanCount");

let selectedInsurancePlan = null;


/* =========================
   UPDATE MATCHED VEHICLE
   ========================= */

function updateMatchedVehicle(){

  if(!matchedVehicle){
    return;
  }

  const vehicle =
    window.insuranceHubVehicleData?.vehicleType ||
    selectedVehicle ||
    "Your selected vehicle";

  matchedVehicle.textContent = vehicle;
}

updateMatchedVehicle();


/* =========================
   PLAN CARDS
   ========================= */

const vehiclePlanCards =
  vehiclePlanGrid
    ? $$(".plan-card", vehiclePlanGrid)
    : [];

if(matchedPlanCount){
  matchedPlanCount.textContent =
    `${vehiclePlanCards.length} Plans`;
}


/* =========================
   SELECT PLAN
   ========================= */

vehiclePlanCards.forEach(card => {

  const selectButton =
    $(".plan-select-btn", card);

  const detailsButton =
    $(".plan-details-btn", card);

  if(selectButton){

    selectButton.addEventListener("click", () => {

      vehiclePlanCards.forEach(item => {
        item.classList.remove("plan-selected");
      });

      card.classList.add("plan-selected");

      const planId =
        card.dataset.planId || "";

      const planName =
        card.dataset.planName || "Selected Plan";

      const premium =
        Number(card.dataset.planPremium || 0);

      selectedInsurancePlan = {
        id: planId,
        name: planName,
        premium: premium
      };

      if(selectedPlanName){
        selectedPlanName.textContent =
          planName;
      }

      if(selectedPlanMeta){

        selectedPlanMeta.textContent =
          `Indicative annual premium: ₹${premium.toLocaleString("en-IN")} • Demo quote`;
      }

      if(selectedPlanPanel){
        selectedPlanPanel.hidden = false;
        selectedPlanPanel.scrollIntoView({
          behavior:"smooth",
          block:"nearest"
        });
      }

      showToast(`${planName} selected.`);

    });

  }


  /* =========================
     VIEW DETAILS
     ========================= */

  if(detailsButton){

    detailsButton.addEventListener("click", () => {

      const planName =
        card.dataset.planName || "Plan";

      const premium =
        Number(card.dataset.planPremium || 0);

      showToast(
        `${planName} • Indicative premium ₹${premium.toLocaleString("en-IN")}`
      );

    });

  }

});


/* =========================
   CONTINUE TO QUOTE
   ========================= */

if(planContinue){

  planContinue.addEventListener("click", () => {

    if(!selectedInsurancePlan){

      showToast(
        "Please select a plan first."
      );

      return;
    }

    const vehicle =
      window.insuranceHubVehicleData?.vehicleType ||
      selectedVehicle ||
      "Vehicle";

    const quoteId =
      `IH-${Date.now().toString().slice(-8)}`;

    window.insuranceHubQuote = {

      quoteId,

      vehicleType: vehicle,

      planId:
        selectedInsurancePlan.id,

      planName:
        selectedInsurancePlan.name,

      indicativePremium:
        selectedInsurancePlan.premium,

      createdAt:
        new Date().toISOString(),

      status:
        "DEMO"

    };

    showToast(
      `Quote ${quoteId} created for ${selectedInsurancePlan.name}.`
    );

    console.log(
      "Insurance Hub Demo Quote:",
      window.insuranceHubQuote
    );

  });

}


/* =========================================================
   VEHICLE QUOTE ENGINE — JS INTEGRATION
   ========================================================= */

const quoteEngineSection =
  $("#quote-engine");

const generateQuoteBtn =
  $("#generateQuoteBtn");

const saveQuoteBtn =
  $("#saveQuoteBtn");

const quoteEngineId =
  $("#quoteEngineId");

const quoteEngineStatus =
  $("#quoteEngineStatus");

const quotePlanName =
  $("#quotePlanName");

const quotePlanInsurer =
  $("#quotePlanInsurer");

const quotePremium =
  $("#quotePremium");

const quoteBasePremium =
  $("#quoteBasePremium");

const quoteTax =
  $("#quoteTax");

const quoteTotal =
  $("#quoteTotal");

const quoteVehicleName =
  $("#quoteVehicleName");

const quoteRegistration =
  $("#quoteRegistration");

const quoteMakeModel =
  $("#quoteMakeModel");

const quoteFuel =
  $("#quoteFuel");

const quoteYear =
  $("#quoteYear");

const quoteNCB =
  $("#quoteNCB");


/* =========================
   FORMAT CURRENCY
   ========================= */

function formatQuoteCurrency(value){

  return `₹${Number(value || 0).toLocaleString("en-IN")}`;

}


/* =========================
   GET VEHICLE DATA
   ========================= */

function getQuoteVehicleData(){

  return window.insuranceHubVehicleData || {};

}


/* =========================
   GENERATE QUOTE
   ========================= */

if(generateQuoteBtn){

  generateQuoteBtn.addEventListener("click", () => {

    if(!selectedInsurancePlan){

      showToast(
        "Please select a plan before generating a quote."
      );

      return;

    }


    const vehicleData =
      getQuoteVehicleData();

    const basePremium =
      Number(
        selectedInsurancePlan.premium || 0
      );

    /*
      Demo GST calculation.
      This is prototype logic only.
    */

    const tax =
      Math.round(basePremium * 0.18);

    const total =
      basePremium + tax;

    const quoteId =
      `IH-${Date.now().toString().slice(-8)}`;


    window.insuranceHubQuote = {

      quoteId,

      vehicleType:
        vehicleData.vehicleType ||
        selectedVehicle ||
        "Vehicle",

      registrationNo:
        vehicleData.registrationNo || "",

      make:
        vehicleData.make || "",

      model:
        vehicleData.model || "",

      fuelType:
        vehicleData.fuelType || "",

      manufacturingYear:
        vehicleData.manufacturingYear || "",

      ncb:
        vehicleData.ncb || "",

      planId:
        selectedInsurancePlan.id,

      planName:
        selectedInsurancePlan.name,

      basePremium,

      tax,

      total,

      status:
        "GENERATED",

      createdAt:
        new Date().toISOString()

    };


    /* =========================
       UPDATE QUOTE UI
       ========================= */

    if(quoteEngineId){

      quoteEngineId.textContent =
        quoteId;

    }

    if(quoteEngineStatus){

      quoteEngineStatus.textContent =
        "GENERATED";

    }

    if(quotePlanName){

      quotePlanName.textContent =
        selectedInsurancePlan.name;

    }

    if(quotePlanInsurer){

      const insurer =
        selectedInsurancePlan.id === "plan-01"
          ? "Demo Insurer A"
          : selectedInsurancePlan.id === "plan-02"
            ? "Demo Insurer B"
            : "Demo Insurer C";

      quotePlanInsurer.textContent =
        `${insurer} • Sample plan`;

    }

    if(quotePremium){

      quotePremium.textContent =
        formatQuoteCurrency(total);

    }

    if(quoteBasePremium){

      quoteBasePremium.textContent =
        formatQuoteCurrency(basePremium);

    }

    if(quoteTax){

      quoteTax.textContent =
        formatQuoteCurrency(tax);

    }

    if(quoteTotal){

      quoteTotal.textContent =
        formatQuoteCurrency(total);

    }


    /* =========================
       VEHICLE SUMMARY
       ========================= */

    if(quoteVehicleName){

      quoteVehicleName.textContent =
        vehicleData.vehicleType ||
        selectedVehicle ||
        "Vehicle";

    }

    if(quoteRegistration){

      quoteRegistration.textContent =
        vehicleData.registrationNo ||
        "—";

    }

    if(quoteMakeModel){

      const make =
        vehicleData.make || "";

      const model =
        vehicleData.model || "";

      quoteMakeModel.textContent =
        [make, model]
          .filter(Boolean)
          .join(" / ") || "—";

    }

    if(quoteFuel){

      quoteFuel.textContent =
        vehicleData.fuelType ||
        "—";

    }

    if(quoteYear){

      quoteYear.textContent =
        vehicleData.manufacturingYear ||
        "—";

    }

    if(quoteNCB){

      quoteNCB.textContent =
        vehicleData.ncb ||
        "—";

    }


    showToast(
      `Quote ${quoteId} generated successfully.`
    );

    if(quoteEngineSection){

      quoteEngineSection.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

    }

    console.log(
      "Insurance Hub Generated Quote:",
      window.insuranceHubQuote
    );

  });

}


/* =========================
   SAVE QUOTE — DEMO
   ========================= */

if(saveQuoteBtn){

  saveQuoteBtn.addEventListener("click", () => {

    if(!window.insuranceHubQuote){

      showToast(
        "Generate a quote first."
      );

      return;

    }


    try{

      localStorage.setItem(
        "insuranceHubDemoQuote",
        JSON.stringify(
          window.insuranceHubQuote
        )
      );

      showToast(
        `Quote ${window.insuranceHubQuote.quoteId} saved on this device.`
      );

    }catch(error){

      console.error(
        "Quote save failed:",
        error
      );

      showToast(
        "Unable to save the demo quote."
      );

    }

  });

}


